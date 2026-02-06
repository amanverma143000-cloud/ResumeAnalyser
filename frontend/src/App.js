import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import './styles/index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Page not found</p>
                    <a href="/" className="btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;