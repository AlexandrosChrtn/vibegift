
// Removed RouterLink, Menu, DropdownMenu components as they are no longer used here.

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} AI Gift Finder. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Lovable AI</p>
        <p className="text-xs mt-1">Project by Alexandros Chariton</p>
      </div>
    </footer>
  );
};

export default Footer;
