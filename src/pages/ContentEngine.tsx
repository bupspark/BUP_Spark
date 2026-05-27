import { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useBrand } from '../hooks/useBrand';
import { Sparkles, ClipboardCopy, FileImage, Youtube, Instagram, PenTool } from 'lucide-react';
import { toast } from '../hooks/useToast';
import { Link } from 'react-router-dom';

export default function ContentEngine() {
  const { generateJSON, isLoading, error } = useGemini();
  const { brand } = useBrand();
  const [campaignType, setCampaignType] = useState('');
  const [tone, setTone] = useState('Warm & Premium');
  const [platformTab, setPlatformTab] = useState<'Facebook' | 'Instagram' | 'TikTok'>('Facebook');

  const [result, setResult] = useState<{
    ad_copy_bn: string;
    ad_copy_en: string;
    captions: { text: string; lang: 'en' | 'bn' }[];
    video_script: { timestamp: string; section: string; script_bn: string }[];
    image_brief: string;
    hashtags: string[];
    best_post_times: string[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!brand.name) {
      toast("Please configure your Brand Twin first", "warn");
      return;
    }
    const topic = campaignType || 'General Promotion';
    const prompt = `Generate complete ${platformTab} marketing content for "${brand.name}" (${brand.category}) — ${topic} campaign. Tone: ${tone}. Target audience: ${brand.target}.
Return JSON only:
{
"ad_copy_bn": "Bangla ad copy with emojis, 80-100 words",
"ad_copy_en": "English translation, 40 words",
"captions": [
{"text": "caption text", "lang": "bn"},
{"text": "caption text", "lang": "en"}
],
"video_script": [
{"timestamp": "0:00–0:05", "section": "Hook", "script_bn": "Bangla hook text"}
],
"image_brief": "Midjourney/Canva English prompt for the visual",
"hashtags": ["#tag1", "#tag2", "#tag3"],
"best_post_times": ["সোমবার রাত ৮টা"]
}`;
    const sys = "You are a Bangladeshi social media marketing expert. Return only valid JSON. Use culturally authentic Bangla.";
    
    try {
      const data = await generateJSON(prompt, sys);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("📋 Copied to clipboard!", "ok");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-3xl mb-2 text-ink">Content Engine</h1>
        <p className="text-muted">Generate platform-specific creatives in authentic Bangla.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-ink/5 p-4 lg:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Campaign Topic</label>
            <input 
              value={campaignType} onChange={e => setCampaignType(e.target.value)}
              className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber"
              placeholder="e.g. New Collection Launch"
            />
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Voice & Tone</label>
            <select 
              value={tone} onChange={e => setTone(e.target.value)}
              className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber"
            >
              <option>Warm & Premium</option>
              <option>Casual & Trendy</option>
              <option>Urgent & Exciting</option>
              <option>Emotional & Traditional</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate} disabled={isLoading}
            className="w-full md:w-auto bg-amber hover:bg-amber2 text-ink font-bold py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 h-[46px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-ink/10 pb-px">
        {(['Facebook', 'Instagram', 'TikTok'] as const).map(p => (
          <button
            key={p}
            onClick={() => { setPlatformTab(p); setResult(null); }}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-colors relative ${
              platformTab === p ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {p}
            {platformTab === p && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink" />
            )}
          </button>
        ))}
      </div>

      {error && <div className="text-coral text-sm">{error}</div>}

      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
          
          <div className="space-y-6">
            {/* Ad Copy */}
            <div className="bg-white rounded-xl shadow-sm border border-ink/5 overflow-hidden">
              <div className="bg-cream2 px-4 py-3 border-b border-ink/5 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider">Primary Ad Copy</span>
                <button onClick={() => copyText(result.ad_copy_bn)} className="p-1 hover:bg-ink/5 rounded text-muted hover:text-ink transition-colors">
                  <ClipboardCopy size={16} />
                </button>
              </div>
              <div className="p-5">
                <p className="font-bangla whitespace-pre-wrap leading-relaxed text-[15px]">{result.ad_copy_bn}</p>
                <div className="mt-4 pt-4 border-t border-ink/5">
                  <p className="text-xs text-muted italic whitespace-pre-wrap">{result.ad_copy_en}</p>
                </div>
              </div>
            </div>

            {/* Captions */}
            <div className="bg-white rounded-xl shadow-sm border border-ink/5 overflow-hidden">
              <div className="bg-cream2 px-4 py-3 border-b border-ink/5">
                <span className="text-xs font-bold uppercase tracking-wider">Short Captions</span>
              </div>
              <div className="p-2 space-y-2">
                {result.captions.map((cap, i) => (
                  <div key={i} className="bg-cream p-3 rounded-lg border border-ink/5 group relative">
                    <button 
                      onClick={() => copyText(cap.text)} 
                      className="absolute top-3 right-3 p-1 bg-white opacity-0 group-hover:opacity-100 rounded text-muted hover:text-ink shadow-sm transition-all"
                    >
                      <ClipboardCopy size={14} />
                    </button>
                    <p className={`pr-8 text-sm ${cap.lang === 'bn' ? 'font-bangla' : ''}`}>{cap.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="bg-white rounded-xl shadow-sm border border-ink/5 p-5">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-xs font-bold uppercase tracking-wider">Hashtags</span>
                 <button onClick={() => copyText(result.hashtags.join(' '))} className="p-1 hover:bg-ink/5 rounded text-muted hover:text-ink transition-colors">
                  <ClipboardCopy size={16} />
                 </button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {result.hashtags.map((h, i) => (
                   <span key={i} className="px-3 py-1.5 bg-ink text-cream rounded-full text-xs font-mono">
                     {h}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Video Script */}
            <div className="bg-white rounded-xl shadow-sm border border-ink/5 overflow-hidden">
              <div className="bg-cream2 px-4 py-3 border-b border-ink/5 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider">Video Script / Storyboard</span>
                <button 
                  onClick={() => copyText(result.video_script.map(s => `[${s.timestamp}] ${s.section}: ${s.script_bn}`).join('\n'))} 
                  className="p-1 hover:bg-ink/5 rounded text-muted hover:text-ink transition-colors"
                >
                  <ClipboardCopy size={16} />
                </button>
              </div>
              <div className="p-0">
                {result.video_script.map((sc, i) => (
                  <div key={i} className={`p-4 border-b border-ink/5 last:border-0 border-l-4 ${i === 0 ? 'border-l-amber' : i===1 ? 'border-l-coral' : 'border-l-green'}`}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold uppercase text-ink">{sc.section}</span>
                      <span className="text-[10px] font-mono text-muted bg-cream2 px-2 py-0.5 rounded">{sc.timestamp}</span>
                    </div>
                    <p className="font-bangla text-sm">{sc.script_bn}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Brief */}
            <div className="bg-white rounded-xl shadow-sm border border-ink/5 overflow-hidden">
              <div className="bg-cream2 px-4 py-3 border-b border-ink/5 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider">Creative Brief (GenAI/Canva)</span>
                <button onClick={() => copyText(result.image_brief)} className="p-1 hover:bg-ink/5 rounded text-muted hover:text-ink transition-colors">
                  <ClipboardCopy size={16} />
                </button>
              </div>
              <div className="p-5 flex gap-4">
                <div className="w-12 h-12 bg-amber/10 text-amber rounded-xl flex items-center justify-center shrink-0">
                  <FileImage size={24} />
                </div>
                <p className="text-sm leading-relaxed">{result.image_brief}</p>
              </div>
            </div>

            {/* Best Post Times */}
            <div className="bg-white rounded-xl shadow-sm border border-ink/5 overflow-hidden">
              <div className="bg-cream2 px-4 py-3 border-b border-ink/5">
                <span className="text-xs font-bold uppercase tracking-wider">Best Posting Times</span>
              </div>
              <div className="p-0">
                {result.best_post_times.map((time, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border-b border-ink/5 last:border-0 hover:bg-cream transition-colors">
                    <span className="font-bangla px-2">{time}</span>
                    <span className="w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold">
                      #{i+1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="h-64 border-2 border-dashed border-ink/10 rounded-xl flex items-center justify-center bg-cream2/20">
            <div className="text-center text-muted">
              <PenTool className="mx-auto mb-3 opacity-20" size={48} />
              <p className="text-sm">Configure your campaign and hit generate.</p>
            </div>
        </div>
      )}
    </div>
  );
}
