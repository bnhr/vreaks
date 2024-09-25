# VREAKS

> An opinionated React and Vite template for accelerating modern Single Page Application (SPA) development

VREAKS is a carefully curated template that combines the power of Vite and React with a selection of essential technologies to jumpstart your next Single Page Application (SPA) project. It aims to provide a solid foundation with best practices and optimal configurations out of the box, specifically tailored for client-side rendered applications.

## Features

- Lightning-fast development with Vite
- Modern React setup with TypeScript support for SPAs
- Pre-configured styling with Tailwind CSS
- Efficient client-side state management using Zustand
- Optimized data fetching with Tanstack Query
- Consistent code style enforced by ESLint and Prettier
- Focus on Single Page Application (SPA) architecture

## Getting Started

### Prerequisites

- Node.js (version 20 or later)
- PNPM, NPM, or Yarn

### Installation

Choose your preferred package manager:

#### Using PNPM (recommended)

```bash
git clone https://github.com/bnhr/vreaks.git your-project-name
cd your-project-name
pnpm install
pnpm run dev
```

#### Using NPM

```bash
git clone https://github.com/bnhr/vreaks.git your-project-name
cd your-project-name
npm install
npm run dev
```

#### Using Yarn

```bash
git clone https://github.com/bnhr/vreaks.git your-project-name
cd your-project-name
yarn
yarn dev
```

After installation, make sure to remove the Git history to start fresh:

```bash
rm -rf .git
```

## Essential Technologies

- **React 18**: The latest version of React for building user interfaces, offering improved performance and new features for SPAs.
- **TypeScript**: Adds static typing to JavaScript, enhancing code quality and developer productivity in large-scale SPA projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development without conflicting styles, perfect for component-based SPA architectures.
- **Prettier with Tailwind Plugin**: Ensures consistent code formatting, including proper Tailwind class sorting.
- **ESLint**: Identifies and fixes code quality issues, using the new ESLint flat config for improved performance.
- **Zustand**: A minimal state management solution that simplifies complex state logic in SPAs.
- **Tanstack Query**: Powerful data synchronization for React, optimizing client-side data fetching and caching in SPAs.

## Development

After installation, you can start developing your SPA project:

1. Run the development server: `pnpm run dev`
2. Open your browser and visit `http://localhost:5173`
3. Start editing the files in the `src` directory. The changes will be reflected in real-time.

## Todo

- [ ] Implement headless components as a design system using Radix UI or React Aria Components for customizable, accessible UI elements in SPAs.
- [ ] Migrate to Biome for faster linting and formatting once it's stable.
- [ ] Integrate Bun as a faster JavaScript runtime alternative to Node.js.
