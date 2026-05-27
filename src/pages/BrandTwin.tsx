import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useBrand } from '../hooks/useBrand';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { toast } from '../hooks/useToast';

export default function BrandTwin() {
  const { generateJSON, isLoading, error } = useGemini();
  const { brand, setBrand } = useBrand();
  const [formData, setFormData] = useState(brand);

  const [result, setResult] = useState<{
    tones: string[];
    positioning: string;
    key_messages: { bn: string; en: string }[];
    personas: { emoji: string; name: string; desc: string; age_range: string; location: string; platform: string }[];
    hashtags: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast("Please enter a Brand Name", "warn");
      return;
    }
    
    // Save to global brand profile
    setBrand(formData);

    const prompt = `Build a Brand Twin for this Bangladeshi brand:
Name: ${formData.name}
Website/Link: ${formData.website || 'N/A'}
Category: ${formData.category}
Price: ${formData.price}
Target: ${formData.target}
Description (Bangla): ${formData.desc_bn}
Competitors: ${formData.c1}, ${formData.c2}, ${formData.c3}

Note: Use the Website/Social Link if provided to strictly identify this exact brand and avoid confusing it with other brands that might have a similar name.
Return JSON only:
{
"tones": ["tone1", "tone2", "tone3"],
"positioning": "One Bangla positioning sentence",
"key_messages": [
{"bn": "Bangla message", "en": "English translation"}
],
"personas": [
{"emoji": "👩💼", "name": "Name", "desc": "15-word English desc", "age_range": "25-35", "location": "Dhaka", "platform": "Instagram"}
],
"hashtags": ["#tag1", "#tag2", "#tag3"]
}`;
    const sys = "You are an AI brand strategist for the Bangladeshi SME market. Return only valid JSON.";
    try {
      const data = await generateJSON(prompt, sys);
      setResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink text-cream rounded-xl p-8 lg:p-12 text-center border-t-4 border-amber shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-4 text-amber">Build Your Brand Twin</h1>
          <p className="text-muted text-lg">Define your brand's digital soul before simulating campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-ink/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Brand Name</label>
                <input 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                  placeholder="e.g. Rina's Boutique"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Website / Social Link</label>
                <input 
                  value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                  placeholder="e.g. facebook.com/yourpage"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Category</label>
                <select 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                >
                  <option>Fashion & Clothing</option>
                  <option>Food & Beverage</option>
                  <option>Electronics</option>
                  <option>Beauty & Skincare</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Price Range</label>
                <select 
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                >
                  <option>৳500–৳2,000</option>
                  <option>৳2,000–৳8,000</option>
                  <option>৳8,000–৳25,000</option>
                  <option>৳25,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Target Customer (EN)</label>
              <textarea 
                rows={2}
                value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})}
                className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Brand Description (BN)</label>
              <textarea 
                rows={3}
                value={formData.desc_bn} onChange={e => setFormData({...formData, desc_bn: e.target.value})}
                className="w-full bg-cream2 border border-ink/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber resize-none font-bangla"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-ink/70 mb-2">Competitors</label>
              <div className="grid grid-cols-3 gap-2">
                <input value={formData.c1} onChange={e => setFormData({...formData, c1: e.target.value})} className="w-full bg-cream2 border border-ink/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber" />
                <input value={formData.c2} onChange={e => setFormData({...formData, c2: e.target.value})} className="w-full bg-cream2 border border-ink/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber" />
                <input value={formData.c3} onChange={e => setFormData({...formData, c3: e.target.value})} className="w-full bg-cream2 border border-ink/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber" />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-amber hover:bg-amber2 text-ink font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden"
            >
              {isLoading && (
                <div className="absolute bottom-0 left-0 h-1 bg-ink/20 w-full">
                  <div className="h-full bg-ink w-1/3 animate-[marquee_1s_ease-in-out_infinite]" />
                </div>
              )}
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                  <span>তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Build My Brand Twin</span>
                </>
              )}
            </button>
            {error && <div className="text-coral text-sm mt-2">{error}</div>}
          </form>
        </div>

        {/* Result Card */}
        {result ? (
          <div className="bg-white rounded-xl shadow-sm border border-ink/5 p-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-wrap gap-2 mb-6">
              {result.tones.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-amber/10 border border-amber/30 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
                  {t}
                </span>
              ))}
            </div>

            <div className="bg-cream p-4 rounded-lg border border-ink/10 relative mb-8">
              <div className="text-xs uppercase font-bold text-muted mb-2 tracking-widest">Positioning</div>
              <p className="font-bangla text-lg font-medium leading-relaxed">{result.positioning}</p>
            </div>

            <div className="mb-8">
              <div className="text-xs uppercase font-bold text-ink mb-4 tracking-widest border-b border-ink/5 pb-2">Key Messages</div>
              <ul className="space-y-4">
                {result.key_messages.map((m, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="font-bangla font-medium text-ink mb-0.5">{m.bn}</p>
                      <p className="text-sm text-muted italic">{m.en}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <div className="text-xs uppercase font-bold text-ink mb-4 tracking-widest border-b border-ink/5 pb-2">Target Personas</div>
              <div className="grid grid-cols-1 gap-3">
                {result.personas.map((p, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl border border-ink/10 bg-cream2/30">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl shrink-0">
                      {p.emoji}
                    </div>
                    <div>
                      <div className="font-bold mb-1">{p.name}</div>
                      <p className="text-sm text-ink/80 mb-2 leading-tight">{p.desc}</p>
                      <div className="flex gap-2 text-[10px] uppercase font-bold text-muted">
                        <span className="bg-white px-2 py-0.5 rounded border border-ink/5">{p.age_range}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-ink/5">{p.location}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-ink/5">{p.platform}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
               <div className="text-xs uppercase font-bold text-ink mb-4 tracking-widest border-b border-ink/5 pb-2">Hashtags</div>
               <div className="flex flex-wrap gap-2">
                 {result.hashtags.map((h, i) => (
                   <span key={i} className="px-2.5 py-1 bg-ink text-white rounded-md text-xs font-mono">
                     {h}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-48 xl:h-full bg-cream2/20 border-2 border-dashed border-ink/10 rounded-xl flex items-center justify-center">
            <div className="text-center text-muted">
              <SlidersHorizontal className="mx-auto mb-3 opacity-20" size={48} />
              <p className="text-sm">Your Brand Twin profile will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
