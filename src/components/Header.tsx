
import { Gift, Menu } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <RouterLink
    to={to}
    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
  >
    {children}
  </RouterLink>
);

const Header = () => {
  const navLinks = [
    { to: "/about", label: "About" },
    // { to: "/how-it-works", label: "How It Works" }, // Old link
    { to: "/usage", label: "Usage" }, // New link
    { to: "/privacy-policy", label: "Privacy" },
    { to: "/terms-and-conditions", label: "Terms" },
  ];

  return (
    <header className="py-4 bg-background shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <RouterLink to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Gift className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">VibeGift</h1>
        </RouterLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Navigation (Hamburger Menu) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navLinks.map(link => (
                <DropdownMenuItem key={link.to} asChild>
                  <RouterLink to={link.to} className="block px-4 py-2 text-sm w-full">
                    {link.label}
                  </RouterLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
