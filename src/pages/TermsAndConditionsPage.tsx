
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, PartyPopper } from 'lucide-react';

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
              <PartyPopper className="h-8 w-8 text-accent absolute -top-2 -right-3 transform rotate-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">The "Legal Stuff" (But Fun Version)</h1>
            <p className="text-lg text-muted-foreground mt-2">Basically: Have fun, it's a demo! 🥳</p>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground bg-card p-6 sm:p-8 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-accent" /> Welcome to the Demo Zone!
            </h2>
            <p>Hey there! This AI Gift Finder is a cool demo built for a competition by Alexandros Chariton. It's here to show off some neat AI tricks, not to run a global gift empire (yet!).</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-accent" /> Gift Suggestions are Just... Suggestions!
            </h2>
            <p>Our AI tries its best, but gift-giving is an art, not a science! The ideas you see are for fun and inspiration. If your aunt Mildred hates the AI-suggested rubber chicken, well, that's showbiz!</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-accent" /> No Responsibility for Gift Flops!
            </h2>
            <p>To be super clear: If a gift suggested by this app doesn't go down well, we (AI Gift Finder & Alexandros) can't be held responsible. We're just the idea-sparkers, you're the gift-giving hero (or villain, depending on the gift!).</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-accent" /> Pretty Pixels & Smart Code
            </h2>
            <p>The look and feel? That's our creative juice. The product data? It's pretend, for this demo. Don't try to buy "Invisible Socks for Shy Unicorns" – it's not real (as far as we know).</p>

            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-accent" /> Use It, Enjoy It, Don't Sue It!
            </h2>
            <p>This is all for kicks and giggles (and a competition). Use it at your own risk, but mostly, just have fun with it!</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <PartyPopper className="h-5 w-5 mr-2 text-accent" /> These "Terms" Might Change (If We Remember)
            </h2>
            <p>It's a demo. If we tweak these fun "terms," we'll update this page. But mostly, we're focused on the AI part!</p>
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="animate-pulse">
              <RouterLink to="/">Let's Find Some Gifts!</RouterLink>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
