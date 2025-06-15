
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products.');
        }
        const products: Product[] = await response.json();
        const foundProduct = products.find(p => p.id.toString() === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('An error occurred while fetching product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </main>
            <Footer />
        </div>
    );
  }

  if (error || !product) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-destructive mb-4">{error || 'Product could not be loaded.'}</h1>
                <Button asChild>
                    <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
                </Button>
            </main>
            <Footer />
        </div>
    );
  }

  const imageUrl = product.imageName === 'placeholder.svg' ? `/placeholder.svg` : `https://images.unsplash.com/${product.imageName}?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
            <Button variant="outline" asChild>
                <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
            </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div>
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </div>
          <div className="flex flex-col h-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-8 flex-grow">{product.description}</p>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Available at:</h2>
              <div className="space-y-3">
                <Button size="lg" className="w-full justify-between" variant="outline" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <span>Shop on Amazon</span>
                        <ShoppingCart className="h-5 w-5" />
                    </a>
                </Button>
                <Button size="lg" className="w-full justify-between" variant="outline" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <span>Buy at Walmart</span>
                        <ShoppingCart className="h-5 w-5" />
                    </a>
                </Button>
                <Button size="lg" className="w-full justify-between" variant="outline" asChild>
                     <a href="#" target="_blank" rel="noopener noreferrer">
                        <span>Find on Etsy</span>
                        <ShoppingCart className="h-5 w-5" />
                    </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
