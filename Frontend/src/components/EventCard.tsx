
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, TicketPlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event_id: string;
  title: string;
  category: string;
  start_date: string;
  event_time: string;
  location: string;
  booking_count: number;
  image: string;
  ticket_price?: string;
  featured?: boolean;
}

const EventCard = ({ 
  event_id, 
  title, 
  start_date, 
  category,
  event_time, 
  location, 
  booking_count, 
  image, 
  ticket_price, 
  featured
}: EventCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isFree: boolean = Number(ticket_price) === 0;
  const formattedDate = new Date(start_date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return (
    <Link 
      to={`/event/${event_id}`} 
      className={`block rounded-xl overflow-hidden hover-scale ${
        featured ? 'border-2 border-primary shadow-lg shadow-primary/10' : 'border border-gray-800'
      }`}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></div>
        <img 
          src={image} 
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'}`}
          onLoad={() => setIsLoaded(true)}
        />
        {isFree ? (
  <div className="absolute top-3 right-3 z-20">
    <Badge className="bg-primary hover:bg-primary">Free</Badge>
  </div>
) : (
  <div className="absolute top-3 right-3 z-20">
    <Badge className="bg-primary hover:bg-primary">{ticket_price}</Badge>
  </div>
)}
        {featured && (
          <div className="absolute top-3 left-3 z-20">
            <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-primary text-primary">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 bg-card">
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        <div className="flex items-center mb-2 flex-row">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-primary text-primary">
            {category}
          </Badge>
          </div>
           <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{booking_count} attending</span>
          </div>
        <div className="space-y-2 text-sm mt-4 gap-2">
         
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{event_time}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="truncate">{location}</span>
          </div>
          
          
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
