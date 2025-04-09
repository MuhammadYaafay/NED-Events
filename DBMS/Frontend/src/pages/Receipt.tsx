
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Download, Ticket, Calendar, MapPin, Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock receipt data - in a real app, you would fetch this based on the ID
  const receiptData = {
    id: id,
    eventName: "Tech Conference 2023",
    eventDate: "October 15, 2023",
    location: "Tech Innovation Center, San Francisco, CA",
    purchaseDate: "August 20, 2023",
    ticketType: "VIP",
    ticketPrice: "$299.99",
    quantity: 1,
    total: "$299.99",
    paymentMethod: "Visa •••• 4242",
    orderNumber: "ORD-2023-08512",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENT-TICKET-" + id
  };

  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0"> {/* Updated padding-top */}
        {/* Back button */}
        <button 
          onClick={() => navigate("/profile")} 
          className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
          Back to Profile
        </button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Receipt</CardTitle>
                <p className="text-sm text-muted-foreground">Order #{receiptData.orderNumber}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{receiptData.eventName}</p>
                      <p className="text-sm text-muted-foreground">{receiptData.ticketType} Ticket</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Event Date</p>
                      <p className="text-sm text-muted-foreground">{receiptData.eventDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{receiptData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                <h3 className="font-semibold text-lg mb-4">Purchase Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Purchase Date</p>
                    <p className="text-sm text-muted-foreground">{receiptData.purchaseDate}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">{receiptData.paymentMethod}</p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium mb-2">Ticket QR Code</p>
                  <img 
                    src={receiptData.qrCode} 
                    alt="Ticket QR Code" 
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{receiptData.ticketType} Ticket x {receiptData.quantity}</span>
                <span>{receiptData.ticketPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{receiptData.total}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/event/${id}`)}>
              View Event
            </Button>
            <Button onClick={() => window.print()}>
              Print Receipt
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Receipt;
