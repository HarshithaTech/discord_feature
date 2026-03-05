import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { MainLayout } from './components/layout/MainLayout';
import type { Session } from '@supabase/supabase-js';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#060608] text-white">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-[#00f0ff] rounded-2xl flex items-center justify-center cyan-glow animate-pulse">
            <BookOpen className="text-[#040506] w-8 h-8" />
          </div>
          <div className="absolute -inset-4 bg-[#00f0ff]/20 blur-2xl rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-black tracking-tighter text-[#00f0ff] animate-pulse">EDUSPHERE DISCORD</h2>
          <p className="text-[#949ba4] text-xs font-bold tracking-[0.2em] uppercase opacity-50">Initializing System</p>
        </div>
      </div>
    );
  }

  // Fallback if env vars are missing
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === "YOUR_SUPABASE_URL") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#060608] text-white p-10 text-center">
        <div className="bg-[#08090b] border border-[#f23f42]/20 p-8 rounded-2xl max-w-md shadow-2xl">
          <h1 className="text-2xl font-black mb-4 text-[#f23f42]">CONFIGURATION ERROR</h1>
          <p className="text-[#949ba4] mb-6">EduSphere requires valid Supabase credentials to synchronize with the neural network.</p>
          <div className="bg-[#040506] p-4 rounded-xl border border-[#1e1f22] text-left">
            <p className="text-xs font-mono text-white opacity-60 mb-2">// Missing credentials:</p>
            <code className="text-[#00f0ff] text-sm break-all">VITE_SUPABASE_URL</code>
            <br />
            <code className="text-[#00f0ff] text-sm break-all">VITE_SUPABASE_ANON_KEY</code>
          </div>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/" element={session ? (
          <MainLayout user={user} />
        ) : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
