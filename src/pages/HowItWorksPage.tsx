
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle, Gift } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <Lightbulb className="h-10 w-10 text-accent mb-4" />,
      title: "1. Tell Us About the Recipient",
      description: "Open the 'Find a Gift Now' modal and select a few key characteristics like age range, gender, the occasion for the gift, and some of their interests. The more details, the better!"
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-accent mb-4" />,
      title: "2. AI Magic Happens",
      description: "Our intelligent system processes your selections and scours our curated product database to find suitable gift ideas."
    },
    {
      icon: <Gift className="h-10 w-10 text-accent mb-4" />,
      title: "3. Discover Perfect Gifts",
      description: "Within moments, you'll receive a list of thoughtful gift suggestions tailored to the recipient. It's that simple to find the perfect present!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">How AI Gift Finder Works</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Finding the perfect gift is easy with our simple 3-step process.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-xl shadow-lg text-center"
            >
              {step.icon}
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
