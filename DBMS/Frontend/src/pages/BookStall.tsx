import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import PageTransition from '@/components/PageTransition';
import { apiRequest } from '@/utils/apiUtils';

interface EventDetails {
  event_id: string;
  title: string;
  start_date: string;
  stall_price: number;
  has_stall: boolean;
  description: string;
}

interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}

const BookStall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventIdFromQuery = searchParams.get('eventId') || "";

  const [formData, setFormData] = useState({
    eventId: eventIdFromQuery,
    boothSize: "standard",
    specialRequirements: "",
    products: ""
  });

  const [loading, setLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [fetchingEventDetails, setFetchingEventDetails] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!formData.eventId) {
        setFetchingEventDetails(false);
        return;
      }
      try {
        const response = await apiRequest<EventDetails>(`/api/event/${formData.eventId}`);
        if (response) {
          // Check if the event has stalls enabled
          if (!response.has_stall) {
            toast({
              title: "Not Available",
              description: "This event does not support vendor stalls.",
              variant: "destructive"
            });
            navigate(`/event/${formData.eventId}`);
            return;
          }
          setEventDetails(response);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch event details",
            variant: "destructive"
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not fetch event details",
          variant: "destructive"
        });
      } finally {
        setFetchingEventDetails(false);
      }
    };

    fetchEventDetails();
  }, [formData.eventId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventId) {
      toast({
        title: "Error",
        description: "Event ID is missing",
        variant: "destructive"
      });
      return;
    }

    if (!formData.products.trim()) {
      toast({
        title: "Error",
        description: "Please list the products you plan to sell",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        size: formData.boothSize,
        description: formData.specialRequirements,
        products: formData.products
      };

      const response = await apiRequest<ApiResponse<unknown>>(
        `/api/stall/requestStallBooking/${formData.eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: requestData
        }
      );

      const { status, message } = response || {};

      if (status === 201) {
        toast({
          title: "Success",
          description: "Your stall booking request has been sent to the event organizer for review.",
        });
        navigate('/vendor-profile');
      } else if (status === 409) {
        toast({
          title: "Already Requested",
          description: message || "You have already requested/booked a stall for this event.",
          variant: "destructive"
        });
      } else if (status === 404) {
        toast({
          title: "No Available Stalls",
          description: message || "No available stalls for this event.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Booking Failed",
          description: message || "Could not submit booking request.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not connect to server.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEventDetails) {
    return (
      <PageTransition>
        <div className="container mx-auto py-10">
          <Card>
            <CardContent className="flex justify-center items-center min-h-[200px]">
              Loading event details...
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  if (!eventDetails && !fetchingEventDetails) {
    return (
      <PageTransition>
        <div className="container mx-auto py-10">
          <Card>
            <CardContent className="flex justify-center items-center min-h-[200px]">
              Event not found or you don't have access to it.
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Book a Stall</CardTitle>
            <CardDescription>
              {eventDetails && (
                <>
                  Event: {eventDetails.title}
                  <br />
                  Date: {new Date(eventDetails.start_date).toLocaleDateString()}
                  <br />
                  Stall Price: ${eventDetails.stall_price}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">              
              <div className="space-y-2">
                <Label htmlFor="boothSize">Size</Label>
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
                <Label htmlFor="products">Products You Will Sell *</Label>
                <Textarea 
                  id="products" 
                  name="products"
                  placeholder="List the products you plan to sell at this event"
                  value={formData.products} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialRequirements">Special Requirements or Description</Label>
                <Textarea 
                  id="specialRequirements" 
                  name="specialRequirements"
                  placeholder="Any special requirements or additional details about your stall"
                  value={formData.specialRequirements} 
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/vendor-profile')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !eventDetails}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};

export default BookStall;
