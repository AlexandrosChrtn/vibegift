
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
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Our Super Simple Privacy Note</h1>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground bg-card p-6 sm:p-8 rounded-lg shadow-xl text-center">
            <p className="text-xl">We don't collect much for now! This is a demo app. So, relax and enjoy finding gifts without worrying about your data being secretly hoarded. 😉</p>
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
