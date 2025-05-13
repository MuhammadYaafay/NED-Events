import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Calendar as CalendarIcon,
  Search,
  X,
  Filter,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EventCard from "@/components/EventCard";
import PageTransition from "@/components/PageTransition";
import { apiRequest } from "@/utils/apiUtils";

interface eventsData {
  event_id: string;
  title: string;
  category: string;
  start_date: string;
  event_time: string;
  location: string;
  booking_count: number;
  image: string;
  ticket_price: string;
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "music", label: "Music" },
  { value: "food & drink", label: "Food & Drink" },
  { value: "workshop", label: "Workshop" },
  { value: "networking", label: "Networking" },
  { value: "health", label: "Health" },
  { value: "arts", label: "Arts" },
  { value: "Free", label: "Free" },
];

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<eventsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcoming = (await apiRequest("/api/event/")) as eventsData[];
        setUpcomingEvents(upcoming);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredEvents = upcomingEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    const eventPrice =
      event.ticket_price === "Free"
        ? 0
        : parseInt(event.ticket_price.replace("$", ""));
    const matchesPrice =
      eventPrice >= priceRange[0] && eventPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
              <p className="text-gray-400">
                Find your next experience from {upcomingEvents.length} upcoming
                events
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={toggleFilters}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
             {
              (localStorage.getItem("role")=="organizer") ?  (<Link to="/create-event">
                
                <Button>Host an Event</Button>
                </Link> ):(
                ""
              )
              }
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-gray-800 h-12"
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              showFilters ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-card border-gray-800">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    className="mt-4"
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([0, 500]);
                  }}
                >
                  Reset
                </Button>
                <Button onClick={toggleFilters}>Apply Filters</Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "result" : "results"} found
            </p>
            {/* <Select defaultValue="newest">
              <SelectTrigger className="w-[180px] bg-card/50 border-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value=   "popular">Most Popular</SelectItem>
              </SelectContent>
            </Select> */}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.event_id} {...event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card/20 rounded-xl border border-gray-800">
              <div className="mb-4">
                <Search className="h-12 w-12 text-gray-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any events matching your current filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange([0, 500]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-gray-800"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" className="px-4 h-9">
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4 h-9 border-gray-800"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4 h-9 border-gray-800"
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Events;
