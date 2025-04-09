
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ReserveTicketButtonProps {
  eventId: string;
  eventName?: string;
  price?: string;
}

const ReserveTicketButton = ({ 
  eventId, 
  eventName = "this event",
  price = "$299"
}: ReserveTicketButtonProps) => {
  const [isReserving, setIsReserving] = useState(false);
  const navigate = useNavigate();

  const handleReserveTicket = () => {
    setIsReserving(true);
    
    // Simulate a reservation process
    setTimeout(() => {
      setIsReserving(false);
      
      // Show success toast
      toast({
        title: "Ticket Reserved",
        description: `You have successfully reserved a ticket for ${eventName}.`,
      });
      
      // Convert price string to number, removing "$" and parsing as float
      // Ensure we have a valid number with a fallback
      const priceValue = parseFloat((price || "$0").replace(/[^\d.-]/g, '')) || 299;
      
      // Navigate to payment confirmation with properly structured data
      navigate(`/confirm-payment`, {
        state: {
          eventDetails: {
            title: eventName,
            price: price,
            quantity: 1,
            totalPrice: priceValue
          }
        }
      });
    }, 1000);
  };

  return (
    <Button 
      onClick={handleReserveTicket} 
      disabled={isReserving}
      className="w-full"
    >
      {isReserving ? "Processing..." : "Reserve Ticket"}
    </Button>
  );
};

export default ReserveTicketButton;
