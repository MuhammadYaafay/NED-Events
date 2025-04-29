import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  MessageSquare, 
  CreditCard,
  ArrowRight,
  ChevronDown,
  Plus,
  Minus,
  Ticket,
  Globe,
  Store,
  Star
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';
import VendorRequestForm from '@/components/VendorRequestForm';

const eventData = {
  id: "2",
  title: "Annual Tech Conference 2025",
  description: "Join us for the largest tech conference in the city! Featuring keynote speakers, workshops, networking opportunities, and more. This three-day event will cover the latest trends in AI, web development, and digital transformation.",
  longDescription: "The Annual Tech Conference is back for its 10th year! This premier event brings together industry leaders, innovators, and tech enthusiasts for three days of learning, networking, and inspiration. From keynote presentations by renowned tech visionaries to hands-on workshops led by expert practitioners, this conference offers something for everyone in the tech community. Topics covered will include artificial intelligence, machine learning, web3, cloud computing, cybersecurity, and more. Don't miss this opportunity to stay ahead of the curve and connect with peers who share your passion for technology.",
  date: "June 15-17, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "Tech Innovation Center, 123 Silicon Avenue, San Francisco, CA",
  category: "Technology",
  price: "$299",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  organizer: {
    name: "TechEvents Inc.",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  },
  attendees: 842,
  maxAttendees: 1000,
  featured: true,
  agenda: [
    {
      day: "Day 1 - June 15, 2025",
      events: [
        { time: "9:00 AM - 10:00 AM", title: "Registration & Breakfast", location: "Main Hall" },
        { time: "10:00 AM - 11:30 AM", title: "Keynote: The Future of AI", speaker: "Dr. Sarah Chen", location: "Auditorium A" },
        { time: "11:45 AM - 12:45 PM", title: "Panel: Ethical Considerations in Technology", location: "Auditorium B" },
        { time: "1:00 PM - 2:00 PM", title: "Lunch Break", location: "Dining Area" },
        { time: "2:15 PM - 3:45 PM", title: "Workshop: Building with React 19", speaker: "James Wilson", location: "Workshop Room 1" },
        { time: "4:00 PM - 5:30 PM", title: "The State of Web Development in 2025", speaker: "Maria Rodriguez", location: "Auditorium A" },
        { time: "6:00 PM - 8:00 PM", title: "Networking Reception", location: "Rooftop Garden" }
      ]
    },
    {
      day: "Day 2 - June 16, 2025",
      events: [
        { time: "9:00 AM - 9:45 AM", title: "Breakfast", location: "Main Hall" },
        { time: "10:00 AM - 11:30 AM", title: "Keynote: Quantum Computing", speaker: "Dr. Michael Lee", location: "Auditorium A" },
        { time: "11:45 AM - 12:45 PM", title: "Workshop: Cloud Architecture Patterns", speaker: "Alex Johnson", location: "Workshop Room 2" },
        { time: "1:00 PM - 2:00 PM", title: "Lunch Break", location: "Dining Area" },
        { time: "2:15 PM - 3:45 PM", title: "Panel: Security in the Digital Age", location: "Auditorium B" },
        { time: "4:00 PM - 5:30 PM", title: "Workshop: Machine Learning Basics", speaker: "Dr. Emily Parker", location: "Workshop Room 1" },
        { time: "6:00 PM - 9:00 PM", title: "Conference Dinner", location: "Grand Ballroom" }
      ]
    },
    {
      day: "Day 3 - June 17, 2025",
      events: [
        { time: "9:00 AM - 9:45 AM", title: "Breakfast", location: "Main Hall" },
        { time: "10:00 AM - 11:30 AM", title: "Keynote: The Metaverse and Beyond", speaker: "Thomas Wright", location: "Auditorium A" },
        { time: "11:45 AM - 12:45 PM", title: "Workshop: Blockchain Development", speaker: "Sophia Kim", location: "Workshop Room 3" },
        { time: "1:00 PM - 2:00 PM", title: "Lunch Break", location: "Dining Area" },
        { time: "2:15 PM - 3:45 PM", title: "Panel: The Future of Work", location: "Auditorium B" },
        { time: "4:00 PM - 5:00 PM", title: "Closing Remarks & Raffle", speaker: "Conference Committee", location: "Main Hall" }
      ]
    }
  ],
  speakers: [
    {
      name: "Dr. Sarah Chen",
      role: "AI Research Director, TechFuture Inc.",
      bio: "Dr. Chen is a world-renowned AI researcher with over 15 years of experience in machine learning and neural networks.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "James Wilson",
      role: "Senior Frontend Engineer, ReactMasters",
      bio: "James is a frontend expert who has contributed to the React core team and authored several popular JavaScript libraries.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Dr. Michael Lee",
      role: "Quantum Computing Scientist, QuantumLeap",
      bio: "Dr. Lee has pioneered several breakthroughs in quantum computing and holds multiple patents in the field.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Maria Rodriguez",
      role: "CTO, WebInnovate",
      bio: "Maria has led technology teams at several Fortune 500 companies and specializes in scalable web architecture.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    }
  ],
  faqs: [
    {
      question: "What is included in the ticket price?",
      answer: "Your ticket includes access to all keynote presentations, workshops, panel discussions, networking events, and meals (breakfast, lunch, and refreshments) for all three days of the conference."
    },
    {
      question: "Is there a dress code?",
      answer: "Business casual attire is recommended for all conference sessions. For the evening networking events and conference dinner, smart casual is appropriate."
    },
    {
      question: "Will presentations be recorded?",
      answer: "Yes, all keynote presentations and panel discussions will be recorded and made available to attendees after the conference through our online portal."
    },
    {
      question: "Is there parking available at the venue?",
      answer: "The Tech Innovation Center has a parking garage with limited space available for conference attendees at a discounted rate of $15 per day. We recommend using public transportation or ridesharing services when possible."
    },
    {
      question: "Can I get a refund if I can't attend?",
      answer: "Refunds are available up to 30 days before the event with a 15% processing fee. Within 30 days of the event, you can transfer your ticket to another person or receive credit for next year's conference."
    }
  ],
  reviews: [
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      },
      rating: 5,
      comment: "Amazing conference! The speakers were world-class and I learned so much.",
      date: "2 days ago"
    },
    {
      id: "2",
      user: {
        name: "Sarah Miller",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      },
      rating: 4,
      comment: "Great event, well organized. Would definitely attend again next year.",
      date: "1 week ago"
    },
    {
      id: "3",
      user: {
        name: "David Chen",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      },
      rating: 5,
      comment: "The networking opportunities alone were worth the price of admission. I made some valuable connections that will help my business grow.",
      date: "2 weeks ago"
    }
  ]
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [stallDialogOpen, setStallDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const event = eventData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked 
        ? "This event has been removed from your favorites." 
        : "This event has been added to your favorites.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to your clipboard.",
    });
  };

  const handleReserveTickets = () => {
    const totalPrice = parseFloat(event.price.replace('$', '')) * quantity;
    navigate('/confirm-payment', {
      state: {
        eventDetails: {
          title: event.title,
          price: event.price,
          quantity: quantity,
          totalPrice: totalPrice
        }
      }
    });
  };

  const handleStallRequestClose = () => {
    setStallDialogOpen(false);
    toast({
      title: "Stall request submitted",
      description: "Your request has been sent to the event organizer.",
    });
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting your review.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your feedback!",
    });
    
    setUserReview("");
    setUserRating(0);
  };

  const totalPrice = parseFloat(event.price.replace('$', '')) * quantity;
  
  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
        <button 
          onClick={() => navigate('/events')} 
          className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
          Back to Events
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-xl overflow-hidden aspect-video w-full">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary hover:bg-primary">{event.price}</Badge>
                {event.featured && (
                  <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-primary text-primary">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {event.category}
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={isLiked ? "text-red-500 hover:text-red-600" : ""}
                    onClick={handleToggleLike}
                  >
                    <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span className="truncate">{event.location}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <span>{event.attendees} of {event.maxAttendees} attending</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-8">
                <Avatar>
                  <AvatarImage src={event.organizer.image} alt={event.organizer.name} />
                  <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Organized by</p>
                  <p className="font-medium">{event.organizer.name}</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="details" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="details">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {event.longDescription}
                    </p>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-primary" />
                          <span>Language: English</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          <span>Capacity: {event.maxAttendees} attendees</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Event Location</h3>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>What attendees are saying about this event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAuthenticated && (
                      <div className="mb-6 border-b pb-6">
                        <h3 className="text-lg font-medium mb-3">Write a Review</h3>
                        <div className="flex mb-3">
                          {[1, 2, 3, 4, 5, 6].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="p-1"
                              onClick={() => setUserRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                            >
                              <Star
                                className="h-6 w-6"
                                fill={(hoveredRating || userRating) >= star ? "gold" : "none"}
                                color={(hoveredRating || userRating) >= star ? "gold" : "currentColor"}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm self-center text-muted-foreground">
                            {userRating > 0 ? `${userRating} star${userRating !== 1 ? 's' : ''}` : "Select rating"}
                          </span>
                        </div>
                        <Textarea
                          placeholder="Share your experience at this event..."
                          className="mb-3"
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                        />
                        <Button onClick={handleSubmitReview}>Submit Review</Button>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {event.reviews.map((review) => (
                        <div key={review.id} className="pb-4 border-b last:border-0">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={review.user.image} alt={review.user.name} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.user.name}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4"
                                fill={i < review.rating ? "gold" : "none"}
                                color={i < review.rating ? "gold" : "gray"}
                              />
                            ))}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Get Tickets</CardTitle>
                <CardDescription>Secure your spot at this event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Ticket className="h-5 w-5 mr-2 text-primary" />
                    <span>Standard Ticket</span>
                  </div>
                  <span className="font-semibold">{event.price}</span>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Quantity</p>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-r-none"
                      onClick={handleDecrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">{quantity}</div>
                    <Button
                      variant="ghost"
                      size="icon" 
                      className="rounded-l-none"
                      onClick={handleIncrementQuantity}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Price ({quantity} ticket{quantity > 1 ? 's' : ''})</span>
                    <span>${(parseFloat(event.price.replace('$', '')) * quantity).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" size="lg" onClick={handleReserveTickets}>
                  Reserve Tickets
                </Button>
                
                {isAuthenticated && user?.role === 'vendor' && (
                  <Dialog open={stallDialogOpen} onOpenChange={setStallDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="lg">
                        <Store className="mr-2 h-4 w-4" />
                        Book Stall
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <VendorRequestForm 
                        eventId={event.id} 
                        eventName={event.title} 
                        onClose={handleStallRequestClose} 
                      />
                    </DialogContent>
                  </Dialog>
                )}
                
                <p className="text-xs text-center text-muted-foreground">
                  Only {event.maxAttendees - event.attendees} spots remaining
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EventDetail;
