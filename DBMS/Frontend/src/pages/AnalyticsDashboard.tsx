
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const AnalyticsDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching event data
    const fetchEvent = async () => {
      try {
        // Mock data for demonstration
        const mockEvent = {
          id: Number(id),
          name: `Event ${id}`,
          date: "October 15, 2023",
          metrics: {
            totalAttendees: 250,
            boothVisits: 180,
            productInteractions: 145,
            leads: 65,
            sales: 32
          }
        };
        
        setEvent(mockEvent);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
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
                <p>Loading analytics data...</p>
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
            <CardTitle>Analytics Dashboard: {event?.name}</CardTitle>
            <CardDescription>View detailed performance metrics for this event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold">{event?.metrics.boothVisits}</h3>
                    <p className="text-sm text-muted-foreground">Booth Visits</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold">{event?.metrics.leads}</h3>
                    <p className="text-sm text-muted-foreground">Leads Generated</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold">{event?.metrics.sales}</h3>
                    <p className="text-sm text-muted-foreground">Sales Completed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  <BarChart className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="visitors">
                  <LineChart className="mr-2 h-4 w-4" />
                  Visitor Analytics
                </TabsTrigger>
                <TabsTrigger value="products">
                  <PieChart className="mr-2 h-4 w-4" />
                  Product Performance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-4">Event Performance Overview</h3>
                  <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                    Chart visualization would go here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visitors" className="mt-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-4">Visitor Traffic Analysis</h3>
                  <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                    Visitor chart visualization would go here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="mt-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-4">Product Interest Distribution</h3>
                  <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                    Product chart visualization would go here
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default AnalyticsDashboard;
