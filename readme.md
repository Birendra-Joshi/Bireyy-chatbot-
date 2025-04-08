Bireyy - Playful AI Chatbot

Mannu is a friendly and playful AI chatbot designed for casual conversations. It leverages the power of Gemini AI to provide helpful, engaging, and sometimes humorous responses.

Features

Casual Conversations: Mannu is designed to be a conversational chatbot, perfect for chatting about your day, asking questions, or just having some fun.

Friendly and Playful Tone: Mannu's personality is designed to be approachable and light-hearted.

Gemini AI Powered: Utilizes the Gemini AI model for generating responses.

Beautiful UI: A clean and production-worthy user interface using shadcn/ui for a consistent design.


Technologies Used

React: A JavaScript library for building user interfaces.

TypeScript: A strongly-typed superset of JavaScript.

Vite: A fast build tool for modern web development.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

shadcn/ui: A collection of reusable UI components built with Radix UI and Tailwind CSS.

Lucide React: A library of beautiful icons.

Axios: A promise-based HTTP client for making requests to the Gemini API.

uuid: For creating unique identifiers.

Next Themes: For easy theme toggling.


Getting Started

1. Clone the repository:

git clone https://github.com/Manish-Tamang/Mannu-Chatbot.git

cd Mannu-Chatbot



Install dependencies:

npm install

Create a .env file in the root directory and add your Gemini API key:

VITE_API_KEY=YOUR_GEMINI_API_KEY

Replace YOUR_GEMINI_API_KEY with your actual Gemini API key.

Run the development server:

npm run dev

Open your browser and navigate to http://localhost:5173 to see Mannu in action.

Project Structure

├── .bolt # Bolt configuration files  
│ ├── config.json # Template configuration  
│ ├── ignore # Files ignored by Bolt  
│ └── prompt # Custom prompt for Bolt  
├── .gitignore # Git ignore file  
├── components.json # shadcn/ui components configuration  
├── eslint.config.js # ESLint configuration  
├── favicon.ico # Favicon  
├── index.html # HTML entry file  
├── package-lock.json # npm package lock file  
├── package.json # npm package manifest  
├── postcss.config.js # PostCSS configuration  
├── readme.md # This README file  
├── src # Source code directory  
│ ├── App.css # Global CSS styles  
│ ├── App.tsx # Main application component  
│ ├── components # React components  
│ │ ├── chat # Chat related components  
│ │ │ ├── chat-input.tsx # Chat input component  
│ │ │ └── chat-message.tsx # Chat message component  
│ │ └── ui # Reusable UI components  
│ │ ... # Many UI components from shadcn/ui  
│ ├── hooks # Custom React hooks  
│ │ └── use-toast.ts # Custom toast hook  
│ ├── index.css # Global CSS styles  
│ ├── lib # Utility functions  
│ │ └── utils.ts # Utility functions  
│ ├── main.tsx # Entry point for React  
│ └── vite-env.d.ts # Vite environment types  
├── tailwind.config.js # Tailwind CSS configuration  
├── tsconfig.app.json # TypeScript application configuration  
├── tsconfig.app.tsbuildinfo # TypeScript build info  
├── tsconfig.json # TypeScript configuration  
├── tsconfig.node.json # TypeScript Node configuration  
├── tsconfig.node.tsbuildinfo # TypeScript build info  
└── vite.config.ts # Vite build configuration

Contributing

Contributions are welcome! Feel free to submit pull requests, report issues, or suggest new features.

License

This project is licensed under the MIT License - see the LICENSE file for details.

