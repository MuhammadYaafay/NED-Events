import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Ticket,
  Clock,
  FileText,
  CalendarDays,
  History,
  Heart,
  Star,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTransition from "@/components/PageTransition";
import { apiRequest } from "@/utils/apiUtils";
import { getAuthToken } from "@/utils/authUtils";

interface eventHistory {
  event_id: string;
  title: string;
  start_date: string;
  purchase_status: string;
}

interface favoriteEvent {
  event_id: string;
  title: string;
  start_date: string;
  image: string;
  location: string;
  ticket_price: string;
}

interface profileData {
  name: string;
  email: string;
  bio: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [eventHistory, setEventHistory] = useState<eventHistory[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<favoriteEvent[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<profileData | null>(null);
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventsHistory = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const history = await apiRequest<eventHistory[]>(
          "/api/event/eventHistory",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        
        if (Array.isArray(history)) {
          setEventHistory(history);
        } else {
          console.error("Event history response is not an array:", history);
          setEventHistory([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching events:", error);
        setApiErrors(prev => [...prev, `Event history: ${message}`]);
        setEventHistory([]);
      }
    };

    if (isAuthenticated()) {
      fetchEventsHistory();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const favorites = await apiRequest<favoriteEvent[]>(
          "/api/userEngagement/getAllFavourites",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        
        if (Array.isArray(favorites)) {
          setFavoriteEvents(favorites);
        } else {
          console.error("Favorites response is not an array:", favorites);
          setFavoriteEvents([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching favorites:", error);
        setApiErrors(prev => [...prev, `Favorites: ${message}`]);
        setFavoriteEvents([]);
      }
    };

    if (isAuthenticated()) {
      fetchFavoriteEvents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const profile = await apiRequest<profileData>(
          "/api/auth/profile",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        
        setProfileData(profile);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching profile data:", error);
        setApiErrors(prev => [...prev, `Profile data: ${message}`]);
        
        if (user) {
          setProfileData({
            name: user.name || "",
            email: user.email || "",
            bio: ""
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token || !profileData) {
        console.error("No authentication token or profile data found");
        return;
      }

      await apiRequest(
        "/api/auth/profile",
        {
          method: "PUT", 
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: profileData
        }
      );
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading || !profileData) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-0">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-12 px-4 md:px-0">
        {apiErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
            <h3 className="font-medium">API Errors:</h3>
            <ul className="list-disc pl-5">
              {apiErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {user?.role && (
            <Badge variant="secondary">{user.role.toUpperCase()}</Badge>
          )}
        </div>
        <Tabs
          defaultValue="profile"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Events</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View and edit your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.image_url} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {profileData?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {profileData?.email}
                    </p>
                  </div>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                {isEditing ? (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                ) : (
                  <Button onClick={handleEditProfile}>Edit Profile</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Event History</CardTitle>
                  <CardDescription>
                    View all the events you've attended or registered for
                  </CardDescription>
                </div>
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {eventHistory.length > 0 ? (
                  <Table>
                    <TableCaption>
                      Your recent event attendance and bookings
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventHistory.map((event) => (
                        <TableRow key={event.event_id}>
                          <TableCell className="font-medium">
                            {event.title}
                          </TableCell>
                          <TableCell>
                            {new Date(event.start_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                event.purchase_status === "Upcoming"
                                  ? "outline"
                                  : "default"
                              }
                            >
                              {event.purchase_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(`/event/${event.event_id}`)
                                }
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(`/receipt/${event.event_id}`)
                                }
                              >
                                <Ticket className="h-4 w-4 mr-2" />
                                Receipt
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    You haven't attended any events yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Favorite Events</CardTitle>
                  <CardDescription>
                    Events you've bookmarked for future reference
                  </CardDescription>
                </div>
                <Heart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {favoriteEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteEvents.map((event) => (
                      <Card key={event.event_id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-muted-foreground text-sm mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{event.start_date}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge>{event.ticket_price}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/event/${event.event_id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    You haven't favorited any events yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Profile;