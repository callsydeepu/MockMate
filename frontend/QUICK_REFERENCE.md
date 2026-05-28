# MockMate X AI - Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Styling Quick Reference

### Common Tailwind Classes

```tsx
// Layout
className="flex items-center justify-between gap-4"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Colors & Backgrounds
className="bg-violet-600 text-white"
className="bg-gradient-to-r from-violet-600 to-indigo-600"

// Spacing
className="p-6 px-8 py-4"
className="my-4 mx-auto"

// Typography
className="text-lg font-bold tracking-wide"
className="text-gradient" // Custom gradient text

// Effects
className="shadow-glass shadow-glow-md"
className="glass-panel" // Glassmorphism
className="hover-glow" // Glow on hover

// Responsive
className="hidden md:block" // Hide on mobile
className="w-full md:w-1/2" // Responsive width

// Animations
className="animate-fade-in animate-pulse-glow"
```

## 🧩 Component Quick Snippets

### Button
```tsx
import { Button } from '@/components/common/Button';
import { ChevronRight } from 'lucide-react';

<Button 
  variant="primary"
  size="lg"
  icon={<ChevronRight />}
  loading={isLoading}
>
  Click Me
</Button>
```

### Card
```tsx
import { Card } from '@/components/common/Card';

<Card 
  variant="elevated"
  interactive
  glowColor="cyan"
>
  Card content here
</Card>
```

### Badge
```tsx
<span className="badge-violet">Important</span>
<span className="badge-cyan">Info</span>
<span className="badge-success">Success</span>
<span className="badge-danger">Error</span>
```

## 🔌 Hooks Quick Reference

### Media Query Hooks
```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks';

const isMobile = useIsMobile(); // true if < 640px
const isTablet = useIsTablet(); // true if < 1024px
const isDesktop = useIsDesktop(); // true if > 1024px
```

### Debounce Hook
```tsx
import { useDebounce } from '@/hooks';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

// Use debouncedSearch for API calls
```

### Local Storage Hook
```tsx
import { useLocalStorage } from '@/hooks';

const [user, setUser] = useLocalStorage('user', null);
// Automatically syncs with localStorage
```

## 📡 API Calls Quick Pattern

```tsx
import apiClient from '@/services/apiClient';
import { useEffect, useState } from 'react';

export const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get('/endpoint')
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{/* render data */}</div>;
};
```

## 🎯 Form Handling Quick Pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email?.message}
    </form>
  );
};
```

## 🔐 Using Context

```tsx
import { useAuth } from '@/context/auth/AuthContext';

export const Component = () => {
  const { user, login, logout } = useAuth();
  
  return <div>Hello, {user?.name}</div>;
};
```

## 🎬 Animation Pattern

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>
```

## 📝 Creating a Page

1. Create file in `src/pages/`
2. Import layout
3. Import components
4. Add route in `AppRoutes.tsx`

```tsx
import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const MyPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
};

export default MyPage;
```

## 🧭 Navigation

### Add menu item
1. Update menu items array in Sidebar
2. Add route in AppRoutes
3. Component will auto-highlight

### Navigate programmatically
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard'); // Go to dashboard
navigate(-1); // Go back
```

## 🎨 Colors

### Brand Colors
- **Violet**: `#7F5AF0` (primary)
- **Indigo**: `#6C5CE7` (secondary)
- **Cyan**: `#06b6d4` (accent)

### Using in Classes
```tsx
// Bg colors
className="bg-violet-600 bg-cyan-400 bg-emerald-600"

// Text colors  
className="text-violet-400 text-cyan-300 text-emerald-400"

// Borders
className="border-violet-500/30 border-cyan-500/50"

// Opacity variants
className="bg-violet-600/10 bg-violet-600/20 bg-violet-600/50"
```

## 📱 Responsive Breakpoints

```tsx
// Mobile < 640px
// Tablet 640px - 1024px
// Desktop > 1024px

className="flex md:grid lg:flex-col"
className="text-sm md:text-base lg:text-lg"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## 🔍 Common Tasks

### Show loading spinner
```tsx
<div className="w-12 h-12">
  <div className="absolute inset-0 rounded-full border-4 border-violet-500/10" />
  <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
</div>
```

### Show toast notification
```tsx
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

### Format data
```tsx
import { 
  formatDate, 
  formatTime, 
  formatDuration,
  getRelativeTime 
} from '@/utils';

formatDate(new Date()); // "May 26, 2026"
formatTime(new Date()); // "10:30 AM"
formatDuration(3661); // "1h 1m 1s"
getRelativeTime(date); // "2 hours ago"
```

### Get score color
```tsx
import { getScoreColor } from '@/utils';

className={getScoreColor(score)} // Returns text color
```

## 🐛 Debugging Tips

### Check component state
```tsx
// Console
$r // React component state in DevTools

// Logs
console.log({ user, data });
console.table(records);
console.time('name');
```

### Check network requests
- Open DevTools → Network tab
- Look for API calls
- Check request/response bodies

### Check styling
- Inspect element in DevTools
- Check computed styles
- Verify Tailwind classes applied

## ⚡ Performance Tips

1. Use `lazy()` for page components
2. Memoize expensive components
3. Debounce search/input
4. Use `useCallback` for event handlers
5. Lazy load images
6. Split code into routes

## 📚 File Locations

```
src/
├── components/      # UI components
├── pages/          # Route pages
├── layouts/        # Layout wrappers
├── context/        # State management
├── hooks/          # Custom hooks
├── services/       # API calls
├── utils/          # Helpers
├── types/          # TypeScript types
├── constants/      # App constants
└── styles/         # Global styles
```

## 🎓 Learning Resources

- **ARCHITECTURE.md** - System design
- **DEVELOPMENT.md** - Detailed guide
- **Tailwind Docs**: tailwindcss.com
- **React Docs**: react.dev
- **Framer Motion**: framer.com/motion

---

**Pro Tips:**
- Use `ctrl+shift+p` in VSCode to run commands
- Format code: `Shift+Alt+F`
- Quick file open: `Ctrl+P`
- Search in files: `Ctrl+Shift+F`

Keep this handy for quick reference! 🚀
