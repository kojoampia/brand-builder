/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Image as ImageIcon, Layout, Newspaper, Share2, Loader2, RefreshCw } from "lucide-react";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Medium = 'billboard' | 'newspaper' | 'social';

interface GeneratedAsset {
  medium: Medium;
  url: string;
  prompt: string;
}

interface BrandPlan {
  visualAnchor: string;
  prompts: Record<Medium, string>;
}

export default function App() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateBrand = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setAssets([]);

    try {
      // Step 1: Generate Visual Anchor and specific prompts using Gemini 3 Flash
      const planResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I have a product: "${description}". 
        Create a consistent visual brand plan for it. 
        1. A "visualAnchor": A highly detailed physical description of the product (materials, colors, lighting, unique features) to ensure consistency.
        2. Three specific image prompts based on this anchor:
           - billboard: Cinematic shot on a massive outdoor billboard.
           - newspaper: A classic, high-contrast newspaper advertisement layout.
           - social: A sleek, modern studio-quality social media product shot.
        IMPORTANT: NO PEOPLE should be in any images. Keep the product central and iconic.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              visualAnchor: { type: Type.STRING },
              prompts: {
                type: Type.OBJECT,
                properties: {
                  billboard: { type: Type.STRING },
                  newspaper: { type: Type.STRING },
                  social: { type: Type.STRING }
                },
                required: ['billboard', 'newspaper', 'social']
              }
            },
            required: ['visualAnchor', 'prompts']
          }
        }
      });

      const plan: BrandPlan = JSON.parse(planResponse.text);
      const mediums: Medium[] = ['billboard', 'newspaper', 'social'];
      
      // Step 2: Generate images using Nano-Banana (gemini-2.5-flash-image)
      const generatedAssets: GeneratedAsset[] = [];
      
      for (const medium of mediums) {
        const fullPrompt = `${plan.prompts[medium]}. Consistency focus: ${plan.visualAnchor}. Professional photography, no humans, clear product branding.`;
        
        const imgResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: medium === 'billboard' ? "16:9" : medium === 'social' ? "1:1" : "3:4"
            }
          }
        });

        // Find the image part in response
        for (const part of imgResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedAssets.push({
              medium,
              url: `data:image/png;base64,${part.inlineData.data}`,
              prompt: fullPrompt
            });
            // Update UI incrementally if possible, but for simplicity we'll set all at once or per step
            setAssets(prev => [...prev, {
              medium,
              url: `data:image/png;base64,${part.inlineData.data}`,
              prompt: fullPrompt
            }]);
            break;
          }
        }
      }

    } catch (err) {
      console.error(err);
      setError('Failed to generate brand assets. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#00FF00] selection:text-[#000000]">
      {/* Header */}
      <header className="border-b-2 border-black p-6 flex justify-between items-end">
        <div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase mb-1">Creative Suite v1.0</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Brand <span className="text-[#00FF00] inline-block -rotate-2">Builder</span>
          </h1>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[10px] font-mono uppercase opacity-50">Latency: Low</div>
          <div className="text-[10px] font-mono uppercase opacity-50">Model: Nano-Banana</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          
          {/* Controls */}
          <section className="space-y-8">
            <div className="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Define Product
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: A futuristic eco-friendly reusable water bottle made of transparent bioluminescent glass with a minimalist cork cap..."
                className="w-full h-40 p-4 border-2 border-black focus:outline-none focus:ring-0 focus:bg-[#F0F0F0] transition-colors resize-none font-mono text-sm"
              />
              <button
                onClick={generateBrand}
                disabled={isGenerating || !description.trim()}
                className="mt-6 w-full py-4 bg-[#00FF00] border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Universe...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Build Brand
                  </>
                )}
              </button>
            </div>

            <div className="border-2 border-black p-6 bg-[#F5F5F5]">
              <h3 className="text-xs font-bold uppercase opacity-50 mb-4">Quality Assurance</h3>
              <ul className="space-y-2 text-xs font-medium uppercase tracking-tight">
                <li className="flex items-center gap-2 text-[#00AA00]">✓ Consistent Product Identity</li>
                <li className="flex items-center gap-2 text-[#00AA00]">✓ Zero Human Presence</li>
                <li className="flex items-center gap-2 text-[#00AA00]">✓ High Contrast Renders</li>
                <li className="flex items-center gap-2 text-[#00AA00]">✓ Medium-Specific Geometry</li>
              </ul>
            </div>
          </section>

          {/* results */}
          <section className="space-y-8">
            {error && (
              <div className="bg-red-500 text-white border-2 border-black p-4 font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {error}
              </div>
            )}

            {!isGenerating && assets.length === 0 && !error && (
              <div className="h-[60vh] border-2 border-dashed border-black rounded-lg flex flex-col items-center justify-center text-center p-12 opacity-30">
                <ImageIcon className="w-24 h-24 mb-6" />
                <p className="text-xl font-bold uppercase max-w-sm">
                  Describe your vision and hit the button to see it across multiple dimensions.
                </p>
              </div>
            )}

            {(isGenerating || assets.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {assets.map((asset, index) => (
                    <motion.div
                      key={asset.medium}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.2, type: "spring", damping: 15 }}
                      className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden flex flex-col"
                    >
                      <div className="border-b-2 border-black p-3 bg-black text-white flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          {asset.medium === 'billboard' && <Layout className="w-3 h-3" />}
                          {asset.medium === 'newspaper' && <Newspaper className="w-3 h-3" />}
                          {asset.medium === 'social' && <Share2 className="w-3 h-3" />}
                          Dimension: {asset.medium}
                        </span>
                      </div>
                      <div className="bg-[#111] overflow-hidden group relative">
                        <img
                          src={asset.url}
                          alt={asset.medium}
                          referrerPolicy="no-referrer"
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ aspectRatio: asset.medium === 'billboard' ? "16/9" : asset.medium === 'social' ? "1/1" : "3/4" }}
                        />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center">
                          <p className="text-[10px] text-white font-mono leading-relaxed line-clamp-4">
                            {asset.prompt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* skeletons while generating */}
                  {isGenerating && Array.from({ length: 3 - assets.length }).map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden aspect-[4/3] flex items-center justify-center relative"
                    >
                      <div className="absolute inset-0 bg-[#F0F0F0] animate-pulse" />
                      <div className="relative z-10 flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                        <span className="text-[10px] font-bold uppercase mt-2 opacity-20 tracking-widest">Rendering...</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Marquee Footer */}
      <footer className="border-t-2 border-black mt-20 py-4 bg-black text-white overflow-hidden whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-12 font-black uppercase text-xl"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i}>
              No Humans Allowed <span className="text-[#00FF00]">/</span> Instant Brand Identity <span className="text-[#00FF00]">/</span> Nano-Banana Powered <span className="text-[#00FF00]">/</span> Digital Craftsmanship
            </span>
          ))}
        </motion.div>
      </footer>
    </div>
  );
}
