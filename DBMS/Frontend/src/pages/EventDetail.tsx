import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PageTransition from '@/components/PageTransition';
import { Calendar, MapPin, Users, Clock, Heart, Share2, Star, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/utils/apiUtils';
import { toast } from '@/components/ui/use-toast';
import { getAuthToken } from '@/utils/authUtils';

interface EventData {
  event_id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
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

interface ReviewData {
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
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await apiRequest(`/api/event/${id}`) as EventData;
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive"
        });
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await apiRequest(`/api/userEngagement/getAllReviews/${id}`);
        // Ensure reviews is always an array
        setReviews(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) return;
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const favorites = await apiRequest('/api/userEngagement/getAllFavourites', {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (Array.isArray(favorites)) {
          const isFavorite = favorites.some(fav => String(fav.event_id) === String(id));
          setIsLiked(isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    fetchEventDetails();
    fetchReviews();
    checkFavoriteStatus();
  }, [id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      if (!isLiked) {
        const response = await apiRequest(`/api/userEngagement/addToFavourites/${id}`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response) {
          setIsLiked(true);
          toast({
            title: "Success",
            description: "Event added to favorites"
          });
        }
      } else {
        const response = await apiRequest(`/api/userEngagement/removeFromFavourites/${id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response) {
          setIsLiked(false);
          toast({
            title: "Success",
            description: "Event removed from favorites"
          });
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!userRating) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    if (!userReview.trim()) {
      toast({
        title: "Error",
        description: "Please write a review",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await apiRequest(`/api/userEngagement/addReview/${id}`, {
        method: 'POST',          
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: {
          rating: userRating,
          comment: userReview.trim()
      }
      });

      if (response) {
        // Refresh reviews
        const updatedReviews = await apiRequest(`/api/userEngagement/getAllReviews/${id}`);
        setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
        
        // Reset form
        setUserReview("");
        setUserRating(0);
        setHoveredRating(0);

        toast({
          title: "Success",
          description: "Review submitted successfully"
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBookTicket = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/confirm-payment?eventId=${id}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            {/* Loading skeleton */}
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!event) {
    return (
      <PageTransition>
        <div className="container mx-auto py-8">
          <p>Event not found</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="relative">
              <img 
                src={event.image || '/placeholder.svg'} 
                alt={event.title}
                className="w-full h-[400px] object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4 space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleLike}
                  className={`rounded-full ${isLiked ? 'bg-red-100' : ''}`}
                >
                  <Heart className={isLiked ? 'text-red-500 fill-red-500' : ''} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Share2 />
                </Button>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">{event.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">About this Event</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                  {isAuthenticated && (
                    <div className="mb-6 space-y-4">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`cursor-pointer ${
                              star <= (hoveredRating || userRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setUserRating(star)}
                          />
                        ))}
                      </div>
                      <Textarea
                        placeholder="Write your review..."
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                      />
                      <Button onClick={handleReviewSubmit}>
                        Submit Review
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.review_id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.userImage || '/placeholder.svg'}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">{review.userName}</h4>
                                <div className="flex">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                              <span className="text-sm text-gray-400 mt-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold">${event.ticket_price}</p>
                        <p className="text-sm text-gray-500">per ticket</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          min="1"
                          max={event.max_quantity}
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">
                          {event.max_quantity} tickets remaining
                        </span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleBookTicket}
                        disabled={event.max_quantity === 0}
                      >
                        {event.max_quantity === 0 ? 'Sold Out' : 'Book Tickets'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Organizer</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={event.profile_image || '/placeholder.svg'}
                        alt={event.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-gray-500">Event Organizer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default EventDetail;
