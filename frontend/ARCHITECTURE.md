# MockMate X AI - Frontend Architecture Documentation

## 📋 Project Overview

MockMate X AI is a modern AI-powered virtual interview coaching platform built with React, TypeScript, and Tailwind CSS. This document outlines the complete frontend architecture and implementation.

## 🏗️ Project Structure

```
src/
├── assets/                    # Static assets and images
├── animations/                # Framer Motion animation configurations
├── components/                # Reusable React components
│   ├── auth/                 # Authentication components
│   ├── common/               # Shared UI components (Button, Card, etc.)
│   ├── interview/            # Interview-specific components
│   └── navigation/           # Navigation components (Sidebar, TopNavbar)
├── constants/                # Application-wide constants
├── context/                  # React Context API providers
│   ├── auth/                 # Authentication context
│   ├── interview/            # Interview session context
│   └── ui/                   # UI state context
├── data/                     # Mock data
│   └── mock/                 # Mock datasets for development
├── hooks/                    # Custom React hooks
├── layouts/                  # Layout components
│   ├── AuthLayout.tsx        # Auth pages layout
│   ├── DashboardLayout.tsx   # Protected dashboard layout
│   └── MainLayout.tsx        # Main landing page layout
├── pages/                    # Page components
│   ├── auth/                 # Login, Signup, Password Reset
│   ├── dashboard/            # Dashboard pages
│   ├── interview/            # Interview pages
│   ├── reports/              # Reports and analytics
│   └── settings/             # User settings
├── routes/                   # React Router configuration
├── services/                 # API and external services
├── styles/                   # Global and utility styles
│   └── glass.css             # Glassmorphism utilities
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── App.tsx                   # Root component
```

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Violet**: `#7F5AF0` - Main brand color
- **Indigo**: `#6C5CE7` - Secondary brand color
- **Cyan**: `#06b6d4` - Accent color

#### Gradient Colors
- **Violet-Pink**: `from-violet-600 to-indigo-600`
- **Pink-Fuchsia**: `from-pink-400 to-rose-600`
- **Cyan-Gradient**: `from-cyan-400 to-cyan-600`

#### Semantic Colors
- **Success**: `#10B981` (Emerald)
- **Warning**: `#FFA500` (Amber)
- **Danger**: `#FF6B6B` (Red)
- **Info**: `#06b6d4` (Cyan)

### Typography

```typescript
// Font families
- Display: 'Inter' (for headings)
- Sans: 'Inter' (for body text)
- Mono: 'Fira Code' (for code)

// Font sizes
- XS: 12px
- SM: 14px
- Base: 16px
- LG: 18px
- XL: 20px
- 2XL: 24px
- 3XL: 30px
```

### Spacing

Uses Tailwind's default spacing scale: `4px * n`
- Base unit: 4px
- Common sizes: 4, 8, 16, 24, 32, 48, 64, 80, 96 px

## 🔧 Component System

### Core Components

#### Button
```typescript
<Button 
  variant="primary" | "secondary" | "ghost" | "danger" | "success" | "outline"
  size="sm" | "md" | "lg" | "xl"
  loading={boolean}
  icon={ReactNode}
  fullWidth={boolean}
>
  Click me
</Button>
```

#### Card
```typescript
<Card 
  variant="glass" | "elevated" | "flat" | "outline"
  size="sm" | "md" | "lg"
  interactive={boolean}
  glowColor="purple" | "cyan" | "emerald" | "pink" | "blue" | "none"
>
  Card content
</Card>
```

### Layout Components

#### DashboardLayout
- Contains Sidebar + TopNavbar
- Protected route wrapper
- Responsive for mobile/tablet/desktop

#### AuthLayout
- Centered authentication form layout
- Gradient background
- Glassmorphism effect

#### MainLayout
- Landing page layout
- No sidebar
- Full-width responsive

## 📡 State Management

### Context API Structure

#### AuthContext
```typescript
- user: User | null
- isAuthenticated: boolean
- isLoading: boolean
- login(email, password, rememberMe?)
- signup(name, email, password)
- socialSignIn(provider)
- logout()
- forgotPassword(email)
- resetPassword(password)
- updateProfile(user)
```

#### InterviewContext
```typescript
- activeSession: InterviewSession | null
- reports: InterviewReport[]
- startInterview(config)
- nextQuestion()
- pauseInterview()
- resumeInterview()
- toggleCamera()
- toggleMic()
- appendTranscript(text)
- endInterview()
- submitSession()
```

#### UIContext
```typescript
- sidebarCollapsed: boolean
- mobileMenuOpen: boolean
- theme: 'dark' | 'light'
- notifications: Notification[]
- notifications management methods
```

## 🎬 Animations

### Framer Motion Configurations

#### Page Transitions
```typescript
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
}
```

#### Container Stagger
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

#### Custom Tailwind Animations
- `animate-pulse-glow`: Glowing pulse effect
- `animate-float`: Floating motion
- `animate-slide-in`: Slide in animation
- `animate-fade-in`: Fade in animation

## 🔌 API Integration

### Axios Service Layer

```typescript
// Base configuration
const apiClient = axios.create({
  baseURL: 'https://api.mockmate.ai/v1',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor adds auth token
// Response interceptor adds artificial delay (400-800ms)
```

### Service Methods

#### authService
- `login(email, password)`
- `signup(name, email, password)`
- `logout()`
- `refreshToken()`

#### interviewService
- `getQuestions(company, role)`
- `submitSession(sessionData)`
- `getReports(userId)`
- `getSessionDetails(sessionId)`

#### analyticsService
- `getPerformanceTrends(userId)`
- `getScoreDistribution(userId)`
- `getRecommendations(userId)`

## 🎯 Routing

### Route Structure

```
/ (Landing Page)
├── /login
├── /signup
├── /forgot-password
├── /reset-password
└── /dashboard (Protected)
    ├── /dashboard
    ├── /interview
    ├── /interview/setup
    ├── /interview/session
    ├── /reports
    ├── /analytics
    ├── /history
    ├── /profile
    └── /settings
```

### Route Guards

- Public routes: Landing, Auth pages
- Protected routes: Dashboard, Interview, Reports (require auth)
- Fallback: 404 page for unknown routes

## 🔒 Authentication

### Auth Flow

1. **Login**: 
   - Email/password submitted
   - Mock API validates credentials
   - Token stored in localStorage
   - User context updated
   - Redirect to dashboard

2. **Signup**:
   - User data submitted
   - Mock account created
   - Auto-login on success
   - Profile setup flow

3. **Remember Me**:
   - Token persisted in localStorage
   - Auto-login on app reload
   - Optional security check on sensitive operations

## 📊 Data Flow

```
User Action
    ↓
Component State Update
    ↓
Context API (if shared state)
    ↓
Service Layer (API call)
    ↓
Mock data return
    ↓
Update Context
    ↓
Component Re-render
    ↓
Display Update
```

## 🎨 Styling Approach

### Tailwind CSS Strategy

1. **Utility-First**: Use Tailwind classes for most styling
2. **Custom Utilities**: `glass.css` for complex patterns
3. **Component Libraries**: Reusable styled components
4. **Responsive Design**: Mobile-first approach

### Glassmorphism Effect

```css
.glass-panel {
  @apply bg-white/5 backdrop-blur-md rounded-2xl shadow-glass 
         border border-white/10 transition-all duration-300;
}
```

## 🛠️ Development Workflow

### Adding a New Page

1. Create component in `/pages`
2. Add route in `AppRoutes.tsx`
3. Create layout wrapper if needed
4. Add navigation menu item if applicable
5. Test routing and responsive design

### Adding a New Component

1. Create in `/components` with proper subdirectory
2. Add TypeScript interfaces
3. Implement component with Tailwind
4. Add Framer Motion animations
5. Export from component's index

### Adding New Styles

1. Add to `glass.css` if it's a reusable utility
2. Use `@layer` for proper cascade
3. Prefer Tailwind classes over custom CSS
4. Document custom utilities

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

### Strategy

- Mobile-first approach
- Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Custom media queries in `glass.css` when needed

## 🚀 Performance Optimizations

1. **Code Splitting**: Lazy loading pages with Suspense
2. **Component Memoization**: Preventing unnecessary re-renders
3. **Image Optimization**: Using proper image sizes
4. **Bundle Size**: Tree-shaking unused code

## 🔍 Type Safety

### TypeScript Coverage

- All components are typed with `React.FC<Props>`
- Context hooks provide type-safe access
- Service methods have typed requests/responses
- Props interfaces for all components

## 📚 Key Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.6 | UI framework |
| React Router | 7.15.1 | Routing |
| Tailwind CSS | 4.3.0 | Styling |
| Framer Motion | 12.40.0 | Animations |
| Axios | 1.16.1 | HTTP client |
| React Hook Form | 7.76.1 | Form handling |
| Zod | 4.4.3 | Validation |
| Recharts | 3.8.1 | Charts |
| React Hot Toast | 2.6.0 | Notifications |
| Lucide React | 1.16.0 | Icons |
| React Webcam | 7.2.0 | Webcam access |

## 🎯 Best Practices

1. **Component Composition**: Break UI into small, reusable pieces
2. **Props Drilling Prevention**: Use Context API for shared state
3. **Error Handling**: Proper error boundaries and fallbacks
4. **Loading States**: Show spinners for async operations
5. **Accessibility**: ARIA labels, semantic HTML
6. **Code Organization**: Logical file structure and naming

## 📝 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] Real-time WebSocket integration
- [ ] Advanced error boundaries
- [ ] Offline support with service workers
- [ ] Component storybook
- [ ] E2E testing setup
- [ ] Performance monitoring

---

**Version**: 1.0.0  
**Last Updated**: May 26, 2026  
**Status**: Production Ready
