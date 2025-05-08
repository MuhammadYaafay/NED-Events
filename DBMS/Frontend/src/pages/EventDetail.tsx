import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import VendorRequestForm from "@/components/VendorRequestForm";
import { apiRequest } from "@/utils/apiUtils";

interface eventData {
  event_id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  event_time: string;
  location: string;
  booking_count: number;
  max_quantity: number;
  image: string;
  ticket_price: string;
  organizer_id: string;
  name: string;
  profile_image: string;
  featured?: boolean;
}

interface reviewsData {
  review_id: string;
  user_id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  created_at: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<eventData | null>(null);
  const [reviews, setReviews] = useState<reviewsData[]>([]);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [stallDialogOpen, setStallDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Initialize from localStorage first for immediate UI feedback
    const favorites = JSON.parse(localStorage.getItem('favorites'))|| {};
    setIsLiked(favorites[id] || false);
  
    // Then sync with server if authenticated
    if (isAuthenticated) {
      const syncWithServer = async () => {
        try {
          const favorites = await apiRequest('/api/userEngagement/getAllFavourites', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('NEDevents-token')}`,
            }
          });
  
          if (Array.isArray(favorites)) {
            const serverValue = favorites.some(fav => fav.event_id === id);
            
            // Only update if different from current state
            if (serverValue !== isLiked) {
              setIsLiked(serverValue);
              // Update localStorage to match server
              const updatedFavorites = {...favorites, [id]: serverValue};
              localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            }
          }
        } catch (error) {
          console.error("Failed to sync favorites:", error);
          // Maintain current state if sync fails
        }
      };
  
      syncWithServer();
    }
  }, [id, isAuthenticated]); // Only re-run when these values change

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = (await apiRequest(`/api/event/${id}`)) as eventData;
        setEvent(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiRequest<{ reviews: reviewsData[] }>(
          `/api/userEngagement/getAllReviews/${id}`
        );
        setReviews(Array.isArray(response?.reviews) ? response.reviews : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

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

  const handleb = async () => {
    const newValue = !isLiked;
    
    try {
      const endpoint = newValue
        ? `/api/userEngagement/addToFavourites/${id}`
        : `/api/userEngagement/removeFromFavourites/${id}`;
  
      const response = await apiRequest(endpoint, {
        method: newValue ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('NEDevents-token')}`
        }
      });
  
      if (response?.message) {
        // Update both state and localStorage
        setIsLiked(newValue);
        const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        favorites[id] = newValue;
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        toast({
          title: newValue ? "Added to favorites" : "Removed from favorites",
          description: newValue
            ? "This event has been added to your favorites."
            : "This event has been removed from your favorites.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites. Please try again.",
      });
    }
  };

  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to your clipboard.",
    });
  };

  const handleReserveTickets = () => {
    if (!event) return;

    if (event.booking_count >= event.max_quantity) {
      toast({
        title: "Tickets sold out",
        description: "No tickets available for this event.",
        variant: "destructive",
      });
      return;
    }

    if (event.booking_count + quantity > event.max_quantity) {
      toast({
        title: "Quantity exceeds available tickets",
        description: `Only ${
          event.max_quantity - event.booking_count
        } tickets available.`,
        variant: "destructive",
      });
      return;
    }

    if (quantity < 1) {
      toast({
        title: "Invalid quantity",
        description: "Please select at least one ticket.",
        variant: "destructive",
      });
      return;
    }

    const purchaseTickets = async () => {
      try {
        const response = await apiRequest(
          `/api/userEngagement/purchaseTickets/${id}`,
          {
            method: "POST",
            body: JSON.stringify({
              user_id: user?.user_id,
              event_id: id,
              quantity: quantity,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response) {
          toast({
            title: "Tickets reserved",
            description: "Your tickets have been reserved successfully.",
          });

          const totalPrice =
            parseFloat(event.ticket_price.replace("$", "")) * quantity;

          navigate("/confirm-payment", {
            state: {
              eventDetails: {
                title: event.title,
                price: event.ticket_price,
                quantity: quantity,
                totalPrice: totalPrice,
              },
            },
          });
        }
      } catch (error) {
        console.error("Error reserving tickets:", error);
        toast({
          title: "Error reserving tickets",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    purchaseTickets();
  };

  const handleStallRequestClose = async () => {
    try {
      const response = await apiRequest(
        `/api/userEngagement/requestStall/${id}`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user?.user_id,
            event_id: id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response) {
        toast({
          title: "Stall request sent",
          description: "Your request has been sent to the event organizer.",
        });
      }
    } catch (error) {
      console.error("Error requesting stall:", error);
      toast({
        title: "Error sending request",
        description: "Please try again later.",
        variant: "destructive",
      });
      return; // Exit early if there's an error
    }

    // Cleanup - only reached if request was successful
    setUserReview("");
    setUserRating(0);
    setHoveredRating(0);
    setQuantity(1);
    setIsShareMenuOpen(false);
    setStallDialogOpen(false);
  };

  const handleSubmitReview = async () => {
    // Validate rating
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description:
          "Please select a star rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest(`/api/userEngagement/addReview/${id}`, {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.user_id,
          event_id: id,
          rating: userRating,
          comment: userReview,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        toast({
          title: "Review submitted",
          description: "Thank you for sharing your feedback!",
        });

        // Reset form
        setUserReview("");
        setUserRating(0);
        setHoveredRating(0); // Also reset hover state if you're using it
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <p className="text-muted-foreground mt-2">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" onClick={() => navigate("/events")}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }
  console.log(reviews);
  const totalPrice = event
    ? parseFloat(event.ticket_price.replace("$", "")) * quantity
    : 0;

  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
        <button
          onClick={() => navigate("/events")}
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
                <Badge className="bg-primary hover:bg-primary">
                  {event.ticket_price}
                </Badge>
                {event.featured && (
                  <Badge
                    variant="outline"
                    className="bg-black/50 backdrop-blur-sm border-primary text-primary"
                  >
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
                    onClick={handleb}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isLiked ? "currentColor" : "none"}
                    />
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
                  <span>{event.start_date}</span>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{event.event_time}</span>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <span>
                    {event.booking_count} of {event.max_quantity} attending
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-8">
                <Avatar>
                  <AvatarImage src={event.profile_image} alt={event.name} />
                  <AvatarFallback>{event.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Organized by</p>
                  <p className="font-medium">{event.name}</p>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="details"
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                      {event.description}
                    </p>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">
                        Event Details
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-primary" />
                          <span>Language: English</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          <span>Capacity: {event.max_quantity} attendees</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">
                        Event Location
                      </h3>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>
                      What attendees are saying about this event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAuthenticated && (
                      <div className="mb-6 border-b pb-6">
                        <h3 className="text-lg font-medium mb-3">
                          Write a Review
                        </h3>
                        <div className="flex mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
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
                                fill={
                                  (hoveredRating || userRating) >= star
                                    ? "gold"
                                    : "none"
                                }
                                color={
                                  (hoveredRating || userRating) >= star
                                    ? "gold"
                                    : "currentColor"
                                }
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm self-center text-muted-foreground">
                            {userRating > 0
                              ? `${userRating} star${
                                  userRating !== 1 ? "s" : ""
                                }`
                              : "Select rating"}
                          </span>
                        </div>
                        <Textarea
                          placeholder="Share your experience at this event..."
                          className="mb-3"
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                        />
                        <Button onClick={handleSubmitReview}>
                          Submit Review
                        </Button>
                      </div>
                    )}

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.review_id}
                          className="pb-4 border-b last:border-0"
                        >
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={review.userImage}
                                alt={review.userName}
                              />
                              <AvatarFallback>
                                {review.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {review.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {review.created_at}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
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
                <CardDescription>
                  Secure your spot at this event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Ticket className="h-5 w-5 mr-2 text-primary" />
                    <span>Standard Ticket</span>
                  </div>
                  <span className="font-semibold">{event.ticket_price}</span>
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
                    <span>
                      Price ({quantity} ticket{quantity > 1 ? "s" : ""})
                    </span>
                    <span>
                      $
                      {(
                        parseFloat(event.ticket_price.replace("$", "")) *
                        quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleReserveTickets}
                >
                  Reserve Tickets
                </Button>

                {isAuthenticated && user?.role === "vendor" && (
                  <Dialog
                    open={stallDialogOpen}
                    onOpenChange={setStallDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="lg">
                        <Store className="mr-2 h-4 w-4" />
                        Book Stall
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <VendorRequestForm
                        eventId={event.event_id}
                        eventName={event.title}
                        onClose={handleStallRequestClose}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Only {event.max_quantity - event.booking_count} spots
                  remaining
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
