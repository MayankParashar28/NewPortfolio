# NewPortfolio

A modern, high-performance portfolio website built with React, TypeScript, and Framer Motion. This project showcases advanced UI/UX design featuring 3D elements, smooth animations, and interactive components.

## 🚀 Tech Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D/Canvas:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / [Drei](https://github.com/pmndrs/drei)
- **Routing:** [Wouter](https://github.com/molefrog/wouter)

## ✨ Key Features

- **3D Interactive Elements:** Custom 3D cursor and background particles.
- **Advanced Animations:** Scroll-triggered reveals, magnetic buttons, and text reveal effects.
- **Glassmorphism:** Modern UI design with backdrop blurs and translucent layers.
- **Performance:** Lazy loading of heavy 3D components and optimized assets.
- **Responsiveness:** Fully responsive design for all device sizes.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/NewPortfolio.git
    cd NewPortfolio
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📁 Project Structure

```
client/src/
├── components/        # Reusable UI components (Hero, About, etc.)
├── pages/             # Route page components (Home, NotFound)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── assets/            # Images and static assets
├── data.ts            # Static content data (edit this to update portfolio info)
├── App.tsx            # Main application component
└── main.tsx           # Entry point
```

## 🎨 Customization

To personalize the portfolio, primarily update the `client/src/data.ts` file. This file contains all the user-specific information, including:
- Name, Title, and About text
- Projects list
- Certificates
- Contact links
- Social media URLs

## 📄 License

[MIT License](LICENSE)
