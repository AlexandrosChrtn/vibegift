
import { Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="py-6 bg-background shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Gift className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">AI Gift Finder</h1>
        </Link>
        {/* Future navigation links can go here */}
      </div>
    </header>
  );
};

export default Header;
