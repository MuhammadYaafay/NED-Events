import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageTransition from '@/components/PageTransition';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock event data - in a real app, you would fetch this based on the ID
  const event = {
    id: id,
    name: "Summer Craft Fair",
    date: "June 15, 2023",
    time: "10:00 AM - 6:00 PM",
    location: "Central Park, New York",
    status: "approved",
    description: "Join us for a celebration of local craftsmanship featuring over 50 vendors with handmade goods, live music, and food trucks.",
    boothDetails: "Section A, Spot 42",
    attendees: "2,500+ expected",
    organizer: {
      name: "Craft Guild of New York",
      email: "info@craftguildny.org",
      phone: "(212) 555-1234"
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{event.name}</CardTitle>
                    <CardDescription>Event Details</CardDescription>
                  </div>
                  {getStatusBadge(event.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p>{event.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p>{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Attendees</p>
                      <p>{event.attendees}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Event Description</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Your Booth Details</h3>
                  <p>{event.boothDetails}</p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => navigate('/vendor-profile')}>
                  Back to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Organizer Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
                  <p className="text-sm text-muted-foreground">{event.organizer.phone}</p>
                </div>
                
                <Button className="w-full" onClick={() => window.location.href = `mailto:${event.organizer.email}`}>
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>
            
            {event.status === 'approved' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Booth Fee:</span>
                      <span>$250.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Paid:</span>
                      <span>$250.00</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/payment-methods')}>
                    Manage Payment Methods
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EventDetails;
