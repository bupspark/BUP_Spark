import { useState, useEffect } from 'react';
import { useBrand } from '../hooks/useBrand';
import { Sparkles, ArrowRight, RefreshCw, Globe, Search, ShieldAlert, BarChart2, MessageSquare, Facebook, Instagram, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const getPlatformIcon = (plat: string) => {
  const p = plat.toLowerCase();
  if (p.includes('facebook')) return <Facebook size={16} className="text-[#1877F2] shrink-0" />;
  if (p.includes('instagram')) return <Instagram size={16} className="text-[#E1306C] shrink-0" />;
  if (p.includes('tiktok')) return <Music size={16} className="text-ink shrink-0" />;
  return <Globe size={16} className="text-amber shrink-0" />;
};

export default function Dashboard() {
  const { brand, scrapedData, isScraping, scrapingError, triggerScrape } = useBrand();
  const [crawlProgress, setCrawlProgress] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    `Initializing crawler engine for BUP Spark targeting: "${brand.name}"...`,
    `Searching live web and indexing Google Search Grounding matching brand domain and tags...`,
    `Scraping recent reviews and social context streams (Facebook, Instagram, news)...`,
    `Evaluating competitor share of voice for ${brand.c1 || 'Competitor A'}, ${brand.c2 || 'Competitor B'}, ${brand.c3 || 'Competitor C'}...`,
    `Running multi-language sentiment classification on extracted Bangla & English mentions...`,
    `Modeling brand score indices, active promotions, and synthesizing intelligence matrix...`,
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScraping) {
      setCrawlProgress([steps[0]]);
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next < steps.length) {
            setCrawlProgress((history) => [...history, steps[next]]);
            return next;
          }
          clearInterval(interval);
          return prev;
        });
      }, 2500);
    } else {
      setCrawlProgress([]);
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [isScraping]);

  // Handle auto scraping if brand name is configured but no scrapedData is present
  useEffect(() => {
    if (brand.name && !scrapedData && !isScraping && !scrapingError) {
      triggerScrape().catch((err) => console.error("Auto scraping on load failed:", err));
    }
  }, [brand.name, scrapedData]);

  const handleScrape = async () => {
    try {
      await triggerScrape();
    } catch (e) {
      console.error("Scraping trigger failed:", e);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes('pos') || s.includes('ইতিবাচক')) return 'text-green border-green bg-green/5';
    if (s.includes('neg') || s.includes('নেতিবাচক')) return 'text-coral border-coral bg-coral/5';
    return 'text-amber border-amber bg-amber/5';
  };

  return (
    <div className="space-y-6">
      {!brand.name ? (
        <div className="flex-1 flex flex-col justify-center items-center py-24 text-center">
          <img src="/BUP_Spark_Logo_BGRemoved.png" alt="BUP Spark Logo" className="w-48 h-48 mb-6 opacity-95 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105" />
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
      ) : isScraping ? (
        <div className="bg-ink rounded-xl p-8 text-cream border-t-4 border-amber shadow-lg max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-amber border-t-transparent animate-spin"></div>
              <Globe className="absolute top-3 left-3 text-amber animate-pulse" size={20} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-amber">Active Search Grounded Brand Scraping</h2>
              <p className="text-xs text-muted font-mono uppercase tracking-wider">CRAWLER STATUS: SCANNING THE LIVE WEB</p>
            </div>
          </div>

          <div className="bg-black/45 rounded-lg p-5 font-mono text-xs space-y-2 border border-white/5 max-h-64 overflow-y-auto">
            {crawlProgress.map((p, idx) => (
              <div key={idx} className="flex gap-2 text-green-400 items-start">
                <span className="text-amber">❯</span>
                <p className="leading-relaxed">{p}</p>
              </div>
            ))}
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden relative">
              <div 
                className="bg-amber h-full transition-all duration-1000" 
                style={{ width: `${Math.min(((currentStep + 1) / steps.length) * 100, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted text-center italic">This scraping process uses Google Search Grounding to extract actual web visibility index and reviews context.</p>
        </div>
      ) : scrapingError ? (
        <div className="bg-red-50 text-red-900 rounded-xl p-8 border border-red-200 max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert size={36} className="text-coral shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Scraper Error</h3>
              <p className="text-sm text-red-700">We could not scrape real-time data for your brand.</p>
            </div>
          </div>
          <p className="text-xs bg-black/5 p-3 rounded font-mono break-all">{scrapingError}</p>
          <div className="flex gap-3 justify-end pt-2">
            <button 
              onClick={handleScrape}
              className="bg-amber hover:bg-amber2 text-ink font-bold py-2 px-5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span>Retry Scraping</span>
            </button>
            <Link to="/brand-twin" className="text-sm text-ink hover:underline my-auto font-medium">
              Update Brand Profile
            </Link>
          </div>
        </div>
      ) : !scrapedData ? (
        <div className="bg-white rounded-xl p-8 border border-ink/5 text-center max-w-xl mx-auto space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-amber/10 text-amber rounded-2xl flex items-center justify-center mx-auto">
            <Search size={32} />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl text-ink">Run Crawler & Brand Scraper</h3>
            <p className="text-muted text-sm mt-2">
              Launch BUP Spark's search-grounded agent to scan and synthesize dynamic analytics, sentiment score, competitive share of voice, and recent social mentions.
            </p>
          </div>
          <button 
            onClick={handleScrape}
            className="w-full bg-amber hover:bg-amber2 text-ink font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            <span>Launch Web Scraper Now</span>
          </button>
        </div>
      ) : (
        <>
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ink/5 pb-4">
            <div>
              <h1 className="font-display font-black text-2xl text-ink">Brand Metrics Twin</h1>
              <p className="text-xs text-muted uppercase tracking-wider font-mono">Live Web Discovery & Index: {brand.name}</p>
            </div>
            <button 
              onClick={handleScrape}
              className="bg-cream hover:bg-cream2 border border-ink/10 text-ink font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <RefreshCw size={14} />
              <span>Refresh Scraper</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-amber border-x border-b border-ink/5 relative overflow-hidden">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Brand Score</div>
              <div className="text-4xl font-display font-bold text-ink">{scrapedData.score}</div>
              <span className="text-[10px] font-mono text-muted block mt-1">Grounding Authority index</span>
            </div>
            {/* Metric 2 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-coral border-x border-b border-ink/5">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Indexed Mentions</div>
              <div className="text-4xl font-display font-bold text-ink">{scrapedData.total_mentions}</div>
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
              <div className="text-4xl font-display font-bold text-ink">{scrapedData.positive_sentiment}%</div>
              <div className="mt-4 w-full bg-ink/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green h-full rounded-full" style={{ width: `${scrapedData.positive_sentiment}%` }}></div>
              </div>
            </div>
            {/* Metric 4 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border-t-4 border-t-blue border-x border-b border-ink/5 relative overflow-hidden">
              <div className="text-sm font-semibold text-muted mb-1 uppercase tracking-wider">Active Campaigns</div>
              <div className="text-4xl font-display font-bold text-ink">{scrapedData.active_campaigns}</div>
              <span className="text-[10px] font-mono text-muted block mt-1">Live/observed promotions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5">
              <h2 className="font-display font-bold mb-6 text-lg">Sentiment Timeline</h2>
              <div className="flex items-end justify-between h-40 gap-2">
                {scrapedData.sentiment_timeline.map((h, i) => (
                  <div key={i} className="w-full flex flex-col justify-end h-full gap-2 font-mono">
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80`} 
                      style={{ height: `${Math.max(h, 5)}%`, backgroundColor: h > 70 ? '#38bdf8' : h > 40 ? '#fbbf24' : '#f87171' }}
                    />
                    <div className="text-[10px] text-center text-muted font-mono">{['Su','Mo','Tu','We','Th','Fr','Sa'][i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share of voice */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5">
              <h2 className="font-display font-bold mb-6 text-lg">Share of Voice</h2>
              <div className="space-y-4">
                {scrapedData.share_of_voice.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={i === 0 ? "font-bold text-ink" : "text-muted"}>{s.name}</span>
                      <span className="font-mono text-xs font-semibold">{s.v}%</span>
                    </div>
                    <div className="w-full bg-ink/5 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.v}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-ink/5">
            <h2 className="font-display font-bold mb-4 text-lg">Scraped Recent Mentions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrapedData.recent_mentions.map((m, i) => (
                <div key={i} className="p-4 rounded-lg bg-cream2/50 border border-ink/5 relative overflow-hidden transition-all hover:bg-cream2">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(m.plat)}
                      <span className="text-xs text-ink/75 font-semibold">{m.plat}</span>
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getSentimentColor(m.sentiment)}`}>
                      {m.sentiment}
                    </span>
                  </div>
                  <p className="font-bangla text-sm mb-2 opacity-90 leading-relaxed">{m.text}</p>
                  <div className="text-[10px] text-muted font-mono">{m.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
