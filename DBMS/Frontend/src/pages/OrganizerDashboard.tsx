import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Store,
  Users,
  BarChart,
  MessageCircle,
  Settings,
  UserCog,
  LogOut,
  Check,
  X,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { toast } from "@/components/ui/use-toast";
import OrganizerSettingsSection from "@/components/organizer/OrganizerSettingsSection";
import { getAuthToken, isAuthenticated } from "@/utils/authUtils";
import { apiRequest } from "@/utils/apiUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface StallBookingResponse {
  message: string;
  requests: VendorRequests[];
}

interface OrganizerData {
  name: string;
  email: string;
  image_url?: string;
  events: OrganizerEvents[];
  vendorRequests: VendorRequests[];
}

interface OrganizerEvents {
  event_id: string;
  title: string;
  start_date: string;
  status: string;
  total_attendees: number;
}

interface VendorRequests {
  booking_id: string;
  vendor_name: string;
  event_name: string;
  event_id: string;
  status: string;
  booking_date: string;
}

const OrganizerDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [organizerData, setOrganizerData] = useState<OrganizerData>({
    name: "",
    email: "",
    image_url: "",
    events: [],
    vendorRequests: []
  });

  // Fetch profile data
  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const profile = await apiRequest<OrganizerData>("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setOrganizerData(prev => ({
            ...prev,
            name: profile.name,
            email: profile.email,
            image_url: profile.image_url
          }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching profile data:", error);
        if (isMounted) {
          setApiErrors(prev => [...prev, `Profile data: ${message}`]);
        }
      }
    };

    if (isAuthenticated()) {
      fetchProfileData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Fetch organizer events
  useEffect(() => {
    let isMounted = true;
    const fetchOrganizerEvents = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const events = await apiRequest<OrganizerEvents[]>(
          "/api/event/getByOrganizer",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted && Array.isArray(events)) {
          setOrganizerData(prev => ({
            ...prev,
            events: events
          }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching events:", error);
        if (isMounted) {
          setApiErrors(prev => [...prev, `Event history: ${message}`]);
        }
      }
    };

    if (isAuthenticated()) {
      fetchOrganizerEvents();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Fetch vendor requests
  useEffect(() => {
    let isMounted = true;
    const fetchVendorRequests = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await apiRequest<StallBookingResponse>(
          "/api/stall/getStallBookingRequests",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted && response && Array.isArray(response.requests)) {
          setOrganizerData(prev => ({
            ...prev,
            vendorRequests: response.requests
          }));
        }
      } catch (error) {
        // Don't treat 404 as an error, just set empty requests
        if (error instanceof Error && error.message === "No pending requests found") {
          if (isMounted) {
            setOrganizerData(prev => ({
              ...prev,
              vendorRequests: []
            }));
          }
          return;
        }

        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching vendor requests:", error);
        if (isMounted) {
          setApiErrors(prev => [...prev, `Vendor requests: ${message}`]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated()) {
      fetchVendorRequests();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const navigate = useNavigate();

  const approveVendor = async (id: string, businessName: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await apiRequest(`/api/stall/confirmStalls/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Update local state to remove approved request
      setOrganizerData(prev => ({
        ...prev!,
        vendorRequests: prev!.vendorRequests.filter(req => req.booking_id !== id)
      }));

      toast({
        title: "Vendor Approved",
        description: `${businessName} has been approved for the event.`,
      });
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: "Failed to approve vendor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const rejectVendor = async (id: string, businessName: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await apiRequest(`/api/stall/cancelStalls/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Update local state to remove rejected request
      setOrganizerData(prev => {
        if (!prev || !prev.vendorRequests) return prev;
      
        return {
          ...prev,
          vendorRequests: prev.vendorRequests.filter(req => req.booking_id !== id)
        };
      });

      toast({
        title: "Vendor Rejected",
        description: `${businessName}'s request has been rejected.`,
      });
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to reject vendor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await apiRequest("/api/auth/logout", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    }
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

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24 mt-2" />
                    </div>
                  </div>
                  <Separator />
                  <nav className="space-y-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24 mt-2" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!organizerData) {
    return null;
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Organizer Dashboard</CardTitle>
                <CardDescription>
                  Manage your events and vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={organizerData?.image_url}
                      alt={organizerData.name}
                    />
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {organizerData.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {organizerData.email}
                    </p>
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
                    <Badge className="ml-auto">
                      {
                        organizerData?.vendorRequests?.filter(
                          (r) => r.status === "pending"
                        ).length
                      }
                    </Badge>
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
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
                    <CardDescription>
                      Manage your upcoming and past events
                    </CardDescription>
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
                        {organizerData?.events
                          ?.filter((event) => event.status === "upcoming")
                          .map((event) => (
                            <Card key={event.event_id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{event.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {event.start_date}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-500 hover:bg-green-600">
                                    {event.total_attendees} Attendees
                                  </Badge>
                                  <Link to={`/event/${event.event_id}`}>
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                  </Link>
                                  <Link to={`/event-management/${event.event_id}`}>
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
                        {organizerData?.events
                          ?.filter((event) => event.status === "completed")
                          .map((event) => (
                            <Card key={event.event_id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{event.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {event.start_date}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">
                                    {event.total_attendees} Attended
                                  </Badge>
                                  <Link to={`/event/${event.event_id}`}>
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                  </Link>
                                  <Button size="sm" variant="outline">
                                    Report
                                  </Button>
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
                  <CardDescription>
                    Review and manage vendor participation requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizerData.vendorRequests.length > 0 ? (
                      organizerData.vendorRequests.map((request) => (
                        <Card key={request.booking_id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">
                                {request.vendor_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                For: {request.event_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Requested on: {request.booking_date}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                                onClick={() =>
                                  approveVendor(
                                    request.booking_id,
                                    request.vendor_name
                                  )
                                }
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() =>
                                  rejectVendor(request.booking_id, request.vendor_name)
                                }
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
                        <h3 className="mt-4 text-lg font-medium">
                          No Vendor Requests
                        </h3>
                        <p className="text-muted-foreground"></p>
                        <p>
                          When vendors request to participate in your events,
                          they will appear here.
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
                  <CardDescription>
                    View and manage attendees for your events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">
                      Attendee Management
                    </h3>
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
                        {organizerData.events.map((event) => (
                          <option key={event.event_id} value={event.event_id}>
                            {event.title} ({event.start_date})
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
                  <CardDescription>
                    View statistics and insights for your events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">
                      Analytics Dashboard
                    </h3>
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
                        {organizerData.events.map((event) => (
                          <option key={event.event_id} value={event.event_id}>
                            {event.title} ({event.start_date})
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
