
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Terms and Conditions</h1>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground bg-card p-6 rounded-lg shadow">
            <p>Welcome to AI Gift Finder!</p>
            <p>These terms and conditions outline the rules and regulations for the use of AI Gift Finder's Website.</p>
            <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use AI Gift Finder if you do not agree to take all of the terms and conditions stated on this page.</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Demo Application</h2>
            <p>Please be aware that AI Gift Finder is a demonstration application created for a competition. The features, product suggestions, and functionalities are for illustrative purposes only.</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">No Guarantees</h2>
            <p>While we strive to provide fun and interesting gift suggestions, we make no guarantees or warranties regarding the suitability, availability, or appropriateness of any gift suggested by the AI. The final decision and responsibility for any gift purchased rests solely with you, the user.</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Limitation of Liability</h2>
            <p>AI Gift Finder and its creators (Alexandros Chariton) bear no responsibility or liability if the recipient of a gift chosen based on suggestions from this application does not like the gift. We are not responsible for any disappointment, financial loss, or other issues that may arise from the use of this service or the purchase of suggested gifts.</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Intellectual Property</h2>
            <p>The content, design, and underlying technology of this website are the property of its creators unless otherwise stated. The product data used for suggestions is mock data for demonstration purposes.</p>

            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Use at Your Own Risk</h2>
            <p>You agree to use this website and its gift suggestions at your own risk. We are not liable for any direct or indirect damages arising from your use of this website.</p>
            
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Changes to Terms</h2>
            <p>We reserve the right to revise these terms and conditions at any time. By using this Website, you are expected to review these terms on a regular basis.</p>
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
