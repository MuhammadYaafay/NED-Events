
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import PageTransition from '@/components/PageTransition';

const BookStall = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventId: "",
    boothSize: "standard",
    specialRequirements: "",
    products: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the stall booking request to your backend
    toast({
      title: "Stall Booking Request Submitted",
      description: "Your request has been sent to the event organizer for review.",
    });
    navigate('/vendor-profile');
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Book a Stall</CardTitle>
            <CardDescription>Submit a request to participate in an event</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventId">Select Event</Label>
                <Select 
                  value={formData.eventId} 
                  onValueChange={(value) => handleSelectChange("eventId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Summer Craft Fair</SelectItem>
                    <SelectItem value="2">Artisan Food Festival</SelectItem>
                    <SelectItem value="3">Holiday Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="boothSize">Booth Size</Label>
                <Select 
                  value={formData.boothSize} 
                  onValueChange={(value) => handleSelectChange("boothSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select booth size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (8x8)</SelectItem>
                    <SelectItem value="standard">Standard (10x10)</SelectItem>
                    <SelectItem value="large">Large (10x20)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="products">Products You Will Sell</Label>
                <Textarea 
                  id="products" 
                  name="products"
                  placeholder="List the products you plan to sell at this event"
                  value={formData.products} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea 
                  id="specialRequirements" 
                  name="specialRequirements"
                  placeholder="Any special requirements for your booth (electricity, water, etc.)"
                  value={formData.specialRequirements} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Standard booth fee is $250. Additional fees may apply based on your selection.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/vendor-profile')}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};

export default BookStall;
