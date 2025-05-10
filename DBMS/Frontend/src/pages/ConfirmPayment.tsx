import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle2, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { apiRequest } from '@/utils/apiUtils';

interface PurchaseResponse {
  message: string;
  purchaseId: number;
  paymentId: number;
  eventId: number;
  ticketId: number;
  quantity: number;
  totalAmount: number;
  remainingTickets: number;
}

interface EventDetails {
  id: number;
  title: string;
  price: number;
  quantity: number;
  totalPrice: number;
  serviceFee?: number;
  stallBooking?: {
    status: string;
    price: number;
  };
}

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const ConfirmPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const state = location.state;
    if (!state?.eventDetails) {
      navigate('/events');
      toast({
        title: "Error",
        description: "No event details found",
        variant: "destructive",
      });
      return;
    }
    setEventDetails(state.eventDetails);
  }, [location.state, navigate, toast]);

  if (!eventDetails) return null;

  // Calculate the total price safely
  const calculatedTotalPrice = eventDetails.totalPrice || 0;
  const calculatedServiceFee = eventDetails.serviceFee || 0;
  const stallPrice = eventDetails.stallBooking?.status !== 'pending' 
    ? (eventDetails.stallBooking?.price || 0)
    : 0;
  const calculatedTotal = calculatedTotalPrice + calculatedServiceFee + stallPrice;

  const validateCardDetails = (): boolean => {
    if (paymentMethod !== 'credit-card') return true;
    
    if (!cardDetails.cardNumber.match(/^\d{16}$/)) {
      setError('Invalid card number');
      return false;
    }
    if (!cardDetails.cardName.trim()) {
      setError('Card name is required');
      return false;
    }
    if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      setError('Invalid CVV');
      return false;
    }
    return true;
  };

  const handleCardInputChange = (field: keyof CardDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(null);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    if (!validateCardDetails()) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest<PurchaseResponse>(
        `/api/ticket/purchaseTicket/${eventDetails.id}`,
        {
          method: 'POST',
          body: {
            quantity: eventDetails.quantity,
            paymentMethod,
            ...(paymentMethod === 'credit-card' && {
              cardDetails: {
                ...cardDetails,
                saveCard
              }
            })
          },
          authenticated: true
        }
      );

      toast({
        title: "Payment Successful!",
        description: `Your tickets for ${eventDetails.title} have been confirmed.`,
        variant: "default",
      });

      navigate('/profile', { 
        state: { 
          paymentSuccess: true,
          purchaseDetails: response
        } 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4 md:px-6 mt-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
          Back to Event
        </button>
        
        <h1 className="text-3xl font-bold mb-8">Confirm Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'credit-card' ? 'border-primary' : 'border-input'}`}>
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span>Credit / Debit Card</span>
                      </div>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-2 rounded-md border p-4 ${paymentMethod === 'paypal' ? 'border-primary' : 'border-input'}`}>
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">Pay</span>
                        <span className="text-primary-foreground bg-primary px-1 font-bold">Pal</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'credit-card' && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName" 
                          value={cardDetails.cardName}
                          onChange={handleCardInputChange('cardName')}
                          placeholder="John Smith" 
                          className="mt-1" 
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange('cardNumber')}
                          placeholder="1234 5678 9012 3456" 
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <div className="relative mt-1">
                          <Input 
                            id="expiryDate" 
                            value={cardDetails.expiryDate}
                            onChange={handleCardInputChange('expiryDate')}
                            placeholder="MM/YY" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cvv">Security Code (CVV)</Label>
                        <Input 
                          id="cvv" 
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange('cvv')}
                          placeholder="123" 
                          className="mt-1" 
                          type="password"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="saveCard" 
                        checked={saveCard}
                        onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                      />
                      <Label htmlFor="saveCard">Save card for future payments</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{eventDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {eventDetails.quantity} ticket{eventDetails.quantity > 1 ? 's' : ''}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ticket Price</span>
                    <span>${calculatedTotalPrice.toFixed(2)}</span>
                  </div>
                  
                  {eventDetails.stallBooking && eventDetails.stallBooking.status !== 'pending' && (
                    <div className="flex justify-between">
                      <span>Stall Booking</span>
                      <span>${stallPrice.toFixed(2)}</span>
                    </div>
                  )}

                  {calculatedServiceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>${calculatedServiceFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md mt-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">100% Money Back Guarantee</p>
                      <p className="text-muted-foreground">If the event is canceled or rescheduled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {error && (
                  <div className="text-sm text-destructive mb-2">
                    {error}
                  </div>
                )}
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By completing this purchase you agree to our Terms of Service and Privacy Policy
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ConfirmPayment;
