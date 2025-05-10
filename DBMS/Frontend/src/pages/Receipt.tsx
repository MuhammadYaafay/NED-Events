import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Download, Ticket, Calendar, MapPin } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { apiRequest } from '@/utils/apiUtils';
import { toast } from "@/components/ui/use-toast";

interface ReceiptData {
  id: string | number;
  event_id: string | number;
  event_name: string;
  event_date: string;
  location: string;
  purchase_date: string;
  payment_method: string;
  payment_status: string;
  quantity: number;
  ticket_price: string;
  amount: string;
}

const Receipt = () => {
  const { id: purchase_id } = useParams();
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!purchase_id) {
        setError("No purchase ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{receipt: ReceiptData}>(`/api/ticket/receipt/${purchase_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          authenticated: true
        });

        if (response && response.receipt) {
          setReceiptData(response.receipt);
          setError(null);
        } else {
          setError("Receipt data is invalid");
          toast({
            title: "Error",
            description: "Could not load receipt details.",
            variant: "destructive"
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load receipt";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [purchase_id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
          <div className="animate-pulse h-96 bg-muted rounded-lg" />
        </div>
      </PageTransition>
    );
  }

  if (error || !receiptData) {
    return (
      <PageTransition>
        <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">Receipt Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The receipt you're looking for could not be found. Please make sure you have the correct link."}
            </p>
            <Button onClick={() => navigate("/profile")}>Back to Profile</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8 px-4 md:px-0">
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
                <p className="text-sm text-muted-foreground">Order #{receiptData.id}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
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
                      <p className="font-medium">{receiptData.event_name}</p>
                      <p className="text-sm text-muted-foreground">Standard Ticket</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Event Date</p>
                      <p className="text-sm text-muted-foreground">
                        {receiptData.event_date ? new Date(receiptData.event_date).toLocaleDateString() : "-"}
                      </p>
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
                    <p className="text-sm text-muted-foreground">
                      {receiptData.purchase_date ? new Date(receiptData.purchase_date).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      {receiptData.payment_method || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Status</p>
                    <p className="text-sm text-muted-foreground">
                      {receiptData.payment_status || "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium mb-2">Ticket QR Code</p>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENT-TICKET-${receiptData.id}`} 
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
                <span>Standard Ticket x {receiptData.quantity}</span>
                <span>${receiptData.ticket_price}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${receiptData.amount}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/event/${receiptData.event_id}`)}>
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
