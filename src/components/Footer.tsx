
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 bg-muted text-muted-foreground mt-12">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
        </div>
        <p>&copy; {currentYear} AI Gift Finder. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Lovable AI</p>
        <p className="text-xs mt-1">Project by Alexandros Chariton</p>
      </div>
    </footer>
  );
};

export default Footer;
