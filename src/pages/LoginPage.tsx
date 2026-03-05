import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, ShieldCheck, Mail, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (loginError) throw loginError;
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#060608] p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#00f0ff]/10 blur-[128px] rounded-full" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#00f0ff]/5 blur-[128px] rounded-full" />

            <div className="bg-[#08090b] border border-[#1e1f22] p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transition-all hover:border-[#00f0ff]/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#00f0ff] rounded-2xl flex items-center justify-center mb-4 cyan-glow transition-transform hover:scale-110 duration-500">
                        <BookOpen className="text-[#040506] w-8 h-8" />
                    </div>
                    <h2 className="text-[#00f0ff] text-xs font-black tracking-[0.3em] uppercase mb-2">EDUSPHERE DISCORD PORTAL</h2>
                    <h1 className="text-white text-3xl font-black mb-1 tracking-tight">Access Granted</h1>
                    <p className="text-[#949ba4] text-sm">Synchronizing neural link...</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-xs font-bold uppercase tracking-wider flex items-center gap-3 animate-shake">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-[#949ba4] text-[10px] font-black uppercase tracking-widest ml-1">Universal ID</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4f5660] group-focus-within:text-[#00f0ff] transition" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#040506] border border-[#1e1f22] focus:border-[#00f0ff]/50 text-white pl-10 pr-4 py-3 rounded-xl outline-none transition-all placeholder:text-[#4f5660] text-sm font-medium"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[#949ba4] text-[10px] font-black uppercase tracking-widest ml-1">Access Protocol</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4f5660] group-focus-within:text-[#00f0ff] transition" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#040506] border border-[#1e1f22] focus:border-[#00f0ff]/50 text-white pl-10 pr-4 py-3 rounded-xl outline-none transition-all placeholder:text-[#4f5660] text-sm font-medium"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00f0ff] text-[#040506] font-black py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cyan-glow hover:bg-[#00d0e0] transform active:scale-95 uppercase tracking-widest text-sm"
                    >
                        {loading ? 'Authenticating...' : 'Establish Link'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#1e1f22] text-center">
                    <p className="text-sm text-[#949ba4]">
                        New to the sphere? <Link to="/signup" className="text-[#00f0ff] hover:text-white transition font-bold">Register Candidate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
