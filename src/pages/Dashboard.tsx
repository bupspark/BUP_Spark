import { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useBrand } from '../hooks/useBrand';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { generateJSON, isLoading, error } = useGemini();
  const { brand } = useBrand();
  const [report, setReport] = useState<{
    summary: string;
    actions: string[];
    highlight: string;
  } | null>(null);

  const handleGenerateReport = async () => {
    if (!brand.name) {
      return;
    }
    const prompt = `Generate a brand health weekly report for '${brand.name}', a ${brand.category} brand in Bangladesh. Target audience: ${brand.target}. Description: ${brand.desc_bn}. Brand score: 78/100, positive sentiment: 71%, share of voice: 43%, active campaigns: 3. Return JSON only:
{
"summary": "2-3 sentence Bangla analysis",
"actions": ["Bangla action 1", "Bangla action 2", "Bangla action 3"],
"highlight": "One positive Bangla highlight"
}`;
    const system = "You are an AI brand intelligence analyst for Bangladeshi SMEs. Return only valid JSON, no markdown.";
    
    try {
      const data = await generateJSON(prompt, system);
      setReport(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {!brand.name ? (
        <div className="flex-1 flex flex-col justify-center items-center py-24 text-center">
          <img src="/logo.svg" alt="BUP Spark Logo" className="w-24 h-24 mb-6 opacity-90 object-contain drop-shadow-md" />
          <h2 className="font-display font-bold text-3xl mb-4 text-ink">Welcome to BUP Spark</h2>
          <p className="text-muted mb-8 max-w-md text-lg">Your intelligence dashboard is empty. Build your Brand Twin to unlock insights, campaign simulations, and more.</p>
          <Link 
            to="/brand-twin"
            className="bg-amber hover:bg-amber2 text-ink font-bold py-4 px-8 rounded-xl transition-colors flex items-center gap-2 text-lg shadow-sm shadow-amber/20"
          >
            <span>Build Brand Twin</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-amber border-x border-b border-ink/5 relative overflow-hidden">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Brand Score</div>
              <div className="text-4xl font-display font-bold text-ink">78</div>
            </div>
            {/* Metric 2 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-coral border-x border-b border-ink/5">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Total Mentions</div>
              <div className="text-4xl font-display font-bold text-ink">342</div>
              <div className="mt-4 h-1 w-full flex gap-1">
                 <div className="h-full bg-coral/20 rounded-full w-1/6"></div>
                 <div className="h-full bg-coral/40 rounded-full w-2/6"></div>
                 <div className="h-full bg-coral/60 rounded-full w-1/6"></div>
                 <div className="h-full bg-coral rounded-full w-2/6"></div>
              </div>
            </div>
            {/* Metric 3 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-green border-x border-b border-ink/5 relative overflow-hidden">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Positive Sentiment</div>
              <div className="text-4xl font-display font-bold text-ink">71%</div>
              <div className="mt-4 w-full bg-ink/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green h-full rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>
            {/* Metric 4 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-blue border-x border-b border-ink/5 relative overflow-hidden">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Active Campaigns</div>
              <div className="text-4xl font-display font-bold text-ink">3</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5">
              <h2 className="font-display font-bold mb-6 text-lg">Sentiment Timeline</h2>
              <div className="flex items-end justify-between h-40 gap-2">
                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="w-full flex flex-col justify-end h-full gap-2">
                    <div 
                      className={`w-full rounded-t-sm ${h > 70 ? 'bg-green' : h > 40 ? 'bg-amber' : 'bg-coral'}`} 
                      style={{ height: `${h}%` }}
                    />
                    <div className="text-xs text-center text-muted font-mono">{['Su','Mo','Tu','We','Th','Fr','Sa'][i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share of voice */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5">
              <h2 className="font-display font-bold mb-6 text-lg">Share of Voice</h2>
              <div className="space-y-4">
                {[
                  { name: brand.name || "Your Brand", v: 43, color: "bg-amber" },
                  { name: brand.c1 || "Competitor A", v: 28, color: "bg-ink/20" },
                  { name: brand.c2 || "Competitor B", v: 18, color: "bg-ink/10" },
                  { name: brand.c3 || "Competitor C", v: 11, color: "bg-ink/5" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={i === 0 ? "font-bold" : "text-muted"}>{s.name}</span>
                      <span className="font-mono">{s.v}%</span>
                    </div>
                    <div className="w-full bg-ink/5 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.v}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5">
              <h2 className="font-display font-bold mb-4 text-lg">Recent Mentions</h2>
              <div className="space-y-4">
                {[
                  { emoji: '📸', text: 'অসাধারণ কালেকশন! জাস্ট ওয়াও! 🤩', sentiment: 'Positive', color: 'text-green border-green', plat: 'Instagram', time: '2h ago' },
                  { emoji: '📘', text: 'Quality is good but delivery was slightly delayed', sentiment: 'Neutral', color: 'text-amber border-amber', plat: 'Facebook', time: '5h ago' },
                  { emoji: '🎵', text: 'খুব সফট প্রোডাক্ট। highly recommended.', sentiment: 'Positive', color: 'text-green border-green', plat: 'TikTok', time: '1d ago' },
                  { emoji: '📰', text: 'Local brands facing challenges in logistics...', sentiment: 'Neutral', color: 'text-muted border-ink/20', plat: 'News', time: '2d ago' },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-lg bg-cream2/50 border border-ink/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl">{m.emoji}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${m.color}`}>
                        {m.sentiment}
                      </span>
                    </div>
                    <p className="font-bangla text-sm mb-2 opacity-90">{m.text}</p>
                    <div className="text-xs text-muted font-mono">{m.plat} • {m.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink rounded-xl p-6 shadow-lg border-l-4 border-l-amber text-cream flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-amber" size={24} />
                <h2 className="font-display font-bold text-xl">AI Brand Analysis</h2>
              </div>
              
              {!report ? (
                <div className="flex-1 flex flex-col justify-center items-center py-12">
                  <button 
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                    className="bg-amber hover:bg-amber2 text-ink font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                        <span>জেনারেট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Generate AI Report</span>
                      </>
                    )}
                  </button>
                  {error && <div className="text-coral text-sm mt-4">{error}</div>}
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                  <div>
                    <div className="text-amber text-xs uppercase tracking-widest font-bold mb-2">Executive Summary</div>
                    <p className="font-bangla leading-relaxed opacity-90">{report.summary}</p>
                  </div>
                  
                  <div>
                    <div className="text-amber text-xs uppercase tracking-widest font-bold mb-2">Key Highlight</div>
                    <div className="bg-ink2 p-4 rounded-lg border border-white/5 relative overflow-hidden">
                      <div className="text-5xl text-amber/10 absolute -top-2 -left-2 leading-none">"</div>
                      <p className="font-bangla text-sm text-green relative z-10">{report.highlight}</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-amber text-xs uppercase tracking-widest font-bold mb-2">Recommended Actions</div>
                    <ul className="space-y-2">
                      {report.actions.map((act, i) => (
                        <li key={i} className="flex gap-3 text-sm border-b border-white/10 pb-2 last:border-0 last:pb-0">
                          <span className="text-amber font-mono">{i+1}.</span>
                          <span className="font-bangla opacity-90">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
