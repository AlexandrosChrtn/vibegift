
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 bg-muted text-muted-foreground mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} AI Gift Finder. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Lovable AI</p>
      </div>
    </footer>
  );
};

export default Footer;
