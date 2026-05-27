import { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useBrand } from '../hooks/useBrand';
import { Sparkles } from 'lucide-react';
import { toast } from '../hooks/useToast';

const DEFAULT_MENTIONS = [
  { emoji: '📘', text_bn: 'পণ্যগুলো অসাধারণ!...', sentiment: 'ইতিবাচক', platform: 'Facebook', time_ago: '1h ago', color: 'text-green border-green' },
  { emoji: '📸', text_bn: 'Obsessed with my new purchase...', sentiment: 'Positive', platform: 'Instagram', time_ago: '3h ago', color: 'text-green border-green' },
  { emoji: '📰', text_bn: 'স্থানীয় শিল্পের সমর্থনে...', sentiment: 'নিরপেক্ষ', platform: 'News', time_ago: '6h ago', color: 'text-muted border-ink/20' },
  { emoji: '📘', text_bn: 'দাম একটু বেশি মনে হলো...', sentiment: 'নেতিবাচক', platform: 'Facebook', time_ago: '8h ago', color: 'text-coral border-coral' },
];

export default function BrandHealth() {
  const { generateJSON, isLoading, error } = useGemini();
  const { brand } = useBrand();
  const [report, setReport] = useState<{
    score: number;
    weekly_summary_bn: string;
    top_performing_content_bn: string;
    mentions: { source_emoji: string; text_bn: string; sentiment: string; platform: string; time_ago: string; }[];
    actions_bn: string[];
    opportunities_bn: string[];
    risks_bn: string[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!brand.name) {
      toast("Configure your Brand Twin to generate a health report", "warn");
      return;
    }
    const prompt = `Generate a comprehensive brand health report for "${brand.name}" (${brand.category}).
Current data: score 78/100, 342 mentions, 71% positive sentiment, 43% share of voice.
Competitors: ${brand.c1 || 'Competitor A'}, ${brand.c2 || 'Competitor B'}.
Return JSON only:
{
"score": 78,
"weekly_summary_bn": "2 sentences Bangla summary of brand performance",
"top_performing_content_bn": "1 Bangla sentence about best performing content",
"mentions": [
{"source_emoji": "📘", "text_bn": "Bangla mention text", "sentiment": "ইতিবাচক", "platform": "Facebook", "time_ago": "1h ago"}
],
"actions_bn": ["Bangla action 1"],
"opportunities_bn": ["Bangla opportunity 1"],
"risks_bn": ["Bangla risk 1"]
}`;
    const sys = "Return only valid JSON. No markdown.";
    try {
      const data = await generateJSON(prompt, sys);
      setReport(data);
    } catch (e) {
      console.error(e);
    }
  };

  const displayMentions = report?.mentions.map(m => ({
    emoji: m.source_emoji,
    text_bn: m.text_bn,
    sentiment: m.sentiment,
    platform: m.platform,
    time_ago: m.time_ago,
    color: m.sentiment.includes('ইতিবাচক') || m.sentiment.includes('Positive') ? 'text-green border-green' : 
           m.sentiment.includes('নেতিবাচক') || m.sentiment.includes('Negative') ? 'text-coral border-coral' : 'text-muted border-ink/20'
  })) || DEFAULT_MENTIONS;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl mb-2 text-ink">Brand Health</h1>
          <p className="text-muted">Track sentiment and discover actionable insights.</p>
        </div>
        <button 
          onClick={handleGenerate} disabled={isLoading}
          className="bg-amber hover:bg-amber2 text-ink font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
             <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
          ) : (
             <Sparkles size={20} />
          )}
          <span className="hidden sm:inline">{isLoading ? 'তৈরি হচ্ছে...' : 'Generate Health Report'}</span>
          <span className="sm:hidden">{isLoading ? '...' : 'Generate'}</span>
        </button>
      </div>
      
      {error && <div className="text-coral text-sm mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-ink/5 p-6 flex flex-col items-center justify-center text-center">
          <div className="text-sm font-bold text-muted uppercase tracking-widest mb-6">Brand Health Score</div>
          <div className="text-7xl font-display font-black text-amber mb-6">{report ? report.score : 78}</div>
          
          <div className="w-full bg-ink/5 rounded-full h-2 mb-8 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-coral to-amber" style={{ width: `${report ? report.score : 78}%` }} />
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm py-2 border-b border-ink/5">
              <span className="text-muted">Sentiment</span>
              <span className="font-bold text-green">71% Positive</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-ink/5">
              <span className="text-muted">Mentions</span>
              <span className="font-bold">342 (+12%)</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-muted">Share of Voice</span>
              <span className="font-bold text-amber">43% (Leader)</span>
            </div>
          </div>
        </div>

        {/* Mentions Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-ink/5 p-6">
          <h2 className="font-display font-bold text-lg mb-4">Live Mentions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayMentions.map((m, i) => (
              <div key={i} className="p-4 rounded-lg bg-cream2/50 border border-ink/5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${m.color}`}>
                    {m.sentiment}
                  </span>
                </div>
                <p className="font-bangla text-sm mb-4 opacity-90 flex-1">{m.text_bn}</p>
                <div className="text-[11px] text-muted font-mono uppercase tracking-wider">{m.platform} • {m.time_ago}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Report Card */}
      {report && (
        <div className="bg-ink rounded-xl shadow-lg border-l-4 border-l-amber p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500 text-cream">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-amber" size={28} />
            <h2 className="font-display font-bold text-2xl">AI ব্র্যান্ড হেলথ বিশ্লেষণ</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div>
               <div className="mb-8">
                 <div className="text-xs font-bold text-amber uppercase tracking-widest mb-3">Weekly Summary</div>
                 <p className="font-bangla text-lg leading-relaxed">{report.weekly_summary_bn}</p>
               </div>
               
               <div>
                 <div className="text-xs font-bold text-amber uppercase tracking-widest mb-3">Top Performing Content</div>
                 <div className="bg-ink2 p-4 rounded-lg border border-white/5">
                   <p className="font-bangla">{report.top_performing_content_bn}</p>
                 </div>
               </div>
             </div>

             <div className="space-y-6">
               <div className="bg-ink2 p-5 rounded-lg border border-white/5">
                 <div className="text-xs font-bold text-green uppercase tracking-widest mb-4">Recommended Actions</div>
                 <ul className="space-y-3">
                   {report.actions_bn.map((act, i) => (
                     <li key={i} className="flex gap-3">
                       <span className="text-green font-mono">{i+1}.</span>
                       <span className="font-bangla text-sm opacity-90">{act}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div className="bg-ink2 p-5 rounded-lg border border-amber/20">
                 <div className="text-xs font-bold text-amber uppercase tracking-widest mb-4">Opportunities</div>
                 <ul className="space-y-2">
                   {report.opportunities_bn.map((opp, i) => (
                     <li key={i} className="flex gap-3 items-start">
                       <span className="text-amber mt-0.5">→</span>
                       <span className="font-bangla text-sm opacity-90">{opp}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               {report.risks_bn.length > 0 && (
                 <div className="bg-ink2 p-5 rounded-lg border border-coral/20">
                   <div className="text-xs font-bold text-coral uppercase tracking-widest mb-4">Potential Risks</div>
                   <ul className="space-y-2">
                     {report.risks_bn.map((risk, i) => (
                       <li key={i} className="flex gap-3 items-start">
                         <span className="text-coral mt-0.5">⚠️</span>
                         <span className="font-bangla text-sm opacity-90">{risk}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
