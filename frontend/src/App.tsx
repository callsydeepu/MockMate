import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/auth/AuthContext';
import { UIProvider } from './context/ui/UIContext';
import { InterviewProvider } from './context/interview/InterviewContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <InterviewProvider>
            {/* Custom styled React Hot Toast popup notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'glass-panel text-white text-xs font-semibold border-white/10 p-4',
                style: {
                  background: 'rgba(10, 15, 30, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ec4899',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <AppRoutes />
          </InterviewProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
