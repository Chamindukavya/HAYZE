import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-24 pb-24 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
              Store Policies
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
              RETURN POLICY
            </h1>
            <div className="w-12 h-0.5 bg-foreground mx-auto mt-6" />
          </div>

          <div className="space-y-12 text-muted-foreground font-light leading-relaxed">
            <div>
              <p className="text-base md:text-lg text-foreground font-medium mb-4">
                Customers must inform us within <span className="font-bold">3 days of receiving the order</span> to request a return or exchange.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 uppercase tracking-widest text-sm">
                Return & Exchange Eligibility
              </h2>
              <ul className="list-disc pl-5 space-y-3">
                <li>Items must be unused, unwashed, and in their original condition.</li>
                <li>All original tags must be attached.</li>
                <li>Original packaging must be intact.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-6 rounded-md border border-border">
                <h3 className="text-lg font-bold text-foreground mb-3 text-sm uppercase tracking-wide">
                  Free Return Option (Same-Day)
                </h3>
                <p className="text-sm">
                  If the item is returned <span className="font-semibold">at the time of delivery (same day)</span>, the return is <span className="font-bold">completely free</span>.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-md border border-border">
                <h3 className="text-lg font-bold text-foreground mb-3 text-sm uppercase tracking-wide">
                  Return After Delivery Day
                </h3>
                <p className="text-sm">
                  If the return is requested <span className="font-semibold">after the delivery day (within 3 days)</span>, the <span className="font-bold">customer is responsible for the return courier charges</span>.
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-md border border-border">
                <h3 className="text-lg font-bold text-foreground mb-3 text-sm uppercase tracking-wide">
                  Exchanges
                </h3>
                <p className="text-sm">
                    We offer exchanges for size or defects within 7 days of delivery.

                    If you received a item dont match your size,    defective or wrong item, please contact us immediately.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 uppercase tracking-widest text-sm">
                Non-Returnable Items
              </h2>
              <p className="mb-4">The following items cannot be returned or exchanged:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>Items with strong odors, such as smoke, cologne, detergent, etc., will not be accepted.</li>
                <li>Innerwear and undergarments for hygiene reasons.</li>
                <li>Items damaged due to misuse or customer negligence.</li>
                <li>Sale or clearance items (unless defective upon arrival).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 uppercase tracking-widest text-sm">
                How to Request a Return
              </h2>
              <ol className="list-decimal pl-5 space-y-3">
                <li>Contact us within 3 days of receiving your order via WhatsApp or email.</li>
                <li>Provide your order number and the reason for your return or exchange.</li>
                <li>Clear photos of the item (especially if you received it damaged or defective).</li>
                <li>Our team will respond promptly and guide you through the return process.</li>
              </ol>
            </div>

            
          {/* //contact information */}
          <div className="bg-muted/30 p-6 rounded-md border border-border mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4 uppercase tracking-widest text-sm">
              Contact Information
            </h2>
            <p className="text-base text-foreground font-medium">
              If you have any questions, feel free to reach out to us:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>WhatsApp: +94 762830590</li>
              <li>Email: hayzeclothing.info@gmail.com</li>
            </ul>
          </div>

            
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 uppercase tracking-widest text-sm">
                Refunds
              </h2>
              <ul className="list-disc pl-5 space-y-3">
                <li>Refunds are processed after inspection of the returned item.</li>
                <li>Delivery charges are non-refundable (unless returned same-day/upon delivery).</li>
                <li>Approved refunds will be issued via bank transfer. Please allow a few business days for the transaction to reflect in your account.</li>
              </ul>
            </div>
            
            
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
