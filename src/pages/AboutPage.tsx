
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Reduced padding */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-10">
        <div className="max-w-3xl mx-auto text-center">
          <Info className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">About VibeGift</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            VibeGift was made by Alexandros Chariton for Lovable's competition, leveraging the coolest AI model out there to help you find the perfect gift!
          </p>
          <p className="text-md text-muted-foreground mb-10">
            The goal is to showcase how AI can simplify and enhance the gift-giving experience.
          </p>
          {/* Updated button text and ensured animate-pulse */}
          <Button asChild size="lg" className="animate-pulse">
            <Link to="/">Let's Find Some Gifts!</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
