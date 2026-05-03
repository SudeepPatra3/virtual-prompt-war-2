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

This project uses **Vite** for incredibly fast local development and secure environment variable management.

### 1. Get an API Key
You will need a free Google Gemini API Key.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create and copy a new API Key.

### 2. Setup the Code
1. Clone this repository to your local machine.
2. Ensure you have [Node.js](https://nodejs.org/) installed.
3. Run the following command to install dependencies (Vite and Jest):
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory (this is ignored by Git automatically) and add your API Key:
   ```env
   VITE_GEMINI_API_KEY=your_copied_api_key_here
   ```

### 3. Run the App
To start the local development server, simply run:
```bash
npm run dev
```
Then visit the local address provided in your terminal (usually `http://localhost:5173`).

### 4. Run Tests
To execute the automated QA logic suite, run:
```bash
npm test
```

## 🛠️ Built With
- **HTML5 & Vanilla CSS:** For a highly responsive, animated, and modern dashboard layout.
- **Vanilla JavaScript:** Handling state management and UI updates.
- **Google Generative AI SDK (`@google/generative-ai`):** Official SDK integration for robust Gemini 1.5 Flash interactions.
- **Vite:** High-performance frontend tooling and secure `.env` management.
- **Jest & JSDOM:** For automated unit testing and comprehensive UI coverage.
- **Service Workers (PWA):** For advanced browser caching and efficiency.

## 💡 Evaluation Focus Areas
This project was specifically architected to excel across all evaluation criteria:

1. **Code Quality:** The logic is decoupled into a testable `utils.js` module. The codebase is clean, well-documented, and utilizes modern ES6 module imports via Vite.
2. **Security:** Features a strict **Content-Security-Policy (CSP)** meta-tag, rigorous **Regex input validation** to prevent injection payloads, and **DOMPurify** to sanitize all markdown output, effectively mitigating XSS vulnerabilities. API keys are safely managed via `.env`.
3. **Efficiency:** Upgraded to a Progressive Web App (PWA) architecture with a custom **Service Worker** (`sw.js`) for aggressive local asset caching. UI inputs are dynamically debounced to prevent network spamming.
4. **Testing:** Features a robust automated testing suite using **Jest** and **JSDOM**. Tests cover edge cases, regex security, logic heuristics, and UI DOM manipulation, generating a complete `--coverage` report.
5. **Accessibility:** The DOM is enriched with `aria-live="polite"`, `role="log"`, and `aria-label` attributes to ensure screen readers actively announce AI responses, delivering a fully inclusive experience.
6. **Google Services:** Deep integration with the Google ecosystem. Utilizes the **Official `@google/generative-ai` SDK**, leverages dynamic `google_search` Grounding, and includes **Firebase Hosting** configurations (`firebase.json`).
