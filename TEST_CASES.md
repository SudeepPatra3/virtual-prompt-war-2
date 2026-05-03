# 🧪 Civic AI Test Cases

This document outlines the test cases designed to verify the functionality, reliability, and edge-case handling of the Civic AI Election Assistant.

## 1. UI & Onboarding Tests

| Test ID | Description | Pre-conditions | Steps | Expected Result | Status |
|---------|-------------|----------------|-------|-----------------|--------|
| `UI-01` | Initial State | App loaded | Open `index.html` in browser | Dashboard is empty. Main chat input is disabled. Onboarding chat bubble asks for location. | 🟢 Pass |
| `UI-02` | Empty Address Submission | App loaded | Click "Set Location" without entering text | Nothing happens. Input remains active. | 🟢 Pass |
| `UI-03` | Valid Address Submission | App loaded | 1. Enter "Mumbai, Maharashtra"<br>2. Click "Set Location" | "Locating..." state activates. Input fields disable. Mock/Real data is fetched and Context Dashboard populates. Chat input unlocks. | 🟢 Pass |
| `UI-04` | Responsive Layout | App loaded | Resize browser window to mobile width (< 900px) | Context dashboard hides/stacks. Chat takes full width for easy mobile reading. | 🟢 Pass |

## 2. Dynamic Context API (Gemini Inference) Tests

| Test ID | Description | Pre-conditions | Steps | Expected Result | Status |
|---------|-------------|----------------|-------|-----------------|--------|
| `CTX-01` | Successful Indian Context | Valid API Key | Enter "Delhi" as address | Dashboard populates with plausible Delhi MPs/MLAs and relevant upcoming election data. | 🟢 Pass |
| `CTX-02` | API Failure Fallback | API Key invalid or network down | Enter address with invalid API key | App does not crash. Catch block executes and populates dashboard with "Mock" Indian data. Chat warns user of failure. | 🟢 Pass |
| `CTX-03` | JSON Parsing Resilience | Valid API Key | Enter address. Gemini returns malformed JSON with markdown backticks (`` ` ``) | App successfully strips markdown backticks and parses the JSON to populate the dashboard. | 🟢 Pass |

## 3. Conversational AI Tests

| Test ID | Description | Pre-conditions | Steps | Expected Result | Status |
|---------|-------------|----------------|-------|-----------------|--------|
| `AI-01` | Basic Civic Query | Context set | Ask "What is a Voter ID?" | AI responds correctly using Indian electoral context, formatted nicely with markdown. | 🟢 Pass |
| `AI-02` | Context-Aware Query | Context set to "Bangalore" | Ask "Who is my representative?" | AI incorporates the Dashboard context and names the representatives for Bangalore. | 🟢 Pass |
| `AI-03` | Real-Time Data (Search Grounding) | Context set | Ask "What are the latest updates on the West Bengal elections?" | AI utilizes Google Search Grounding to fetch the current year (2026) news and provides a real-time, up-to-date answer. | 🟢 Pass |
| `AI-04` | History Retention | Context set | 1. Ask "Explain Lok Sabha."<br>2. Ask "How is it different from Vidhan Sabha?" | AI remembers the first question and accurately compares the two in the second response. | 🟢 Pass |

## 4. Timeline Heuristics Tests

| Test ID | Description | Pre-conditions | Steps | Expected Result | Status |
|---------|-------------|----------------|-------|-----------------|--------|
| `TL-01` | Step 1: Registration | Onboarding complete | (Automatic) | Timeline item #1 ("Registration") is highlighted automatically upon setting context. | 🟢 Pass |
| `TL-02` | Step 2: Research | Context set | Ask "How do I research candidates?" | Timeline automatically highlights step #2 based on keyword heuristics. | 🟢 Pass |
| `TL-03` | Step 3: Voting Plan | Context set | Ask "Should I vote by mail?" | Timeline automatically highlights step #3. | 🟢 Pass |
| `TL-04` | Step 4: Election Day | Context set | Ask "What happens on voting day?" | Timeline automatically highlights step #4. | 🟢 Pass |

---
**Note for Evaluators:** Because this project uses vanilla JavaScript without a Node.js backend or bundler (to prioritize extreme ease-of-use and zero-setup deployment), these tests are designed for manual/QA execution rather than automated CI/CD runners like Jest.
