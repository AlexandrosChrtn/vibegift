
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import GiftFinderModal from '@/components/GiftFinderModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Gift, Search, Users, Smile } from 'lucide-react';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary mb-4" />,
      title: "Smart AI Suggestions",
      description: "Our AI analyzes recipient details to find truly thoughtful gifts.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary mb-4" />,
      title: "For Everyone & Every Occasion",
      description: "Gifts for all ages, genders, interests, and special moments.",
    },
    {
      icon: <Smile className="h-10 w-10 text-primary mb-4" />,
      title: "Effortless Gifting",
      description: "Take the stress out of gift-giving. Find the perfect present in minutes.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-24">
        <section className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
          <Gift className="h-24 w-24 text-primary mx-auto mb-6 animate-bounce" style={{animationDuration: '2s'}} />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Discover the Perfect Gift, Effortlessly.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Tired of endless scrolling? Let our AI-powered gift finder help you choose thoughtful presents for your loved ones based on their unique characteristics and interests.
          </p>
          <Button 
            size="lg" 
            className="px-10 py-6 text-lg font-semibold group animate-pulse bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setIsModalOpen(true)}
          >
            Find a Gift Now <Search className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </section>

        <section className="py-16 md:py-24 animate-fade-in" style={{animationDelay: '0.5s'}}>
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="bg-card p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300 animate-fade-in"
                style={{animationDelay: `${0.7 + index * 0.2}s`}}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <GiftFinderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HomePage;
