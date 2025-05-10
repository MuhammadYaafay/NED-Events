
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import PageTransition from '@/components/PageTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Credit Card', last4: '4242', expiry: '04/25', isDefault: true },
    { id: 2, type: 'Credit Card', last4: '1234', expiry: '12/23', isDefault: false }
  ]);
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleAddCard = () => {
    // Here you would integrate with a payment processor to add the card securely
    // This is just a mock implementation for UI demonstration
    const newId = Math.max(...paymentMethods.map(m => m.id)) + 1;
    const last4 = newCard.number.slice(-4);
    
    setPaymentMethods([...paymentMethods, {
      id: newId,
      type: 'Credit Card',
      last4,
      expiry: newCard.expiry,
      isDefault: false
    }]);
    
    setNewCard({
      number: '',
      name: '',
      expiry: '',
      cvc: ''
    });
    
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully.",
    });
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleRemove = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    
    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed.",
    });
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <p className="font-medium">{method.type} ending in {method.last4}</p>
                    <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                    {method.isDefault && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full mt-1 inline-block">Default</span>}
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                        Set as Default
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleRemove(method.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add New Payment Method</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      value={newCard.number}
                      onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe"
                      value={newCard.name}
                      onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        placeholder="123"
                        value={newCard.cvc}
                        onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddCard}>Add Payment Method</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate('/vendor-profile')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default PaymentMethods;
