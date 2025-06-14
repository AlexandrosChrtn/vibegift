
import { Link as RouterLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <RouterLink to={to} className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary transition-colors rounded-md">
    {children}
  </RouterLink>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { to: "/about", label: "About" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-and-conditions", label: "Terms & Conditions" },
  ];

  return (
    <footer className="py-8 bg-muted text-muted-foreground mt-auto"> {/* Changed mt-12 to mt-auto for better stickiness in some layouts */}
      <div className="container mx-auto text-center">
        {/* Desktop Links */}
        <div className="hidden md:flex justify-center space-x-4 mb-4">
          {footerLinks.map(link => (
            <RouterLink key={link.to} to={link.to} className="hover:text-primary transition-colors">
              {link.label}
            </RouterLink>
          ))}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex justify-center mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Footer navigation">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              {footerLinks.map(link => (
                <DropdownMenuItem key={link.to} asChild>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p>&copy; {currentYear} AI Gift Finder. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Lovable AI</p>
        <p className="text-xs mt-1">Project by Alexandros Chariton</p>
      </div>
    </footer>
  );
};

export default Footer;
