
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Search, Download, UserPlus, ArrowLeft } from 'lucide-react';

const AttendeeManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching event and attendee data
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockEvent = {
          id: Number(id),
          name: `Event ${id}`,
          date: "October 15, 2023",
        };
        
        const mockAttendees = [
          { id: 1, name: "John Doe", email: "john@example.com", ticketType: "VIP", checkInStatus: "Checked In" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", ticketType: "General", checkInStatus: "Not Checked In" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com", ticketType: "VIP", checkInStatus: "Checked In" },
          { id: 4, name: "Alice Brown", email: "alice@example.com", ticketType: "General", checkInStatus: "Not Checked In" },
          { id: 5, name: "Charlie Davis", email: "charlie@example.com", ticketType: "General", checkInStatus: "Checked In" },
        ];
        
        setEvent(mockEvent);
        setAttendees(mockAttendees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load attendee data. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckIn = (attendeeId: number) => {
    setAttendees(prev => 
      prev.map(attendee => 
        attendee.id === attendeeId 
          ? { ...attendee, checkInStatus: "Checked In" } 
          : attendee
      )
    );
    
    toast({
      title: "Attendee Checked In",
      description: "Attendee has been successfully checked in.",
    });
  };

  const handleBackToEvents = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto py-10">
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              <div className="text-center">
                <p>Loading attendee data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-20">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center hover:bg-background/10"
          onClick={handleBackToEvents}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Attendee Management: {event?.name}</CardTitle>
            <CardDescription>View and manage attendees for this event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search attendees..."
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Attendee
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Ticket Type</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="border-b last:border-0">
                      <td className="p-3">{attendee.name}</td>
                      <td className="p-3">{attendee.email}</td>
                      <td className="p-3">{attendee.ticketType}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          attendee.checkInStatus === "Checked In" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {attendee.checkInStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {attendee.checkInStatus !== "Checked In" ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckIn(attendee.id)}
                          >
                            Check In
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default AttendeeManagement;
