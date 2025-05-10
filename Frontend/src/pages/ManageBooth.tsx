
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import PageTransition from '@/components/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManageBooth = () => {
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    toast({
      title: "Booth Settings Saved",
      description: "Your booth settings have been updated successfully.",
    });
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Manage Booth</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="layout">
              <TabsList>
                <TabsTrigger value="layout">Booth Layout</TabsTrigger>
                <TabsTrigger value="products">Booth Products</TabsTrigger>
                <TabsTrigger value="staff">Staff Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="layout" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Booth Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Standard (10x10)</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Booth Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Section A, Spot 42</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Layout Options</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-6">Layout 1</Button>
                    <Button variant="outline" className="h-auto py-6">Layout 2</Button>
                    <Button variant="outline" className="h-auto py-6">Layout 3</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Select Products to Showcase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Choose which products to feature at this event</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="product1" className="w-4 h-4" checked/>
                        <label htmlFor="product1">Handmade Candles</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="product2" className="w-4 h-4" checked/>
                        <label htmlFor="product2">Essential Oils</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="product3" className="w-4 h-4"/>
                        <label htmlFor="product3">Soap Collection</label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="staff" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Staff Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Manage staff for this event</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Jane Smith</p>
                          <p className="text-sm text-muted-foreground">10:00 AM - 2:00 PM</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">2:00 PM - 6:00 PM</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <Button variant="outline" size="sm">+ Add Staff Member</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate('/vendor-profile')}>
              Back to Dashboard
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ManageBooth;
