import { useBrand } from '../hooks/useBrand';
import { Sparkles, Heart, Activity, TrendingUp, AlertTriangle, ArrowRight, Facebook, Instagram, Music, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const getPlatformIcon = (plat: string) => {
  const p = plat.toLowerCase();
  if (p.includes('facebook')) return <Facebook size={16} className="text-[#1877F2] shrink-0" />;
  if (p.includes('instagram')) return <Instagram size={16} className="text-[#E1306C] shrink-0" />;
  if (p.includes('tiktok')) return <Music size={16} className="text-ink shrink-0" />;
  return <Globe size={16} className="text-amber shrink-0" />;
};

export default function BrandHealth() {
  const { brand, scrapedData, isScraping, triggerScrape } = useBrand();

  const handleGenerate = async () => {
    if (!brand.name) {
      return;
    }
    try {
      await triggerScrape();
    } catch (e) {
      console.error(e);
    }
  };

  const getSentimentTextClass = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes('pos') || s.includes('ইতিবাচক')) return 'text-green border-green bg-green/5';
    if (s.includes('neg') || s.includes('নেতিবাচক')) return 'text-coral border-coral bg-coral/5';
    return 'text-amber border-amber bg-amber/5';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl mb-2 text-ink">Brand Health Studio</h1>
          <p className="text-muted text-sm">Analyze social sentiment indexes, risks, and competitor share of voice scraped in real-time.</p>
        </div>
        {brand.name && (
          <button 
            onClick={handleGenerate} disabled={isScraping}
            className="bg-amber hover:bg-amber2 text-ink font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 text-sm shadow-sm"
          >
            {isScraping ? (
               <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
            ) : (
               <Sparkles size={18} />
            )}
            <span>{isScraping ? 'এনালাইসিস হচ্ছে...' : 'Run Real-Time Audit'}</span>
          </button>
        )}
      </div>

      {!brand.name ? (
        <div className="flex-1 flex flex-col justify-center items-center py-24 text-center">
          <img src="/BUP_Spark_Logo_BGRemoved.png" alt="BUP Spark Logo" className="w-48 h-48 mb-6 opacity-95 object-contain drop-shadow-sm" />
          <h2 className="font-display font-bold text-2xl mb-4 text-ink">No Brand Profile Found</h2>
          <p className="text-muted mb-8 max-w-sm text-sm">Please set up your Brand Twin parameters first to start crawling real-time web insights.</p>
          <Link 
            to="/brand-twin"
            className="bg-amber hover:bg-amber2 text-ink font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2 text-sm"
          >
            <span>Configure Brand Twin</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : isScraping ? (
        <div className="bg-ink text-cream rounded-xl p-12 text-center border-t-4 border-amber animate-pulse max-w-xl mx-auto space-y-4">
          <Activity className="mx-auto text-amber animate-bounce" size={48} />
          <h3 className="font-display font-bold text-xl">Crawling Online Mention Registers...</h3>
          <p className="text-sm text-muted">BUP Spark is parsing search indicators and analyzing feedback pipelines. This may take around 15–30 seconds...</p>
        </div>
      ) : !scrapedData ? (
        <div className="bg-white rounded-xl p-12 border border-ink/5 text-center max-w-xl mx-auto space-y-5 shadow-sm">
          <Activity className="mx-auto text-muted" size={48} />
          <h3 className="font-display font-bold text-xl text-ink">Scraper Audit Pending</h3>
          <p className="text-muted text-sm leading-relaxed">
            We haven't scraped the web for brand mentions yet of "{brand.name}". Click the button below to crawl Google indexes and establish dynamic health scores.
          </p>
          <button 
            onClick={handleGenerate}
            className="bg-amber hover:bg-amber2 text-ink font-bold py-3.5 px-8 rounded-lg transition-colors inline-flex items-center gap-2 text-sm shadow-sm"
          >
            <Sparkles size={18} />
            <span>Audit Brand Online Now</span>
          </button>
        </div>
      ) : (
        <>
          {scrapedData.isFallback && (
            <div className="bg-amber/5 border border-amber/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink/80 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber"></span>
                </span>
                <div>
                  <span className="font-bold text-ink uppercase tracking-wider text-[9px] mr-1.5 bg-amber/20 px-1.5 py-0.5 rounded">AI COGNITIVE FALLBACK ACTIVE</span>
                  <span>Due to your platform's Gemini API key quota limits (429 resource exhausted), live internet scraping is running safely on local web projection cache files. Standings fluctuation is simulated gracefully.</span>
                </div>
              </div>
              <span className="text-[9px] font-black text-amber/80 font-mono italic shrink-0">ADAPTIVE MODE</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-sm border border-pink/5 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-bold text-muted uppercase tracking-widest mb-6">dynamic health score</div>
              <div className="text-7xl font-display font-black text-amber mb-6">{scrapedData.score}</div>
              
              <div className="w-full bg-ink/5 rounded-full h-2 mb-8 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-coral to-amber" style={{ width: `${scrapedData.score}%` }} />
              </div>

              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-ink/5">
                  <span className="text-muted">Crawled Sentiment</span>
                  <span className="font-bold text-green">{scrapedData.positive_sentiment}% Positive</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-ink/5">
                  <span className="text-muted">Total Indexed Mentions</span>
                  <span className="font-bold">{scrapedData.total_mentions} mentions</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-muted">Index Standing</span>
                  <span className="font-bold text-amber">
                    SOV {scrapedData.share_of_voice.find(s => s.name.toLowerCase() === brand.name.toLowerCase())?.v || scrapedData.share_of_voice[0]?.v || 43}%
                  </span>
                </div>
              </div>
            </div>

            {/* Mentions Feed */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-ink/5 p-6">
              <h2 className="font-display font-bold text-lg mb-4">Web Mentions & Review Stream</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scrapedData.recent_mentions.map((m, i) => (
                  <div key={i} className="p-4 rounded-lg bg-cream2/50 border border-ink/5 flex flex-col justify-between hover:bg-cream2 transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(m.plat)}
                          <span className="text-xs font-semibold text-ink/80">{m.plat}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getSentimentTextClass(m.sentiment)}`}>
                          {m.sentiment}
                        </span>
                      </div>
                      <p className="font-bangla text-xs md:text-sm mb-4 opacity-90 leading-relaxed font-normal">{m.text}</p>
                    </div>
                    <div className="text-[10px] text-muted font-mono tracking-wider">{m.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Report Card */}
          <div className="bg-ink rounded-xl shadow-lg border-l-4 border-l-amber p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-500 text-cream">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Sparkles className="text-amber" size={28} />
              <div>
                <h2 className="font-display font-bold text-2xl">AI ব্র্যান্ড হেলথ বিশ্লেষণ</h2>
                <p className="text-xs text-muted font-mono uppercase tracking-wider mt-1">Grounding engine synthesis report</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div>
                   <div className="text-xs font-bold text-amber uppercase tracking-widest mb-3">Weekly Summary & Standing</div>
                   <p className="font-bangla text-base md:text-lg leading-relaxed">{scrapedData.health_report.weekly_summary_bn}</p>
                 </div>
                 
                 <div>
                   <div className="text-xs font-bold text-amber uppercase tracking-widest mb-3">Top Performing Content Formula</div>
                   <div className="bg-black/25 p-5 rounded-lg border border-white/5">
                     <p className="font-bangla text-sm leading-relaxed text-cream/90">{scrapedData.health_report.top_performing_content_bn}</p>
                   </div>
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="bg-black/15 p-5 rounded-lg border border-green/20">
                   <div className="text-xs font-bold text-green uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Heart size={14} />
                     <span>Recommended Health Actions</span>
                   </div>
                   <ul className="space-y-3">
                     {scrapedData.health_report.actions_bn.map((act, i) => (
                       <li key={i} className="flex gap-3">
                         <span className="text-green font-mono font-bold text-sm bg-green/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                         <span className="font-bangla text-sm opacity-90 leading-relaxed">{act}</span>
                       </li>
                     ))}
                   </ul>
                 </div>

                 <div className="bg-black/15 p-5 rounded-lg border border-amber/20">
                   <div className="text-xs font-bold text-amber uppercase tracking-widest mb-4 flex items-center gap-2">
                     <TrendingUp size={14} />
                     <span>Identified Market Opportunities</span>
                   </div>
                   <ul className="space-y-2">
                     {scrapedData.health_report.opportunities_bn.map((opp, i) => (
                       <li key={i} className="flex gap-3 items-start">
                         <span className="text-amber text-lg leading-none">→</span>
                         <span className="font-bangla text-sm opacity-90 leading-relaxed">{opp}</span>
                       </li>
                     ))}
                   </ul>
                 </div>

                 {scrapedData.health_report.risks_bn.length > 0 && (
                   <div className="bg-black/15 p-5 rounded-lg border border-coral/20">
                     <div className="text-xs font-bold text-coral uppercase tracking-widest mb-4 flex items-center gap-2">
                       <AlertTriangle size={14} />
                       <span>Potential Vulnerabilities & Risks</span>
                     </div>
                     <ul className="space-y-2">
                       {scrapedData.health_report.risks_bn.map((risk, i) => (
                         <li key={i} className="flex gap-3 items-start">
                           <AlertTriangle size={14} className="text-coral shrink-0 mt-1" />
                           <span className="font-bangla text-sm opacity-90 leading-relaxed">{risk}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
