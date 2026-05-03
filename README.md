# 🗳️ Civic AI: Smart Election Assistant (India)

## 📌 About The Project
This project is an interactive, AI-powered web application designed to help users easily navigate the Indian electoral process. Built for a challenge to demonstrate a "smart, dynamic assistant," this tool uses contextual awareness to guide users through timelines, preparation steps, and local civic data.

### ✨ Key Features
- **Conversational AI Assistant:** Powered directly by the **Google Gemini API**, the assistant can explain complex Indian election concepts like Lok Sabha, Vidhan Sabha, EVMs, and Voter ID registration in simple terms.
- **Dynamic Context Generation:** By simply entering an Indian address, the app uses generative AI to instantly infer your local representatives (MP/MLA), next major election dates, and plausible polling booths.
- **Interactive Timeline:** A visual "Election Journey" tracker that dynamically highlights your current step (Registration, Research, Voting Plan, Election Day) based on your chat context.
- **Premium UI/UX:** Built with modern CSS Glassmorphism, smooth animations, and robust Markdown support (via Marked.js) for beautiful, readable AI responses.
- **No Backend Required:** A pure frontend vanilla JavaScript solution that creatively uses Gemini for both conversational logic and structured data extraction.

## 🚀 Getting Started

To run this project locally, you don't need Node.js or any complex build tools. It runs entirely in your browser!

### 1. Get an API Key
You will need a free Google Gemini API Key.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create and copy a new API Key.

### 2. Setup the Code
1. Clone this repository to your local machine.
2. Open `script.js` in any text editor.
3. On line 1, replace `'YOUR_API_KEY_HERE'` with your actual Gemini API Key:
   ```javascript
   const GEMINI_API_KEY = 'AIzaSy...'; // Put your key here
   ```
   *(⚠️ Important: Remember to remove your real API key before pushing this code to a public repository!)*

### 3. Run the App
You can simply double-click the `index.html` file to open it in your browser. 

Alternatively, if you prefer using a local development server, you can run:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

## 🛠️ Built With
- **HTML5 & Vanilla CSS:** For a highly responsive, animated, and modern dashboard layout.
- **Vanilla JavaScript:** Handling state management, UI updates, and API logic without the overhead of heavy frameworks.
- **Google Gemini 1.5 Flash:** Powering the conversational engine and location-based data inference.
- **Marked.js:** For securely rendering Markdown syntax (bolding, lists, italics) inside the chat bubbles.

## 💡 Challenge Alignment
This project was built to satisfy the specific challenge expectations:
1. **Build a smart, dynamic assistant:** Fully realized via the integrated, highly conversational chat interface.
2. **Logical decision making based on user context:** The AI automatically adapts its answers and context board based on the specific location entered by the user.
3. **Effective use of Google Services:** Leverages the Generative Language API creatively to solve both text-generation and structured data-extraction problems.
4. **Real-world usability:** Solves a real problem (voter education in India) with a highly intuitive user interface.
5. **Clean and maintainable code:** Structured simply across three core files (`index.html`, `style.css`, `script.js`) making it incredibly easy to review, deploy, and maintain.
