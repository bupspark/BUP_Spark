import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorCtx, setErrorCtx] = useState('');
  const [logoError, setLogoError] = useState(false);
  const { login, register } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCtx('');
    
    if (!email || !password || (!isLogin && !name)) {
      setErrorCtx('Please fill in all required fields.');
      return;
    }
    
    try {
      if (isLogin) {
        login(email, password);
      } else {
        register(email, password, name);
      }
    } catch (err: any) {
      setErrorCtx(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-ink/5 border border-ink/5 overflow-hidden z-10">
        <div className="bg-ink p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-coral/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-36 h-36 bg-cream/5 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4 border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
              {!logoError ? (
                <img 
                  src="/BUP_Spark_Logo_BGRemoved.png" 
                  alt="BUP Spark Logo" 
                  className="w-full h-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Sparkles className="w-14 h-14 text-amber" />
              )}
            </div>
            <h1 className="font-display font-extrabold text-2xl text-cream tracking-tight">
              BUP SPARK
            </h1>
            <p className="text-cream/70 text-sm mt-2 font-medium">
              Brand Intelligence Platform
            </p>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="font-display font-bold text-xl mb-6 text-center text-ink">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          
          {errorCtx && (
            <div className="mb-4 p-3 bg-coral/10 border border-coral/20 rounded-lg flex items-start gap-2 text-coral text-sm font-medium">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorCtx}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-muted" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream2 border border-ink/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream2 border border-ink/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs font-medium text-amber hover:text-amber2 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream2 border border-ink/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber hover:bg-amber2 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6 shadow-sm shadow-amber/20 flex items-center justify-center gap-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-ink/5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
                setErrorCtx('');
              }}
              className="text-sm font-medium text-muted hover:text-amber transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="font-bold text-ink">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-bold text-ink">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
