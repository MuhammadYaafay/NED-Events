import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarIcon, Search, X, Filter, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import EventCard from '@/components/EventCard';
import PageTransition from '@/components/PageTransition';

const eventsData = [
  {
    id: '1',
    title: 'Tech Conference 2023: Future of AI',
    date: 'June 15, 2023',
    time: '9:00 AM - 6:00 PM',
    location: 'San Francisco, CA',
    category: 'Technology',
    attendees: 1200,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$299',
    featured: true
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    date: 'July 22-24, 2023',
    time: 'All Day',
    location: 'Austin, TX',
    category: 'Music',
    attendees: 5000,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$150',
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    date: 'August 10, 2023',
    time: '12:00 PM - 10:00 PM',
    location: 'New York, NY',
    category: 'Food & Drink',
    attendees: 3500,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$75',
  },
  {
    id: '4',
    title: 'Photography Workshop',
    date: 'June 8, 2023',
    time: '1:00 PM - 5:00 PM',
    location: 'Chicago, IL',
    category: 'Workshop',
    attendees: 45,
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$120',
  },
  {
    id: '5',
    title: 'Business Networking Mixer',
    date: 'June 12, 2023',
    time: '6:30 PM - 9:00 PM',
    location: 'Boston, MA',
    category: 'Networking',
    attendees: 150,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$30',
  },
  {
    id: '6',
    title: 'Yoga in the Park',
    date: 'June 17, 2023',
    time: '8:00 AM - 9:30 AM',
    location: 'Los Angeles, CA',
    category: 'Health',
    attendees: 75,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 'Free',
  },
  {
    id: '7',
    title: 'Artificial Intelligence Summit',
    date: 'June 20, 2023',
    time: '9:00 AM - 4:00 PM',
    location: 'Seattle, WA',
    category: 'Technology',
    attendees: 850,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$199',
  },
  {
    id: '8',
    title: 'Art Gallery Opening Night',
    date: 'June 25, 2023',
    time: '7:00 PM - 10:00 PM',
    location: 'Miami, FL',
    category: 'Arts',
    attendees: 220,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: '$25',
  },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'technology', label: 'Technology' },
  { value: 'music', label: 'Music' },
  { value: 'food & drink', label: 'Food & Drink' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'networking', label: 'Networking' },
  { value: 'health', label: 'Health' },
  { value: 'arts', label: 'Arts' },
];

const Events = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const navigate = useNavigate();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const eventPrice = event.price === 'Free' ? 0 : parseInt(event.price.replace('$', ''));
    const matchesPrice = eventPrice >= priceRange[0] && eventPrice <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
              <p className="text-gray-400">Find your next experience from {eventsData.length} upcoming events</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={toggleFilters}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <Link to="/create-event">
                <Button>Host an Event</Button>
              </Link>
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
                onClick={() => setSearchTerm('')}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  <label className="block text-sm font-medium mb-2">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
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
                    setSearchTerm('');
                    setSelectedCategory('all');
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
              {filteredEvents.length} {filteredEvents.length === 1 ? 'result' : 'results'} found
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px] bg-card/50 border-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} {...event} />
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
                  setSearchTerm('');
                  setSelectedCategory('all');
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
                <Button variant="outline" size="icon" className="h-9 w-9 border-gray-800" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" className="px-4 h-9">1</Button>
                <Button variant="outline" size="sm" className="px-4 h-9 border-gray-800">2</Button>
                <Button variant="outline" size="sm" className="px-4 h-9 border-gray-800">3</Button>
                <Button variant="outline" size="icon" className="h-9 w-9 border-gray-800">
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
