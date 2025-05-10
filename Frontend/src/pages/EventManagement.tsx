
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const EventManagement = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching event data
    const fetchEvent = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockEvent = {
          id: Number(id),
          name: `Event ${id}`,
          date: "October 15, 2023",
          location: "Convention Center",
          boothNumber: "B-24",
          status: "Confirmed"
        };
        
        setEvent(mockEvent);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: "Error",
          description: "Failed to load event data. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto py-10">
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              <div className="text-center">
                <p>Loading event details...</p>
              </div>
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
            <CardTitle>Manage Event: {event?.name}</CardTitle>
            <CardDescription>Configure your booth and participation details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="booth">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="booth">Booth Setup</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>
              
              <TabsContent value="booth" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Event Information</h3>
                      <p className="text-sm text-muted-foreground">Date: {event?.date}</p>
                      <p className="text-sm text-muted-foreground">Location: {event?.location}</p>
                      <p className="text-sm text-muted-foreground">Booth Number: {event?.boothNumber}</p>
                      <p className="text-sm text-muted-foreground">Status: {event?.status}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Booth Options</h3>
                      <div className="mt-2 space-y-2">
                        <Button variant="outline" size="sm">Request Equipment</Button>
                        <Button variant="outline" size="sm" className="ml-2">View Floor Plan</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="mt-4">
                <div className="text-center py-8">
                  <h3 className="font-medium">Select Products to Showcase</h3>
                  <p className="text-sm text-muted-foreground">Choose which products you want to display at this event</p>
                  <Button className="mt-4">Manage Products</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-4">
                <div className="text-center py-8">
                  <h3 className="font-medium">Event Schedule</h3>
                  <p className="text-sm text-muted-foreground">Manage your schedule for this event</p>
                  <Button className="mt-4">Add Schedule Item</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="staff" className="mt-4">
                <div className="text-center py-8">
                  <h3 className="font-medium">Staff Management</h3>
                  <p className="text-sm text-muted-foreground">Assign staff to your booth</p>
                  <Button className="mt-4">Add Staff Member</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default EventManagement;
