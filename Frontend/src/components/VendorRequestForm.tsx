
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Store } from 'lucide-react';

interface VendorRequestFormProps {
  eventId: string;
  eventName: string;
  onClose: () => void;
}

const VendorRequestForm = ({ eventId, eventName, onClose }: VendorRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [boothSize, setBoothSize] = useState('small');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Request Submitted Successfully",
        description: `Your vendor request for ${eventName} has been sent to the organizer.`,
      });
      onClose();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          <span>Apply as Vendor</span>
        </CardTitle>
        <CardDescription>
          Request to participate as a vendor for "{eventName}"
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="boothSize">Stall Size</Label>
            <select 
              id="boothSize"
              value={boothSize}
              onChange={(e) => setBoothSize(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="small">Small (10x10 ft)</option>
              <option value="medium">Medium (10x20 ft)</option>
              <option value="large">Large (20x20 ft)</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="description">Description of Your Business</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your business..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="products">Products/Services You'll Offer</Label>
            <Textarea 
              id="products" 
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              placeholder="List the products or services you'll be showcasing..."
              className="min-h-[100px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VendorRequestForm;
