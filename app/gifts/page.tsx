'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Gift, Copy, Check, Send, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GiftPage() {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [giftLink, setGiftLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, recipientName, message }),
      });

      if (res.ok) {
        const data = await res.json();
        const link = `${window.location.origin}/gifts/claim/${data._id}`;
        setGiftLink(link);
      }
    } catch (error) {
      console.error('Error creating gift:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(giftLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-border mb-6">
            <Gift size={32} />
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tighter mb-4">SEND A GIFT</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">
            Create a unique gift link for your friend to choose their favorite piece.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!giftLink ? (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-8 border border-border p-8 md:p-12 bg-background"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-transparent border border-border px-4 py-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-foreground transition-all"
                    placeholder="ENTER YOUR NAME"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Recipient&apos;s Name</label>
                  <input 
                    type="text" 
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-transparent border border-border px-4 py-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-foreground transition-all"
                    placeholder="ENTER FRIEND'S NAME"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Personal Message (Optional)</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border border-border px-4 py-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-foreground transition-all resize-none"
                  placeholder="ADD A SPECIAL MESSAGE..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-foreground text-background py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'GENERATING...' : 'GENERATE GIFT LINK'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-border p-8 md:p-12 bg-background text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-bold tracking-tighter">GIFT LINK READY</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                  Share this link with {recipientName}. They&apos;ll be able to browse and select their gift.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-muted p-4 border border-border">
                <input 
                  type="text" 
                  readOnly 
                  value={giftLink}
                  className="bg-transparent flex-1 text-[10px] tracking-widest outline-none overflow-hidden text-ellipsis"
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-foreground hover:text-background transition-all border border-transparent hover:border-border"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <div className="pt-8 border-t border-border">
                <p className="text-[8px] uppercase tracking-[0.4em] opacity-50 mb-6">How it works</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold">01. SHARE</span>
                    <p className="text-[10px] opacity-50 leading-relaxed">Send the link to your friend via any messaging app.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold">02. CHOOSE</span>
                    <p className="text-[10px] opacity-50 leading-relaxed">Your friend selects their favorite item and size.</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold">03. ORDER</span>
                    <p className="text-[10px] opacity-50 leading-relaxed">You&apos;ll be notified to complete the order for them.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setGiftLink('')}
                className="text-[8px] uppercase tracking-[0.4em] font-bold opacity-50 hover:opacity-100 transition-opacity"
              >
                Create another gift
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
