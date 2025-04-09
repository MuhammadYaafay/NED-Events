
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  image: string;
  price?: string;
  featured?: boolean;
}

const EventCard = ({ 
  id, 
  title, 
  date, 
  time, 
  location, 
  category, 
  attendees, 
  image, 
  price, 
  featured = false 
}: EventCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link 
      to={`/event/${id}`} 
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
        {price && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-primary hover:bg-primary">{price}</Badge>
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
        <div className="flex items-center mb-3">
          <Badge variant="outline" className="text-xs font-normal">
            {category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        <div className="space-y-2 text-sm mt-4">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="truncate">{location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{attendees} attending</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
