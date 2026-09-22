<<<<<<< HEAD
# Tech Vibe Frontend

Tech Vibe is a modern E-Commerce and FinTech platform frontend built with React, TypeScript, Vite, and Tailwind CSS. It is designed to deliver a premium, high-performance shopping experience with integrated financial features.

## Features Implemented

- **Storefront & Catalog**: Dynamic homepage banners, product grids, and advanced filtering/search capabilities.
- **Product Details & Wishlist**: Rich product pages with image galleries, reviews, and wishlist management.
- **Cart & Checkout**: Seamless shopping cart and a multi-step checkout process with various shipping and payment options.
- **TechVibe Later (TLater)**: Integrated PayLater financing solution with credit limit visualization, installment plans, and transaction history.
- **Vibe Poin (Loyalty Program)**: A double-entry immutable ledger system for point accrual and redemption.
- **Order Center**: Comprehensive order management with status filtering, contextual actions (Pay, Cancel, Complete), and detailed invoices.
- **Logistics Tracking**: Visual stepper timeline for real-time courier tracking.
- **TechVibe Care**: Interactive help center with FAQs, categorized ticketing system, and real-time conversation threads.
- **Notification Center**: Global notification dropdown for order updates, promos, and ticket replies.
- **Dark Mode & Responsive Design**: Fully responsive UI with a seamless dark mode experience.

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Zustand (Context/Hooks)
- **Routing**: React Router DOM
- **API Mocking**: Axios (Interceptors/Mock Services)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

### Build for Production

To create a production-ready bundle:

```bash
npm run build
```

## Project Structure

```text
src/
├── assets/
├── components/
├── features/
│   ├── [feature]/
│   │   ├── api/
│   │   ├── components/
│   │   ├── views/
│   │   └── types/
├── lib/
├── stores/
├── App.css
├── index.css
├── router.tsx
└── main.tsx
```

## License

© 2026 Tech Vibe. Hak Cipta Dilindungi.
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
