
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { vendorData } from '@/components/vendor-profile/VendorData';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package,  Clock, LogOut, Settings } from 'lucide-react';
import ProductsSection from '@/components/vendor-profile/ProductsSection';
import EventsSection from '@/components/vendor-profile/EventsSection';
import RequestHistorySection from '@/components/vendor-profile/RequestHistorySection';
import SettingsSection from '@/components/vendor-profile/SettingsSection';

const VendorProfile = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "products");
  
  // Update the active tab if URL parameters change
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log("Tab changed to:", tab);
  };

  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Vendor Dashboard</CardTitle>
                <CardDescription>Manage your products and events</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={vendorData.logo} alt={vendorData.name} />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{vendorData.name}</p>
                    <p className="text-sm text-muted-foreground">{vendorData.email}</p>
                    <Badge className="mt-2">Vendor</Badge>
                  </div>
                </div>
                <Separator />
                <nav className="space-y-2 overflow-hidden">
                  <Button 
                    variant={activeTab === "products" ? "default" : "ghost"} 
                    className="w-full justify-start truncate"
                    onClick={() => handleTabChange("products")}
                  >
                    <Package className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Products</span>
                  </Button>
                  
                  <Button 
                    variant={activeTab === "history" ? "default" : "ghost"} 
                    className="w-full justify-start truncate"
                    onClick={() => handleTabChange("history")}
                  >
                    <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Stall Booking requests</span>
                    <Badge className="ml-auto flex-shrink-0">{vendorData.requestHistory.filter(r => r.status === "pending").length}</Badge>
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "default" : "ghost"} 
                    className="w-full justify-start truncate"
                    onClick={() => handleTabChange("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Settings</span>
                  </Button>
                </nav>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full justify-start truncate">
                  <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Logout</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "products" && <ProductsSection products={vendorData.products} />}
            {activeTab === "events" && <EventsSection events={vendorData.events} />}
            {activeTab === "history" && <RequestHistorySection />}
            {activeTab === "settings" && <SettingsSection />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VendorProfile;
