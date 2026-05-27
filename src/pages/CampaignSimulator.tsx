import { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useBrand } from '../hooks/useBrand';
import { Sparkles, Star, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatBDT = (val: number) => `৳${val.toLocaleString('en-IN')}`;

export default function CampaignSimulator() {
  const { generateJSON, isLoading, error } = useGemini();
  const { brand } = useBrand();
  const [goal, setGoal] = useState('Reach');
  const [budget, setBudget] = useState(5000);
  const [duration, setDuration] = useState('14');
  const [platforms, setPlatforms] = useState<string[]>(['Facebook', 'Instagram']);

  const [result, setResult] = useState<{
    strategies: {
      type: string;
      recommended: boolean;
      reach: number;
      ctr: string;
      cost_per_result: string;
      confidence: number;
      insight_bn: string;
    }[];
  } | null>(null);

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSimulate = async () => {
    if (!brand.name) return;
    const prompt = `You are a Bangladesh digital marketing expert. Simulate a paid social media campaign for "${brand.name}" (${brand.category}, target: ${brand.target}).
Budget: ৳${budget} BDT
Duration: ${duration} days
Goal: ${goal}
Platforms: ${platforms.join(', ')}
Return JSON only:
{
"strategies": [
{
"type": "Awareness",
"recommended": false,
"reach": 21000,
"ctr": "1.8%",
"cost_per_result": "৳12",
"confidence": 72,
"insight_bn": "One Bangla insight sentence"
}
]
}`;
    const sys = "Return only valid JSON. No markdown. Adjust numbers realistically based on the budget provided.";
    
    try {
      const data = await generateJSON(prompt, sys);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl mb-2 text-ink">Campaign Simulator</h1>
        <p className="text-muted">Predict ROI and reach before spending a single Taka.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Setup Form */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-ink/5 p-6">
          <div className="space-y-8">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-3">Campaign Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Reach', icon: '👁️', label: 'Reach' },
                  { id: 'Clicks', icon: '👆', label: 'Clicks' },
                  { id: 'Sales', icon: '🛍️', label: 'Sales' },
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      goal === g.id ? 'border-amber bg-amber/5' : 'border-ink/5 bg-cream hover:border-ink/10'
                    }`}
                  >
                    <span className="text-2xl mb-1">{g.icon}</span>
                    <span className="text-xs font-bold">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-bold uppercase tracking-wide text-ink/70">Total Budget</label>
                <div className="font-display font-bold text-3xl text-amber">{formatBDT(budget)}</div>
              </div>
              <input 
                type="range" min={500} max={50000} step={500}
                value={budget} onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-amber h-2 bg-cream2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted mt-2 font-mono">
                <span>৳500</span>
                <span>৳50K</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-3">Duration</label>
              <div className="flex gap-2">
                {['7', '14', '30'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-colors ${
                      duration === d ? 'bg-ink text-white' : 'bg-cream text-ink/70 border border-ink/10 hover:bg-ink/5'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-3">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'Facebook', icon: '📘' },
                  { id: 'Instagram', icon: '📸' },
                  { id: 'TikTok', icon: '🎵' },
                  { id: 'YouTube', icon: '▶️' },
                ].map(p => {
                  const act = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-bold transition-all border ${
                        act ? 'bg-ink border-ink text-amber' : 'bg-cream text-ink border-ink/10 hover:bg-ink/5'
                      }`}
                    >
                      <span className={act ? 'opacity-100' : 'opacity-70'}>{p.icon}</span>
                      <span>{p.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-ink/10">
              {brand.name ? (
                <button 
                  onClick={handleSimulate} disabled={isLoading || platforms.length === 0}
                  className="w-full bg-amber hover:bg-amber2 text-ink font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                      <span>সিমিউলেটিং...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Simulate Campaign</span>
                    </>
                  )}
                </button>
              ) : (
                <Link 
                  to="/brand-twin"
                  className="w-full bg-amber hover:bg-amber2 text-ink font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Build Brand Twin First</span>
                  <ArrowRight size={18} />
                </Link>
              )}
              {error && <div className="text-coral text-sm mt-2 text-center">{error}</div>}
            </div>

          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 animate-in fade-in duration-500">
              {result.strategies.map((str, i) => (
                <div 
                  key={i} 
                  className={`bg-white rounded-xl p-5 shadow-sm border-2 ${str.recommended ? 'border-amber relative overflow-hidden' : 'border-ink/5'}`}
                >
                  {str.recommended && (
                    <div className="absolute top-0 right-0 bg-amber text-ink text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star size={12} className="fill-ink" /> Recommended
                    </div>
                  )}

                  <h3 className="font-display font-bold text-lg mb-4 pr-24">{str.type}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted mb-0.5">Est. Reach</div>
                      <div className="text-3xl font-display font-black text-ink">{str.reach.toLocaleString('en-IN')}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-cream rounded-lg p-3 border border-ink/5">
                        <div className="text-[10px] uppercase font-bold text-muted mb-0.5">CTR</div>
                        <div className="text-lg font-bold">{str.ctr}</div>
                      </div>
                      <div className="bg-cream rounded-lg p-3 border border-ink/5">
                        <div className="text-[10px] uppercase font-bold text-muted mb-0.5">Cost / Result</div>
                        <div className="text-lg font-bold">{str.cost_per_result}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] uppercase font-bold text-muted mb-1">
                        <span>Confidence Level</span>
                        <span>{str.confidence}%</span>
                      </div>
                      <div className="w-full bg-ink/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${str.confidence >= 80 ? 'bg-green' : str.confidence >= 60 ? 'bg-amber' : 'bg-coral'}`} 
                          style={{ width: `${str.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-ink/5">
                    <p className="font-bangla text-sm text-ink/80 leading-relaxed italic border-l-2 border-amber pl-3">
                      "{str.insight_bn}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="h-full min-h-[400px] border-2 border-dashed border-ink/10 rounded-xl flex items-center justify-center p-8 bg-cream2/20">
               <div className="text-center text-muted max-w-sm">
                 <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 border border-ink/5 shadow-sm">
                   <BarChart3 className="text-ink/30" size={32} />
                 </div>
                 <h3 className="font-display font-bold text-ink mb-2">Awaiting Simulation</h3>
                 <p className="text-sm">Adjust your parameters and click simulate to predict campaign performance across platforms.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
