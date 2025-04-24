# Spritzy - Speed Reading App 🚀

Spritzy is a modern web application designed to help users improve their reading speed and comprehension using the innovative **Spritz** reading technique. By presenting words one at a time with an **Optimal Recognition Point (ORP)** highlighted, Spritzy minimises eye movement, allowing for faster information processing.

It also includes AI-powered quiz generation to test comprehension after reading.

## ✨ Features

- **Core Spritz Reader:**
  - Displays text word-by-word (or multiple words at a time).
  - Highlights the Optimal Recognition Point (ORP) or "pivot letter" for faster recognition.
  - Adjustable Words Per Minute (WPM) speed control (100-1000 WPM).
  - Configurable number of words displayed at a time (1-5).
  - Text input area to paste or type custom content.
  - Progress bar showing reading position (interactive seeking).
  - Standard Play/Pause/Reset controls.
  - Handles text processing and word splitting.
- **🧠 AI-Powered Quizzes:**
  - Generate comprehension quizzes based on the currently loaded text using AI (via OpenRouter).
  - Supports **Multiple Choice** and **Typed Answer** question formats.
  - **AI Evaluation:** Typed answers are evaluated for correctness and semantic similarity by an AI model.
  - Requires an OpenRouter API key (stored locally in browser storage).
  - Configurable default number of questions and question types.
  - Option for AI to determine the optimal number of questions.
  - Interactive quiz interface with navigation, progress, and results display.
- **👓 Focus Mode:**
  - Immersive, full-screen reading experience to minimise distractions.
  - Separate font and size settings specifically for Focus Mode.
  - Dynamic font size adjustment to fit longer words/phrases on screen.
  - Optional auto-hiding controls during playback.
  - Easy exit using the `ESC` key or exit button.
- **⚙️ Customisation & Settings:**
  - **Font:** Choose font family, size, and letter spacing for both normal and focus modes (Mono, Sans, Serif, Georgia).
  - **Display:** Toggle highlighting of the focus letter and/or a border beneath it.
  - **Theming:**
    - Light/Dark/System mode support (via `next-themes`).
    - Multiple color schemes (Red, Yellow, Blue, Default) affecting primary/accent colors.
  - **Micro-Pauses:** Enable and configure automatic pauses for punctuation (sentence ends, commas, etc.), long words, paragraph breaks, and large numbers to improve rhythm and comprehension. Option to stack pauses or use only the longest applicable one.
  - **Highlight Pattern:** Customise the algorithm for determining the pivot letter based on word length (Advanced).
  - **Reset:** Easily reset all settings to their defaults.
- **💾 Persistence:** User settings (display, font, micro-pauses, quiz defaults) are automatically saved to the browser's Local Storage.

## 🚀 Getting Started

Follow these steps to set up and run the Spritzy project locally:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/spritzy.git # Replace with actual repo URL
    cd spritzy
    ```

2.  **Install Dependencies:**
    Make sure you have Node.js (v18+) and npm installed.

    ```bash
    npm install
    ```

3.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    The application will typically be available at `http://localhost:3000`.

4.  **Configure AI Quiz (Optional):**
    - To use the AI-powered quiz generation feature, you need an API key from [OpenRouter.ai](https://openrouter.ai/).
    - Once the app is running, click the Settings icon (⚙️).
    - Navigate to the "Quiz" tab.
    - Paste your OpenRouter API key into the designated field.
    - **Note:** Your API key is stored _only_ in your browser's Local Storage and is never sent to any server other than OpenRouter's API endpoint during quiz generation/evaluation.
    - If you don't provide an API key, the quiz feature will fall back to generating mock questions.
