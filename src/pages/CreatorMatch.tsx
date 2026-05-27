import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useBrand, BrandProfile } from '../hooks/useBrand';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { toast } from '../hooks/useToast';

interface Creator {
  name: string;
  handle: string;
  platform: string;
  tier: string;
  followers: string;
  engagement: string;
  cpe: string;
  fit_score: number;
  tags: string[];
  reason_bn: string;
  avatar_initials: string;
  avatar_gradient: string;
}

export default function CreatorMatch() {
  const { generateJSON, isLoading, error } = useGemini();
  const { brand } = useBrand();
  const [creators, setCreators] = useState<Creator[] | null>(null);
  const [filter, setFilter] = useState('All');

  const handleFind = async () => {
    if (!brand.name) {
      toast("Please build your Brand Twin before searching for creators", "warn");
      return;
    }
    const prompt = `Generate 4 realistic Bangladeshi female social media creators for "${brand.name}" (${brand.category}, target: ${brand.target}).
Return JSON only:
{
"creators": [
{
"name": "Realistic Bangladeshi female name",
"handle": "@handle",
"platform": "Instagram",
"tier": "micro",
"followers": "42K",
"engagement": "6.8%",
"cpe": "৳180",
"fit_score": 94,
"tags": ["Fashion", "Lifestyle", "Traditional"],
"reason_bn": "One short Bangla sentence why they fit",
"avatar_initials": "FT",
"avatar_gradient": "linear-gradient(135deg,#F0A500,#E05A2B)"
}
]
}`;
    const sys = "Return only valid JSON. Make creators realistic for Bangladesh's social media landscape in 2025-2026.";
    try {
      const data = await generateJSON(prompt, sys);
      setCreators(data.creators);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCreators = creators?.filter(c => {
    if (filter === 'All') return true;
    return c.tier.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl mb-2 text-ink">Creator Match</h1>
          <p className="text-muted">Find authentic local voices to amplify your brand.</p>
        </div>
        <button 
          onClick={handleFind} disabled={isLoading}
          className="bg-amber hover:bg-amber2 text-ink font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 whitespace-nowrap"
        >
          {isLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
          ) : (
            <Search size={20} />
          )}
          <span>{isLoading ? 'খুঁজছি...' : 'Find Creators'}</span>
        </button>
      </div>

      {error && <div className="text-coral text-sm mb-4">{error}</div>}

      {creators && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Nano', 'Micro', 'Macro'].map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${
                filter === f ? 'bg-ink text-cream border-ink' : 'bg-white text-ink border-ink/10 hover:border-ink/30'
              }`}
            >
              {f} {f === 'Nano' && '(1K-10K)'} {f === 'Micro' && '(10K-100K)'} {f === 'Macro' && '(100K+)'}
            </button>
          ))}
        </div>
      )}

      {filteredCreators && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredCreators.map((c, i) => (
            <CreatorCard key={i} creator={c} brand={brand} />
          ))}
        </div>
      )}

      {!creators && !isLoading && (
        <div className="h-64 border-2 border-dashed border-ink/10 rounded-xl flex items-center justify-center bg-cream2/20">
            <div className="text-center text-muted">
              <Search className="mx-auto mb-3 opacity-20" size={48} />
              <p className="text-sm">Click "Find Creators" to discover matching influencers.</p>
            </div>
        </div>
      )}
    </div>
  );
}

function CreatorCard({ creator, brand }: { creator: Creator; key?: React.Key; brand: BrandProfile }) {
  const { generateText } = useGemini();
  const [msgOpen, setMsgOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);

  const handleMessage = async () => {
    if (message) {
      setMsgOpen(!msgOpen);
      return;
    }
    setLoadingMsg(true);
    setMsgOpen(true);
    const brandName = brand.name || 'our brand';
    const prompt = `Write a personalized outreach message in Bangla (with some English) from "${brandName}" to ${creator.name} (${creator.handle} on ${creator.platform}). It's for a social media collaboration. 3-4 sentences, friendly and professional. Start with আস্সালামু আলাইকুম or হ্যালো.`;
    const sys = "Write only the message text, no quotes or preamble.";
    try {
      const res = await generateText(prompt, sys);
      setMessage(res);
    } catch (err) {
      console.error(err);
      toast("Error generating message", "err");
    } finally {
      setLoadingMsg(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink/5 overflow-hidden flex flex-col">
      <div className="p-5 flex gap-4 items-center border-b border-ink/5">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-xl shrink-0"
          style={{ background: creator.avatar_gradient }}
        >
          {creator.avatar_initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg truncate">{creator.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="truncate">{creator.handle}</span>
            <span>•</span>
            <span>{creator.platform}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="text-center border border-ink/5 rounded-lg py-2 bg-cream2/30">
            <div className="text-[10px] font-bold text-muted uppercase">Followers</div>
            <div className="font-bold text-ink">{creator.followers}</div>
          </div>
          <div className="text-center border border-ink/5 rounded-lg py-2 bg-cream2/30">
            <div className="text-[10px] font-bold text-muted uppercase">Eng Rate</div>
            <div className="font-bold text-ink">{creator.engagement}</div>
          </div>
          <div className="text-center border border-ink/5 rounded-lg py-2 bg-cream2/30">
            <div className="text-[10px] font-bold text-muted uppercase">Est. CPE</div>
            <div className="font-bold text-ink">{creator.cpe}</div>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-xs font-bold text-ink uppercase mb-1">
            <span>Brand Fit</span>
            <span>{creator.fit_score}/100</span>
          </div>
          <div className="w-full h-1.5 bg-ink/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber rounded-full" style={{ width: `${creator.fit_score}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 bg-ink/5 text-ink rounded text-[10px] uppercase font-bold tracking-wide">
            {creator.tier}
          </span>
          {creator.tags.map((t, i) => (
            <span key={i} className="px-2 py-0.5 bg-cream border border-ink/5 text-ink rounded text-[10px] uppercase font-bold tracking-wide">
              {t}
            </span>
          ))}
        </div>

        <p className="font-bangla text-sm text-ink/80 italic border-l-2 border-amber pl-3 mb-6 flex-1">
          {creator.reason_bn}
        </p>

        <div className="flex gap-3 mt-auto">
          <button 
            onClick={handleMessage}
            className="flex-1 bg-cream border border-ink/10 hover:border-ink/30 text-ink font-bold py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} />
            <span>Outreach</span>
          </button>
          <button 
            onClick={() => toast("Creator added to list!", "ok")}
            className="flex-1 bg-ink hover:bg-ink2 text-cream font-bold py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {msgOpen && (
        <div className="bg-cream p-4 border-t border-ink/5 animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold uppercase text-muted">Suggested Message</span>
             {message && (
               <button onClick={() => { navigator.clipboard.writeText(message); toast("Copied!", "ok"); }} className="text-muted hover:text-ink">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
               </button>
             )}
          </div>
          {loadingMsg ? (
            <div className="flex items-center gap-2 text-sm text-muted p-2">
              <div className="w-4 h-4 rounded-full border-2 border-amber border-t-transparent animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <p className="font-bangla text-sm whitespace-pre-wrap">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}
