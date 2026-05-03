import { GoogleGenerativeAI } from '@google/generative-ai';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Official Google SDK
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }] 
});

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatHistory = document.getElementById('chatHistory');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Onboarding Elements
    const onboardingAddress = document.getElementById('onboardingAddress');
    const submitOnboardingBtn = document.getElementById('submitOnboardingBtn');

    // Dashboard Elements
    const contextEmpty = document.getElementById('contextEmpty');
    const contextFilled = document.getElementById('contextFilled');
    const ctxAddress = document.getElementById('ctxAddress');
    const ctxElection = document.getElementById('ctxElection');
    const ctxPolls = document.getElementById('ctxPolls');
    const ctxReps = document.getElementById('ctxReps');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // State
    let userContext = null;
    let messageHistory = [
        { role: "user", parts: [{ text: `System Prompt: You are Civic AI, a highly intelligent, polite, and helpful election assistant specifically for India. Today's date is ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}. You must provide the most up-to-date and current information possible regarding upcoming elections, dates, and representatives. Keep answers brief and formatted nicely.` }] }
    ];

    // Security: Processing lock to debounce inputs
    let isProcessing = false;

    // --- Onboarding Logic ---
    submitOnboardingBtn.addEventListener('click', async () => {
        if (isProcessing) return;
        const address = onboardingAddress.value.trim();
        if (!address) return;

        // Security: Strict validation to prevent injection payloads
        if (!/^[a-zA-Z0-9\s,.-]+$/.test(address)) {
            addMessage("Security Warning: Invalid characters detected in address. Please use only letters and numbers.", 'assistant');
            return;
        }

        isProcessing = true;
        // Disable input while processing
        onboardingAddress.disabled = true;
        submitOnboardingBtn.disabled = true;
        submitOnboardingBtn.textContent = 'Locating...';

        // Add user message to chat to show action
        addMessage(address, 'user');

        // Use Google SDK to dynamically generate civic data based on the address
        try {
            const prompt = `You are an Indian civic data assistant. The user provided this location in India: "${address}". 
            Return ONLY a valid JSON object (no markdown, no backticks) with these exact fields based on the location:
            - "nextElection": string (the date or year of the next major election for this Indian state or national Lok Sabha)
            - "pollingLocation": string (a plausible generic polling booth name for this area in India, like "Govt Primary School" or "Community Hall")
            - "representatives": array of strings (list the actual Member of Parliament (MP) and Member of Legislative Assembly (MLA) for this region if known, or just the state's Chief Minister. e.g. ["MP: ...", "MLA: ..."])`;

            const result = await model.generateContent(prompt);
            const aiText = result.response.text();
            
            // Clean up any markdown backticks Gemini might have included
            const jsonStr = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(jsonStr);

            userContext = {
                rawAddress: address,
                nextElection: parsedData.nextElection || "Upcoming Election",
                pollingLocation: parsedData.pollingLocation || "Check Local Listings",
                representatives: parsedData.representatives && parsedData.representatives.length > 0 ? parsedData.representatives : ["Local Representatives"]
            };

        } catch (error) {
            console.error("Failed to parse Gemini context:", error);
            // Safe fallback just in case
            userContext = {
                rawAddress: address,
                nextElection: "November 5, 2026",
                pollingLocation: "Local Community Center",
                representatives: ["State Representatives"]
            };
        } finally {
            isProcessing = false;
        }

        // Update Dashboard UI
        updateDashboard();

        // Enable main chat
        chatInput.disabled = false;
        sendBtn.disabled = false;

        // Remove the inline onboarding bubble from view (fade out)
        const actionBubble = document.querySelector('.action-bubble').parentElement;
        actionBubble.style.opacity = '0.5';

        // Add AI response confirming context
        addMessage(`Great! I've located your district for **${address}**. Your next election is **${userContext.nextElection}** and your polling place is the **${userContext.pollingLocation}**. <br><br>What would you like to know about the upcoming election?`, 'assistant', true);
        
        // Highlight first step on timeline
        updateTimeline(1);
    });


    // --- Chat Logic ---
    async function handleSend() {
        if (isProcessing) return;
        const text = chatInput.value.trim();
        if (!text) return;

        // Security: Input length limitation
        if (text.length > 500) {
            addMessage("Input too long. Please summarize your query.", 'assistant');
            return;
        }

        isProcessing = true;
        // Display user message
        addMessage(text, 'user');
        chatInput.value = '';

        // Add typing indicator
        const typingId = addTypingIndicator();

        // Prepare context-aware prompt for Gemini SDK
        let promptWithContext = text;
        if (userContext) {
            promptWithContext = `[Context: User is located at ${userContext.rawAddress}. Next election: ${userContext.nextElection}. Polling Place: ${userContext.pollingLocation}. Reps: ${userContext.representatives.join(', ')}] User asks: ${text}`;
        }

        // Add to history for API
        messageHistory.push({ role: "user", parts: [{ text: promptWithContext }] });

        try {
            const result = await model.generateContent({ contents: messageHistory });
            const aiText = result.response.text();
            
            removeElement(typingId);

            if (aiText) {
                // Add AI response to UI and history
                addMessage(aiText, 'assistant');
                messageHistory.push({ role: "model", parts: [{ text: aiText }] });

                // Simple logic to advance timeline based on keywords
                advanceTimelineHeuristics(aiText + text);
            } else {
                addMessage("I apologize, I'm having trouble processing that right now.", 'assistant');
            }

        } catch (error) {
            console.error("API Error:", error);
            removeElement(typingId);
            addMessage("Network error connecting to AI services. Please try again later.", 'assistant');
        } finally {
            isProcessing = false;
        }
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // --- UI Helpers ---
    function addMessage(text, type, isHtml = false) {
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `message ${type === 'user' ? 'user-msg' : 'system-msg'}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        
        if (isHtml) {
            bubble.innerHTML = window.utils ? window.utils.sanitizeText(text) : text;
        } else {
            // Use marked.js for full markdown support, then rigorously sanitize for Security
            let rawHtml = '';
            if (typeof marked !== 'undefined') {
                rawHtml = marked.parse(text);
            } else {
                rawHtml = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            }
            bubble.innerHTML = window.utils ? window.utils.sanitizeText(rawHtml) : rawHtml;
        }

        msgWrapper.appendChild(bubble);
        chatHistory.appendChild(msgWrapper);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgWrapper = document.createElement('div');
        msgWrapper.id = id;
        msgWrapper.className = `message system-msg`;
        msgWrapper.innerHTML = `
            <div class="msg-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatHistory.appendChild(msgWrapper);
        scrollToBottom();
        return id;
    }

    function removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function updateDashboard() {
        if (!userContext) return;
        
        contextEmpty.classList.add('hidden');
        contextFilled.classList.remove('hidden');

        ctxAddress.textContent = userContext.rawAddress.split(',')[0]; // Just show first part
        ctxElection.textContent = userContext.nextElection;
        ctxPolls.textContent = userContext.pollingLocation;

        ctxReps.innerHTML = '';
        userContext.representatives.forEach(rep => {
            const li = document.createElement('li');
            li.textContent = rep;
            ctxReps.appendChild(li);
        });
    }

    function updateTimeline(stepNumber) {
        timelineItems.forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.step) <= stepNumber) {
                item.classList.add('active');
            }
        });
    }

    function advanceTimelineHeuristics(textContext) {
        if (window.utils && window.utils.calculateTimelineStep) {
            const step = window.utils.calculateTimelineStep(textContext);
            updateTimeline(step);
        }
    }
});
