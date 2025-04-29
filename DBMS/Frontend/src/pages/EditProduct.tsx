
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import PageTransition from '@/components/PageTransition';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "Sample Product",
    price: "$24.99",
    description: "This is a sample product description.",
    image: "https://placehold.co/600x400"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the product data to your backend
    toast({
      title: "Product Updated",
      description: "Your product has been successfully updated.",
    });
    navigate('/vendor-profile');
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={product.name} 
                  onChange={(e) => setProduct({...product, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  value={product.price} 
                  onChange={(e) => setProduct({...product, price: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={product.description} 
                  onChange={(e) => setProduct({...product, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  value={product.image} 
                  onChange={(e) => setProduct({...product, image: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/vendor-profile')}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};

export default EditProduct;
