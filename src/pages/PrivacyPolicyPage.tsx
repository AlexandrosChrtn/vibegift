
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Privacy Policy</h1>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground bg-card p-6 rounded-lg shadow">
            <p>Your privacy is important to us. At AI Gift Finder, we are committed to protecting your personal information.</p>
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Information We Don't Collect</h2>
            <p>We want to be crystal clear: <strong>we do not collect, store, or share any personal information</strong> from our users when you use the AI Gift Finder service. This includes:</p>
            <ul>
              <li>No names, email addresses, or contact details.</li>
              <li>No IP addresses or device information beyond what's necessary for the site to function.</li>
              <li>No tracking cookies for advertising purposes.</li>
              <li>The selections you make in the gift finder (age, gender, interests, etc.) are used only for the current session to generate gift suggestions and are not stored or linked to you.</li>
            </ul>
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">How We Use Non-Personal Information</h2>
            <p>We may collect anonymous, aggregated data regarding usage of the website (e.g., number of visitors, pages viewed) to improve our service. This data does not identify individual users.</p>
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Third-Party Services</h2>
            <p>This website is a demo and does not integrate with third-party services that would collect your data.</p>
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            <h2 className="text-xl font-semibold text-card-foreground mt-6 mb-2">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please don't hesitate to reach out (though this is a demo project).</p>
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

export default PrivacyPolicyPage;
