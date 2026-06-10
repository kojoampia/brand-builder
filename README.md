<div align="center">
<img width="1200" height="475" alt="Brand Builder Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Brand Builder

**Brand Builder** is an AI-powered creative suite designed to help you conceptualize and visualize product branding across multiple mediums. By leveraging advanced generative models, it ensures your brand identity remains consistent whether it's on a massive billboard, a classic newspaper ad, or a sleek social media post.

## 🚀 Key Features

- **Automated Brand Identity:** Generate a "Visual Anchor" — a detailed physical description of your product to ensure consistency across all renders.
- **Multi-Medium Visualization:** Instantly see your product in three distinct contexts:
  - **Billboard:** Cinematic, wide-angle outdoor shots.
  - **Newspaper:** Classic, high-contrast monochrome-style layouts.
  - **Social Media:** Modern, studio-quality product photography.
- **AI-Driven Prompt Engineering:** Uses **Gemini 3 Flash** to translate your product description into high-fidelity image prompts.
- **Human-Free Renders:** Focused strictly on iconic product presentation, ensuring the product remains the central star.
- **Brutalist UI:** A bold, high-contrast interface designed for rapid creative iteration.

## 🛠️ Tech Stack

- **Frontend:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **AI Integration:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
  - **Planning:** `gemini-3-flash-preview`
  - **Rendering:** `gemini-2.5-flash-image` (Nano-Banana)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd brand-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📖 How it Works

1.  **Input:** Enter a description of your product vision.
2.  **Plan:** Gemini 3 Flash generates a "Visual Anchor" (materials, lighting, color palette) and three medium-specific prompts.
3.  **Render:** Nano-Banana (Gemini 2.5 Flash Image) generates high-resolution images based on the plan and anchor.
4.  **Iterate:** Refine your description to tweak the brand identity instantly.

---

Built with ⚡ by the AI Studio Team.
