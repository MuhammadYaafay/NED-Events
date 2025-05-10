
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: number;
  name: string;
  status: string;
  date: string;
}

interface EventsSectionProps {
  events: Event[];
}

const EventsSection = ({ events }: EventsSectionProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    navigate(`/event-details/${id}`);
  };

  const handleContactOrganizer = (id: number) => {
    // In a real app, this might open a chat or email form
    navigate(`/event-details/${id}?tab=contact`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Participation</CardTitle>
        <CardDescription>Manage events you're participating in</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map(event => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <Badge
                  className={
                    event.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 
                    event.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                    'bg-red-500 hover:bg-red-600'
                  }
                >
                  {event.status}
                </Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(event.id)}
                        className="overflow-hidden text-ellipsis">
                  View Details
                </Button>
                {event.status === 'pending' && (
                  <Button size="sm" variant="secondary" onClick={() => handleContactOrganizer(event.id)}
                          className="overflow-hidden text-ellipsis">
                    Contact Organizer
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsSection;
