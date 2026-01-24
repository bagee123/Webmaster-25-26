# Coppell Community Hub

A comprehensive community platform for the City of Coppell, connecting residents with local events, resources, and community information.

> **Note:** This project was created for the TSA Webmaster Competition by the Coppell Team 2003-1.

## Overview

Coppell Community Hub is a modern React web application built with Vite that serves as a centralized hub for community engagement. It provides residents with easy access to local events, community resources, highlights, blogs, and important information about the Coppell community.

## Features

- **Event Management** - Browse and filter upcoming community events
- **Resource Directory** - Discover and submit community resources
- **Blog & News** - Read the latest community news and announcements
- **Community Highlights** - Learn about notable community features and initiatives
- **Dark Mode Support** - Comfortable viewing experience with light and dark themes
- **User Authentication** - User login and signup functionality
- **Responsive Design** - Optimized for desktop and mobile devices
- **Advanced Filtering** - Search and filter events and resources by category

## Technology Stack

- **Frontend Framework** - [React 19](https://react.dev)
- **Build Tool** - [Vite](https://vitejs.dev)
- **Routing** - [React Router v7](https://reactrouter.com)
- **Styling** - Tailwind CSS with custom CSS modules
- **Icons** - [Lucide React](https://lucide.dev)
- **State Management** - React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CoppellCommunityHub
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This generates optimized production files in the `build/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components for routing
├── context/          # React Context for global state
├── css/              # Styling files
├── data/             # Static data (events, resources)
├── hooks/            # Custom React hooks
├── assets/           # Images and media files
├── App.jsx           # Root component
└── main.jsx          # Application entry point
```

### Key Components

- **Navbar** - Navigation header with dark mode toggle
- **EventsGrid** - Display and filter community events
- **ResourceDirectory** - Browse and manage community resources
- **Blog** - Blog post listing and detail pages
- **Hero** - Landing page hero section
- **Footer** - Application footer with links and info

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Linting

The project uses ESLint to maintain code quality. Run linting with:

```bash
npm run lint
```

## Deployment

The project is configured for deployment on Netlify with the `netlify.toml` configuration file.
