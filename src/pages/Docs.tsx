import React, { useState, useEffect } from 'react';
import { Bot, Zap, Shield, Database, LayoutGrid, Presentation, Code, Users, Settings, Lock, Eye, EyeOff, Save, Calendar, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Docs() {
  const { user } = useAuth();
  
  // Define admins here (your email)
  const isAdminUser = user?.email === 'bupspark@gmail.com';

  const [activeTab, setActiveTab] = useState('pitch');
  const [isAdminMode, setIsAdminMode] = useState(isAdminUser);
  
  const [config, setConfig] = useState({
    isPublic: true,
    startDate: '',
    endDate: ''
  });

  // Load admin config from local storage (Simulated backend state for the pitch deck visibility)
  useEffect(() => {
    const saved = localStorage.getItem('bup_docs_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('bup_docs_config', JSON.stringify(config));
    // Brief visual feedback
    alert('Docs configuration saved to local system state.');
  };

  // Determine if the docs are currently visible based on constraints
  const isVisible = () => {
    if (!config.isPublic) return false;
    const now = new Date();
    if (config.startDate && now < new Date(config.startDate)) return false;
    if (config.endDate && now > new Date(config.endDate)) return false;
    return true;
  };

  // Pre-render gate for visibility
  if (!isVisible() && !isAdminMode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 text-center mt-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-ink/5 p-6 rounded-full mb-6">
          <Lock className="w-12 h-12 text-ink/40" />
        </div>
        <h2 className="text-3xl font-display font-bold text-ink mb-3">Documentation Restricted</h2>
        <p className="text-muted text-lg max-w-md">
          This pitch deck and technical documentation module is currently offline or outside its scheduled viewing window.
        </p>
        <button 
          onClick={() => {
            const code = window.prompt("Enter Admin Passcode:");
            if (code === "bup2026") setIsAdminMode(true);
          }} 
          className="mt-10 text-sm font-medium text-blue bg-blue/10 px-5 py-2.5 rounded-full hover:bg-blue/20 transition-colors"
        >
          Launch Admin Override
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'pitch', label: 'Pitch Deck', icon: Presentation },
    { id: 'tech', label: 'Tech Architecture', icon: Code },
    { id: 'team', label: 'Team Showcase', icon: Users },
    { id: 'admin', label: 'Admin & Control', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in duration-500 pt-4">
      
      {/* Navigation Sidebar */}
      <div className="md:w-64 shrink-0 space-y-2">
        <div className="mb-8 pl-2">
          <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            <Database className="text-blue" size={24} />
            Live /docs
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">BUP Spark System of Record & Intelligent Pitch Module</p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-ink text-white shadow-md' 
                  : 'text-muted hover:bg-ink/5 hover:text-ink'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'} />
              {tab.label}
            </button>
          ))}
        </nav>

        {!isAdminMode && (
          <button 
            onClick={() => {
              const code = window.prompt("Enter Admin Passcode (Hint: type 'bup2026'):");
              if (code === "bup2026") {
                setIsAdminMode(true);
              } else if (code !== null) {
                alert("Incorrect passcode.");
              }
            }}
            className="mt-8 flex items-center gap-2 text-xs text-muted hover:text-ink w-full justify-start px-4 transition-colors"
          >
            <Settings size={14} /> Admin Access
          </button>
        )}
        
        {isAdminMode && (
           <div className="mt-8 p-4 bg-amber/10 border border-amber/20 rounded-xl relative overflow-hidden">
              <span className="absolute top-3 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
              </span>
             <p className="text-xs font-bold tracking-wide uppercase text-amber">Admin Override Active</p>
             <p className="text-xs mt-1 text-amber/80">You are viewing bypassing visibility locks.</p>
             {!isAdminUser && (
               <button onClick={() => setIsAdminMode(false)} className="text-xs text-amber font-medium hover:underline mt-3 block">Exit Admin Mode</button>
             )}
           </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-ink/10 rounded-[2rem] p-6 md:p-10 shadow-sm min-h-[600px]">
        
        {/* ================= PITCH DECK ================= */}
        {activeTab === 'pitch' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-gradient-to-br from-blue/10 via-blue/5 to-transparent border border-blue/10 p-10 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap size={120} />
              </div>
              <div className="inline-block px-3 py-1 bg-blue/10 text-blue rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-blue/20">Elevator Pitch</div>
              <h2 className="text-4xl font-display font-bold text-ink mb-6 relative z-10 leading-tight">AI-Powered Brand Simulation Engine</h2>
              <p className="text-lg text-ink/80 max-w-2xl leading-relaxed relative z-10 font-medium">
                BUP Spark is a real-time intelligence dashboard that replaces expensive legacy sentiment analysis tools. We enable marketing teams to instantly build a "Brand Twin" and simulate market reactions using Gemini 3.5 Flash.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 border border-ink/10 rounded-[2rem] space-y-4 hover:border-ink/20 transition-colors">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                  <Target size={24} />
                </div>
                <h3 className="font-bold text-ink text-2xl">The Problem</h3>
                <p className="text-muted leading-relaxed">
                  Brand tracking today is reactive, expensive, and slow. Marketing executives wait weeks for disjointed PDF reports compiled by human analysts using legacy scraping tools. You cannot simulate a crisis or a campaign drop before it happens.
                </p>
              </div>
              <div className="p-8 border border-ink/10 rounded-[2rem] space-y-4 bg-green/5 hover:bg-green/10 transition-colors">
                <div className="w-12 h-12 bg-green/20 text-green-700 rounded-2xl flex items-center justify-center border border-green/20 shadow-sm">
                  <Zap size={24} />
                </div>
                <h3 className="font-bold text-ink text-2xl">The Solution</h3>
                <p className="text-muted leading-relaxed">
                  We automate executive intelligence. Users configure their mission, metrics, and competitors. BUP Spark instantly runs synthetic simulations through Gemini, producing Share of Voice map metrics and dynamic brand health scores in seconds.
                </p>
              </div>
            </div>

            <div className="border border-ink/10 rounded-[2rem] p-10 bg-ink/5">
              <h3 className="font-bold text-ink text-2xl mb-8 text-center font-display">Core Execution Flow</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="text-center space-y-4">
                   <div className="mx-auto w-14 h-14 bg-white border border-ink/10 rounded-2xl shadow-sm flex items-center justify-center font-bold text-xl text-ink">1</div>
                   <h4 className="font-bold text-ink font-display">Define Brand Twin</h4>
                   <p className="text-sm text-muted px-4">Input voice, core mission, and industry competitors.</p>
                 </div>
                 <div className="text-center space-y-4">
                   <div className="mx-auto w-14 h-14 bg-blue border border-blue rounded-2xl shadow-sm flex items-center justify-center font-bold text-xl text-white">2</div>
                   <h4 className="font-bold text-ink font-display">AI Simulation Pipeline</h4>
                   <p className="text-sm text-muted px-4">Gemini evaluates synthetic market data against your profile.</p>
                 </div>
                 <div className="text-center space-y-4">
                   <div className="mx-auto w-14 h-14 bg-green text-white border border-green rounded-2xl shadow-sm flex items-center justify-center font-bold text-xl">3</div>
                   <h4 className="font-bold text-ink font-display">Real-time Dashboard</h4>
                   <p className="text-sm text-muted px-4">View actionable metrics, sentiment timelines, and insights.</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TECH ARCHITECTURE ================= */}
        {activeTab === 'tech' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-3xl font-display font-bold text-ink mb-3">Technical Documentation</h2>
              <p className="text-muted text-lg border-b border-ink/10 pb-8">System architecture, secure data flow, and model usage metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-8 border border-ink/10 rounded-[2rem] bg-ink/5">
                <LayoutGrid className="text-blue mb-4" size={28} />
                <h3 className="font-bold text-ink text-xl">Frontend Stack</h3>
                <ul className="list-disc pl-5 space-y-3 text-muted text-sm leading-relaxed">
                  <li><strong className="text-ink">React 18 + Vite:</strong> Rapid modular component delivery.</li>
                  <li><strong className="text-ink">Tailwind CSS:</strong> Utility-first styling for fluid responsive desktop-first design.</li>
                  <li><strong className="text-ink">Lucide-React:</strong> Integrated SVG scalable icons.</li>
                  <li><strong className="text-ink">Framer Motion:</strong> Used for route transitions and stagger entrances.</li>
                </ul>
              </div>
              <div className="space-y-4 p-8 border border-ink/10 rounded-[2rem]">
                <Shield className="text-green mb-4" size={28} />
                <h3 className="font-bold text-ink text-xl">Backend Security Proxy</h3>
                <ul className="list-disc pl-5 space-y-3 text-muted text-sm leading-relaxed">
                  <li><strong className="text-ink">Express Server (Node.js):</strong> Receives API calls from React frontend via route proxy.</li>
                  <li><strong className="text-ink">Credential Shielding:</strong> Prevents client-side network inspectors from reading the Gemini API Key.</li>
                  <li><strong className="text-ink">Production esbuild:</strong> Compiles to a single optimized `server.cjs` script.</li>
                  <li><strong className="text-ink">Resilient Payloading:</strong> Uses AST JSON repair fallback for malformed AI output schemas.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 flex flex-col p-8 bg-blue/5 rounded-[2rem] border border-blue/10">
              <div className="flex items-center gap-3">
                <div className="bg-blue/10 p-2.5 rounded-xl text-blue">
                   <Bot size={24} />
                </div>
                <h3 className="font-bold text-ink text-xl font-display">AI Depth & Prompt Strategy</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm mt-2">
                 <div>
                   <strong className="block text-ink mb-2 uppercase text-xs tracking-wider opacity-60">Models Employed</strong>
                   <p className="text-muted leading-relaxed">Primary inference utilizes <span className="font-mono text-xs bg-ink/10 px-1.5 py-0.5 rounded text-ink">gemini-3.5-flash</span> via the <span className="font-mono text-xs bg-ink/10 px-1.5 py-0.5 rounded text-ink">@google/genai</span> TypeScript SDK. Selected explicitly for extreme cost-effectiveness and ultra-low latency JSON parameter extraction during campaign logic.</p>
                 </div>
                 <div>
                   <strong className="block text-ink mb-2 uppercase text-xs tracking-wider opacity-60">Token Optimization Tactics</strong>
                   <p className="text-muted leading-relaxed">Strict structured JSON output format constraints injected within core system boundaries prevent the model from wasting tokens on conversational text or "chain-of-thought" leading, dropping response intervals dramatically.</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TEAM ================= */}
        {activeTab === 'team' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-3xl font-display font-bold text-ink mb-3">Team Showcase</h2>
              <p className="text-muted text-lg border-b border-ink/10 pb-8">The builders behind The Infinity AI BuildFest 2026 Submission.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Main Team Member Card */}
              <div className="flex items-center gap-5 p-6 border border-ink/10 rounded-[2rem] bg-white shadow-sm hover:border-blue/30 transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-blue to-blue/60 text-white rounded-full flex flex-col items-center justify-center font-display font-bold text-2xl uppercase shadow-md">
                  BS
                </div>
                <div>
                  <h4 className="font-bold text-ink text-xl font-display mb-1">BUP Spark Team</h4>
                  <p className="text-sm rounded-full bg-ink/5 px-3 py-1 text-ink inline-block font-medium mb-2">BuildFest Contributor</p>
                  <div>
                    <a href="mailto:bupspark@gmail.com" className="text-sm text-blue hover:underline">bupspark@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-10 bg-gradient-to-br from-ink/5 to-transparent border border-ink/10 rounded-[2rem] text-center">
              <h4 className="font-bold text-ink text-xl mb-4 font-display">Ready for the Pitch & Evaluation</h4>
              <p className="text-muted max-w-2xl mx-auto leading-relaxed">
                We constructed this foundation specifically for evaluator transparency. The rigid separation of client-side React UI code from the secure Node server proxy establishes exactly how the prototype bridges into standard production pipelines.
              </p>
            </div>
          </div>
        )}

        {/* ================= ADMIN / SETTINGS ================= */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-3xl font-display font-bold text-ink mb-3">Documentation Access Control</h2>
              <p className="text-muted text-lg border-b border-ink/10 pb-8">Manage live visibility, scheduling gates, and publishing states of this /docs module.</p>
            </div>

            <div className="max-w-2xl space-y-6">
              {/* Public Toggle */}
              <div className="flex items-center justify-between p-6 border border-ink/10 rounded-[2rem] bg-ink/5">
                <div>
                  <h4 className="font-bold text-ink text-lg flex items-center gap-2 mb-1">
                    {config.isPublic ? <Eye size={20} className="text-green" /> : <EyeOff size={20} className="text-muted" />}
                    Public Visibility Override
                  </h4>
                  <p className="text-sm text-muted">When toggled OFF, this docs page drops a lock wall to all non-admin viewers.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-110 ml-4">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={config.isPublic}
                    onChange={(e) => setConfig({ ...config, isPublic: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                </label>
              </div>

              {/* Scheduling Gate */}
              <div className="p-8 border border-ink/10 rounded-[2rem] space-y-6 bg-white">
                <div>
                    <h4 className="font-bold text-ink text-lg flex items-center gap-2 mb-1">
                       <Calendar size={20} className="text-blue" />
                       Evaluation Scheduling Window
                    </h4>
                    <p className="text-sm text-muted">Configure calendar constraints to automatically reveal or hide the pitch deck for judge evaluation periods.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-ink/5 p-6 rounded-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/70">Available From</label>
                    <input 
                      type="datetime-local" 
                      value={config.startDate}
                      onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-sm focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/70">Available Until</label>
                    <input 
                      type="datetime-local" 
                      value={config.endDate}
                      onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-sm focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Save Controls */}
              <div className="pt-6 flex justify-end px-2 border-t border-ink/10 mt-8">
                <button 
                  onClick={handleSaveConfig}
                  className="flex items-center gap-2 bg-ink text-white px-8 py-3.5 rounded-full font-medium hover:bg-ink/80 transition-all shadow-md active:scale-95"
                >
                  <Save size={18} />
                  Persist Configuration State
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
