import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Store, Users, BarChart, MessageCircle, Settings, UserCog, LogOut, Check, X } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { toast } from "@/components/ui/use-toast";
import OrganizerSettingsSection from '@/components/organizer/OrganizerSettingsSection';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const navigate = useNavigate();

  const organizerData = {
    name: "Event Masters",
    email: "admin@eventmasters.com",
    logo: "https://github.com/shadcn.png",
    events: [
      { 
        id: "1", 
        title: "Tech Conference 2023", 
        date: "Oct 15, 2023", 
        attendees: 250, 
        status: "upcoming" 
      },
      { 
        id: "2", 
        title: "Digital Summit", 
        date: "Nov 20, 2023", 
        attendees: 180, 
        status: "upcoming" 
      },
      { 
        id: "3", 
        title: "Developer Meetup", 
        date: "Sep 5, 2023", 
        attendees: 120, 
        status: "completed" 
      }
    ],
    vendorRequests: [
      { 
        id: "1", 
        businessName: "Tech Gadgets Co.", 
        eventId: "1", 
        eventName: "Tech Conference 2023", 
        requestDate: "Aug 25, 2023", 
        status: "pending" 
      },
      { 
        id: "2", 
        businessName: "Coffee Express", 
        eventId: "1", 
        eventName: "Tech Conference 2023", 
        requestDate: "Aug 27, 2023", 
        status: "pending" 
      },
      { 
        id: "3", 
        businessName: "Print Solutions", 
        eventId: "2", 
        eventName: "Digital Summit", 
        requestDate: "Aug 28, 2023", 
        status: "pending" 
      }
    ]
  };

  const approveVendor = (id: string, businessName: string) => {
    toast({
      title: "Vendor Approved",
      description: `${businessName} has been approved for the event.`,
    });
  };

  const rejectVendor = (id: string, businessName: string) => {
    toast({
      title: "Vendor Rejected",
      description: `${businessName}'s request has been rejected.`,
    });
  };

  const handleViewAttendees = () => {
    if (selectedEventId) {
      navigate(`/attendee-management/${selectedEventId}`);
    } else {
      toast({
        title: "No Event Selected",
        description: "Please select an event to view attendees.",
      });
    }
  };

  const handleViewAnalytics = () => {
    if (selectedEventId) {
      navigate(`/analytics-dashboard/${selectedEventId}`);
    } else {
      toast({
        title: "No Event Selected",
        description: "Please select an event to view analytics.",
      });
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Organizer Dashboard</CardTitle>
                <CardDescription>Manage your events and vendors</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={organizerData.logo} alt={organizerData.name} />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{organizerData.name}</p>
                    <p className="text-sm text-muted-foreground">{organizerData.email}</p>
                    <Badge className="mt-2">Organizer</Badge>
                  </div>
                </div>
                <Separator />
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === "events" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("events")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Events
                  </Button>
                  <Button 
                    variant={activeTab === "vendors" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("vendors")}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Vendor Requests
                    <Badge className="ml-auto">{organizerData.vendorRequests.filter(r => r.status === "pending").length}</Badge>
                  </Button>
                  <Button 
                    variant={activeTab === "attendees" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("attendees")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Attendees
                  </Button>
                  <Button 
                    variant={activeTab === "analytics" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "events" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Events</CardTitle>
                    <CardDescription>Manage your upcoming and past events</CardDescription>
                  </div>
                  <Link to="/create-event">
                    <Button>Create New Event</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming" className="mt-4">
                      <div className="space-y-4">
                        {organizerData.events
                          .filter(event => event.status === "upcoming")
                          .map(event => (
                            <Card key={event.id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{event.title}</h3>
                                  <p className="text-sm text-muted-foreground">{event.date}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-500 hover:bg-green-600">
                                    {event.attendees} Attendees
                                  </Badge>
                                  <Link to={`/event/${event.id}`}>
                                    <Button size="sm" variant="outline">View</Button>
                                  </Link>
                                  <Link to={`/event-management/${event.id}`}>
                                    <Button size="sm">Manage</Button>
                                  </Link>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="past" className="mt-4">
                      <div className="space-y-4">
                        {organizerData.events
                          .filter(event => event.status === "completed")
                          .map(event => (
                            <Card key={event.id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{event.title}</h3>
                                  <p className="text-sm text-muted-foreground">{event.date}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {event.attendees} Attended
                                  </Badge>
                                  <Link to={`/event/${event.id}`}>
                                    <Button size="sm" variant="outline">View</Button>
                                  </Link>
                                  <Button size="sm" variant="outline">Report</Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === "vendors" && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Requests</CardTitle>
                  <CardDescription>Review and manage vendor participation requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizerData.vendorRequests.length > 0 ? (
                      organizerData.vendorRequests.map(request => (
                        <Card key={request.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{request.businessName}</h3>
                              <p className="text-sm text-muted-foreground">
                                For: {request.eventName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Requested on: {request.requestDate}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                                onClick={() => approveVendor(request.id, request.businessName)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => rejectVendor(request.id, request.businessName)}
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Store className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No Vendor Requests</h3>
                        <p className="text-muted-foreground">
                          When vendors request to participate in your events, they will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "attendees" && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendees Management</CardTitle>
                  <CardDescription>View and manage attendees for your events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Attendee Management</h3>
                    <p className="text-muted-foreground">
                      Select an event to view and manage its attendees.
                    </p>
                    <div className="mt-4">
                      <select 
                        className="flex h-10 w-full max-w-xs mx-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                      >
                        <option value="">Select an event...</option>
                        {organizerData.events.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.title} ({event.date})
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        className="mt-4" 
                        disabled={!selectedEventId}
                        onClick={handleViewAttendees}
                      >
                        View Attendees
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "analytics" && (
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Insights</CardTitle>
                  <CardDescription>View statistics and insights for your events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">
                      Select an event to view detailed analytics and insights.
                    </p>
                    <div className="mt-4">
                      <select 
                        className="flex h-10 w-full max-w-xs mx-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                      >
                        <option value="">Select an event...</option>
                        {organizerData.events.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.title} ({event.date})
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        className="mt-4" 
                        disabled={!selectedEventId}
                        onClick={handleViewAnalytics}
                      >
                        View Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && <OrganizerSettingsSection />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrganizerDashboard;
