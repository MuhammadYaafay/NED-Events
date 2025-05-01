
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Star
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import PageTransition from '@/components/PageTransition';

// Mock data for event history
const mockEventHistory = [
  {
    id: "ev1",
    eventName: "Tech Conference 2023",
    date: "2023-10-15",
    ticketType: "VIP",
    status: "Attended"
  },
  {
    id: "ev2",
    eventName: "Music Festival",
    date: "2023-08-22",
    ticketType: "General",
    status: "Attended"
  },
  {
    id: "ev3",
    eventName: "Design Workshop",
    date: "2023-12-05",
    ticketType: "Workshop",
    status: "Upcoming"
  }
];

// Mock data for favorite events
const mockFavoriteEvents = [
  {
    id: "fav1",
    name: "AI Conference 2024",
    date: "2024-05-10",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    location: "San Francisco, CA",
    price: "$199.99"
  },
  {
    id: "fav2",
    name: "Outdoor Music Festival",
    date: "2024-06-22",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    location: "Austin, TX",
    price: "$89.99"
  },
  {
    id: "fav3",
    name: "UX Design Workshop",
    date: "2024-07-15",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    location: "Seattle, WA",
    price: "$149.99"
  }
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    bio: 'Passionate event enthusiast and tech innovator.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // In a real app, you would save the profile data to a database
    setIsEditing(false);
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-12 px-4 md:px-0"> {/* Increased top padding to fix navbar overlap */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Badge variant="secondary">{user?.role.toUpperCase()}</Badge>
        </div>

        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Events</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and edit your personal details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{profileData.name}</h2>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
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
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      type="text" 
                      id="location" 
                      name="location"
                      value={profileData.location}
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
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
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
                  <CardDescription>View all the events you've attended or registered for</CardDescription>
                </div>
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Your recent event attendance and bookings</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEventHistory.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.eventName}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.ticketType}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === "Upcoming" ? "outline" : "default"}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/event/${event.id}`)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/receipt/${event.id}`)}>
                              <Ticket className="h-4 w-4 mr-2" />
                              Receipt
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Favorite Events</CardTitle>
                  <CardDescription>Events you've bookmarked for future reference</CardDescription>
                </div>
                <Heart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockFavoriteEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge>{event.price}</Badge>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/event/${event.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <input type="checkbox" id="email-notif" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notif">SMS Notifications</Label>
                        <input type="checkbox" id="sms-notif" className="toggle" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Privacy</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="profile-public">Public Profile</Label>
                        <input type="checkbox" id="profile-public" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="share-history">Share Event History</Label>
                        <input type="checkbox" id="share-history" className="toggle" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Security</h3>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Profile;
