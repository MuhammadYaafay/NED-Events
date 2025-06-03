import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/EventCard";
import PageTransition from "@/components/PageTransition";
import { apiRequest } from "@/utils/apiUtils";
import Login from "./Login";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/components/ui/toast";

interface featuredEvents {
  event_id: string;
  title: string;
  start_date: string;
  event_time: string;
  category: string;
  location: string;
  booking_count: number;
  image: string;
  ticket_price: string;
  featured?: boolean;
}

interface upcomingEvents {
  event_id: string;
  title: string;
  start_date: string;
  event_time: string;
  category: string;
  location: string;
  booking_count: number;
  image: string;
  ticket_price: string;
}
const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<upcomingEvents[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<featuredEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { toast } = useToast();

  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        
      
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        }
        const upcoming = (await apiRequest("/api/event/")) as upcomingEvents[];
        setUpcomingEvents(upcoming);
        const featured = (await apiRequest(
          "/api/event/trending"
        )) as featuredEvents[];
        setFeaturedEvents(featured);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    
    
    const timer = setTimeout(() => {
      toast({
        title: "Server Rendering",
        description: `Wait a minute Server is loading ⌛`,
        
      });
      setHeroLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    
    <PageTransition>
      <div className="min-h-screen">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Event"
              className={`w-full h-full object-cover transition-all duration-1000 ${
                heroLoaded ? "scale-100 blur-0" : "scale-110 blur-md"
              }`}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <div
                className={`transform transition-all duration-700 ${
                  heroLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-gradient">Unforgettable</span> Events
                  Start Here
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  Discover, create, and experience extraordinary moments with
                  our premium event platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/events">
                    <Button
                      size="lg"
                      className="btn-hover-effect min-w-[180px]"
                    >
                      Find Events
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    {isLoggedIn &&
                    localStorage.getItem("role") === "organizer" ? (
                      <Link to="/create-event">
                        <Button
                          size="lg"
                          variant="outline"
                          className="min-w-[180px]"
                        >
                          Host an Event
                        </Button>
                      </Link>
                    ) : localStorage.length === 0 ? (
                      <Link to="/login">
                        <Button
                          size="lg"
                          variant="outline"
                          className="min-w-[180px] pl-3"
                        >
                          Host an Event
                        </Button>
                      </Link>
                    ) : null}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce z-20">
            <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white/60 transform rotate-90" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-background to-black/90">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <div className="inline-block mb-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-xs font-semibold text-primary border-primary uppercase"
                  >
                    Featured
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-2">Trending Events</h2>
                <p className="text-gray-400 max-w-2xl">
                  Discover the most anticipated events that are capturing
                  everyone's attention.
                </p>
              </div>
              <Link
                to="/events"
                className="mt-4 md:mt-0 group flex items-center text-primary"
              >
                <span className="mr-1">View all events</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.event_id} {...event} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-black/90 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <div className="inline-block mb-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-xs font-semibold text-primary border-primary uppercase"
                  >
                    Calendar
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
                <p className="text-gray-400 max-w-2xl">
                  The latest events happening in your area and beyond. Don't
                  miss out!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.event_id} {...event} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/events">
                <Button className="btn-hover-effect">
                  Explore All Events
                  <Calendar className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-black to-primary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Host Your Own Event?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Turn your vision into reality with our powerful event management
                platform. Get started in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {
                  (localStorage.role == 'organizer')?(

                    
                    <Link to="/create-event">
                  <Button size="lg" className="btn-hover-effect min-w-[200px]">
                    Create Event
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                  ):" "
                }
                <Link to="/events">
                  <Button size="lg" variant="outline" className="min-w-[200px]">
                    Explore First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
