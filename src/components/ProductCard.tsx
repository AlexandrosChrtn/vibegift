import { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.imageName === 'placeholder.svg' ? `/placeholder.svg` : `https://images.unsplash.com/${product.imageName}?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600`;

  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pop-in flex flex-col">
      <CardHeader className="p-0">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Fallback if Unsplash link fails
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full group">
          <Link to={`/product/${product.id}`}>
            View Product <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
