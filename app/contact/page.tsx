'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import { Mail, Instagram, Twitter, MapPin, Send, Loader2, CheckCircle2, Phone } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Order Inquiry',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'Order Inquiry',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Info */}
          <div>
            <h1 className="text-6xl font-display font-bold tracking-tighter mb-8">GET IN TOUCH</h1>
            <p className="text-muted-foreground font-light text-lg mb-12 leading-relaxed">
              Have a question about an order, a drop, or just want to say hi? We&apos;re here to help.
            </p>

            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-background flex items-center justify-center border border-border">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Email Us</h3>
                  <p className="text-lg font-medium">support.hayzeclothing@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-background flex items-center justify-center border border-border">
                  <Instagram size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Socials</h3>
                  <p className="text-lg font-medium">@hayze_clothing</p>
                </div>
              </div>

              {/* phone number */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-background flex items-center justify-center border border-border">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Phone</h3>
                  <p className="text-lg font-medium">+94 76 2830 590</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-background p-10 border border-border">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-center py-20">
                <CheckCircle2 size={48} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-display font-bold">Message Sent</h3>
                <p className="text-muted-foreground font-light mb-8 max-w-sm">
                  Thanks for reaching out! We&apos;ve received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-foreground text-background px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground transition-colors appearance-none"
                  >
                    <option className="bg-background">Order Inquiry</option>
                    <option className="bg-background">Returns & Exchanges</option>
                    <option className="bg-background">General Question</option>
                    <option className="bg-background">Collaboration</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-foreground text-background py-5 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      Sending...
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
