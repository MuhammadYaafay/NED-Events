
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ProductsSectionProps {
  products: Product[];
}

const ProductsSection = ({ products }: ProductsSectionProps) => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleRemoveProduct = (id: number) => {
    toast({
      title: "Product Removed",
      description: "Your product has been removed from your catalog.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Products & Services</CardTitle>
            <CardDescription>Manage what you offer at events</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddProduct}>
            Add New Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="h-48 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.price}</p>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(product.id)}>
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsSection;
