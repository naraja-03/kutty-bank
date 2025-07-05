# KuttyBank - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
KuttyBank is a Threads-style, real-time family budget tracker PWA built with:
- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **State Management**: Redux Toolkit with RTK Query
- **Database**: MongoDB with Mongoose
- **Real-time**: Firebase Firestore
- **UI Style**: Minimal black and white design inspired by Threads/Instagram
- **Target**: Mobile-first, iOS-style layout

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router patterns
- Use Tailwind CSS for styling with mobile-first approach
- Implement components in the specified folder structure:
  ```
  src/components/ui/ComponentName/
    ├── ComponentName.tsx
    ├── index.ts
    └── types.ts
  ```
- Use Lucide React for icons
- Follow Threads-style UI patterns (minimal, clean, black/white theme)

## Key Features
- Real-time transaction tracking
- Family budget management
- Activity feed with social media-style posts
- PWA capabilities
- Responsive design optimized for mobile

## Redux State Structure
- `transactions`: Income/expense entries
- `family`: Family members and roles
- `auth`: User authentication state
- `ui`: Modal states and loading states

## Component Naming
- Use PascalCase for component names
- Use descriptive names that indicate purpose
- Include proper TypeScript interfaces for props

## Database Schema
- **transactions**: amount, category, type, userId, timestamp, note, imageUrl
- **users**: name, email, profileImage, role, familyId
- **family**: name, members, budgetCap, createdAt

Always prioritize mobile-first design and ensure components are accessible with proper ARIA attributes.
