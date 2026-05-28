# MockMate X AI - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourrepo/mockmate.git
cd mockmate

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 Key Features Implemented

### ✅ Completed Features

1. **Landing Page**
   - Hero section with animated background
   - Feature showcase with cards
   - Company logos display
   - Demo interactive preview
   - Responsive design

2. **Authentication System**
   - Login/Signup pages
   - Password reset flow
   - Remember me functionality
   - Form validation with React Hook Form + Zod
   - Toast notifications

3. **Dashboard**
   - Performance analytics cards
   - Charts (Area, Radar)
   - Interview history
   - Quick stats
   - Responsive grid layout

4. **Navigation**
   - Collapsible sidebar
   - Top navbar with notifications
   - Profile dropdown
   - Responsive mobile menu

5. **Interview Room**
   - Webcam preview
   - Microphone controls
   - Question display
   - Transcript panel
   - Session controls

6. **Reports & Analytics**
   - Performance trends
   - Score distribution
   - Strength/weakness analysis
   - Export options

## 🎨 Styling Guide

### Using Tailwind Classes

```tsx
// Layout
<div className="flex items-center justify-between gap-4">

// Colors
<div className="bg-violet-600 text-white">

// Responsive
<div className="md:grid-cols-2 lg:grid-cols-3">

// Animations
<motion.div animate={{ opacity: 1 }} className="animate-fade-in">

// Glassmorphism
<div className="glass-panel">
```

### Custom Classes

```tsx
// Badges
<span className="badge-violet">Badge</span>

// Glow effects
<button className="hover-glow shadow-glow-md">

// Tags
<span className="tag-neon-pink">Tag</span>
```

## 🔧 Component Development

### Creating a New Component

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MyComponentProps {
  title: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  icon: Icon,
  children,
}) => {
  return (
    <div className="glass-panel p-6 rounded-xl">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-violet-400" />}
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
};
```

### Using Custom Hooks

```tsx
import { useIsMobile, useDebounce, useLocalStorage } from '@/hooks';

export const MyPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [savedData, setSavedData] = useLocalStorage('myData', {});

  // Use these values...
};
```

### Animations

```tsx
import { motion } from 'framer-motion';

export const AnimatedCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel"
    >
      Content
    </motion.div>
  );
};
```

## 📡 API Integration

### Making API Calls

```tsx
import apiClient from '@/services/apiClient';
import { useEffect, useState } from 'react';

export const MyComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/endpoint');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{/* Render data */}</div>;
};
```

## 🧪 Testing Tips

### Test Component Props

```tsx
// In test file
import { render } from '@testing-library/react';
import { Button } from '@/components/common/Button';

test('renders button with correct variant', () => {
  const { getByRole } = render(
    <Button variant="primary">Click me</Button>
  );
  expect(getByRole('button')).toHaveClass('from-violet-600');
});
```

### Mock API Responses

```tsx
// Mock apiClient for testing
jest.mock('@/services/apiClient', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockData })),
  post: jest.fn(() => Promise.resolve({ data: mockResponse })),
}));
```

## 📋 Common Patterns

### Using Context

```tsx
import { useAuth } from '@/context/auth/AuthContext';

export const ProtectedComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <div>Welcome, {user?.name}</div>;
};
```

### Form Handling

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
};
```

### Conditional Classes

```tsx
const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400';
    case 'failed':
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-slate-500/10 text-slate-400';
  }
};

<div className={getStatusClass(status)}>Status</div>
```

## 🔍 Debugging

### React DevTools

```bash
# Install React DevTools browser extension
# Use $r to inspect component state in console
```

### Console Logging

```tsx
// Log during development
console.log('Component rendered', { user, data });
console.table(reports); // Better for arrays/objects
console.time('operation'); // Measure performance
```

### Network Debugging

```bash
# Check Network tab in DevTools
# Look for API calls, payloads, responses
# Check for CORS issues
```

## 📦 Folder Organization Rules

### Components
- One component per file
- Use component name as filename
- Related components in subdirectories
- Export from index.ts

### Pages
- One page per file
- Named after route (Dashboard.tsx, InterviewRoom.tsx)
- Use layout component wrapper

### Services
- API related functions grouped by endpoint
- One service per major feature
- Export methods from index.ts

### Styles
- Global styles in index.css
- Utilities in glass.css
- Component-specific in components

## 🚨 Common Issues & Solutions

### Issue: Sidebar not collapsing
**Solution**: Check useUI context provider is wrapping app

### Issue: Animations not working
**Solution**: Ensure Framer Motion is imported, check Tailwind animations in config

### Issue: Styles not applying
**Solution**: Verify Tailwind classes are in content config, check specificity

### Issue: API calls not working
**Solution**: Check API URL in .env, verify auth token in localStorage, check CORS

## 📚 File Size Limits

- Bundle size target: < 500KB
- Component file: < 300 lines
- Page file: < 500 lines
- Utility file: < 400 lines

## 🔐 Security Best Practices

1. **Never commit secrets**: Use .env.local
2. **Validate input**: Use Zod schema validation
3. **Sanitize output**: Use React's built-in XSS protection
4. **Auth tokens**: Store securely in localStorage (add httpOnly in production)
5. **HTTPS only**: In production, enforce HTTPS

## 🎯 Performance Checklist

- [ ] Use lazy loading for pages
- [ ] Memoize expensive components
- [ ] Optimize images (use WebP)
- [ ] Minimize bundle size
- [ ] Use CDN for assets
- [ ] Implement code splitting
- [ ] Monitor Core Web Vitals

## 📖 Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes following patterns above
3. Test thoroughly
4. Commit with clear message: `git commit -m "feat: add new feature"`
5. Push and create pull request

## 📞 Support

For issues or questions:
- Check ARCHITECTURE.md for system design
- Review existing components for patterns
- Ask in team Slack/Discord
- Check GitHub issues

---

Happy coding! 🎉
