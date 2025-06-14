
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Sparkles } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
              <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-3 transform rotate-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Our Super Chill Privacy Policy</h1>
            <p className="text-lg text-muted-foreground mt-2">Spoiler: We collect... nothing! 🎉</p>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground bg-card p-6 sm:p-8 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" /> Your Secrets Are Safe (Because We Don't Want Them!)
            </h2>
            <p>Seriously, this is a demo app for a competition. We're not interested in your data. Zip. Zilch. Nada.</p>
            <ul>
              <li><strong>What we DON'T do:</strong> Track you, store your info, sell your deepest fears to aliens.</li>
              <li><strong>What we DO with your gift choices:</strong> Use them for a hot second to show you cool gift ideas, then POOF! Gone like a forgotten birthday.</li>
            </ul>

            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" /> Anonymous Window Shopping
            </h2>
            <p>We might peek at how many folks visit, like counting window shoppers. But it's all anonymous – no names, no faces, just numbers to help us make this demo even cooler.</p>

            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" /> Third Parties? Who Needs 'Em?
            </h2>
            <p>This app is a solo act. No third-party services lurking in the shadows to snatch your data. It's just us, you, and some fun gift ideas.</p>

            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" /> Policy Shmolicy Updates
            </h2>
            <p>If we ever change this super simple policy (unlikely for a demo!), we'll update this page. But let's be real, it's probably not going to happen.</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" /> Got Questions?
            </h2>
            <p>If you're curious about our non-existent data collection, feel free to ponder. But remember, it's a demo! Have fun finding gifts!</p>
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="animate-pulse">
              <RouterLink to="/">Back to Gifting Fun!</RouterLink>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
