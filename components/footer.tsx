import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-24">
          
          {/* Brand & Vision */}
          <div className="md:col-span-6 lg:col-span-5 space-y-8">
            <h3 className="text-3xl font-display font-bold tracking-tighter">HAYZE</h3>
            <p className="text-sm text-muted-foreground font-light max-w-sm leading-relaxed tracking-wide">
              Premium minimalist streetwear bridging the gap between high-fashion 
              and raw street culture. Quality over quantity, always.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all group">
                <Instagram size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all group">
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61581506836424" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all group">
                <Facebook size={16} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* Spacer */}
          <div className="md:col-span-1 lg:col-span-2 hidden md:block"></div>
          
          {/* Links Column 1 */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-foreground">Shop</h4>
            <ul className="space-y-4 text-xs font-medium tracking-wide text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tops" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>Tops
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bottoms" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>Bottoms
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-foreground">Support</h4>
            <ul className="space-y-4 text-xs font-medium tracking-wide text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>Contact Us
                </Link>
              </li>
              {/* 
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground transition-colors relative group inline-block">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">-</span>Shipping & Returns
                </Link>
              </li>
              */}
            </ul>
          </div>

        </div>
        
        {/* Footer Bottom Line */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
            © {new Date().getFullYear()} HAYZE CLOTHING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors relative before:content-[''] before:w-1 before:h-1 before:bg-border before:rounded-full before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Massive Background Text Overlay */}
      <div className="absolute left-0 right-0 bottom-[-5%] md:bottom-[-12%] z-0 pointer-events-none select-none flex justify-center opacity-[0.02] dark:opacity-[0.03] overflow-hidden">
        <span className="text-[28vw] font-display font-bold tracking-tighter whitespace-nowrap leading-none">
          HAYZE
        </span>
      </div>
    </footer>
  );
}
