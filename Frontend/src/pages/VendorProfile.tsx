import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Calendar, Clock, LogOut, Settings } from "lucide-react";
import ProductsSection from "@/components/vendor-profile/ProductsSection";
import EventsSection from "@/components/vendor-profile/EventsSection";
import RequestHistorySection from "@/components/vendor-profile/RequestHistorySection";
import SettingsSection from "@/components/vendor-profile/SettingsSection";
import { getAuthToken, isAuthenticated } from "@/utils/authUtils";
import { apiRequest } from "@/utils/apiUtils";

interface VendorData {
  name: string;
  email: string;
  image_url?: string;
  description: string;
}

interface ApiResponse<T> {
  message: string;
  products?: T[];
  events?: T[];
  requests?: T[];
}

interface Product {
  product_id: number;
  name: string;
  price: string;
  image: string;
}

interface Event {
  event_id: number;
  event_name: string;
  date: string;
  status: string;
}

interface RequestHistory {
  booking_id: number;
  event_name: string;
  date: string;
  stall_number: string;
  status: string;
}

const VendorProfile = () => {
  const [searchParams] = useSearchParams();
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const tabFromUrl = searchParams.get("tab");
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [vendorRequestsHistory, setVendorRequestsHistory] = useState<RequestHistory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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

  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const profile = await apiRequest<VendorData>("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setVendorData((prev) => ({
            ...prev,
            name: profile.name,
            email: profile.email,
            image_url: profile.image_url,
            description: profile.description
          }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching profile data:", error);
        if (isMounted) {
          setApiErrors((prev) => [...prev, `Profile data: ${message}`]);
        }
      }
    };

    if (isAuthenticated()) {
      fetchProfileData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch vendor events
  useEffect(() => {
    let isMounted = true;
    const fetchVendorEvents = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await apiRequest<ApiResponse<Event>>("/api/stall/getVendorEvents", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted && response?.events) {
          setEvents(response.events);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching events:", error);
        if (isMounted) {
          setApiErrors((prev) => [...prev, `Event history: ${message}`]);
        }
      }
    };

    if (isAuthenticated()) {
      fetchVendorEvents();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch vendor requests history
  useEffect(() => {
    let isMounted = true;
    const fetchVendorRequests = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await apiRequest<ApiResponse<RequestHistory>>("/api/stall/bookingsHistory", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted && response?.requests) {
          setVendorRequestsHistory(response.requests);
        }
      } catch (error) {
        // Don't treat 404 as an error, just set empty requests
        if (
          error instanceof Error &&
          error.message === "No pending requests found"
        ) {
          if (isMounted) {
            setVendorRequestsHistory([]);
          }
          return;
        }

        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching vendor requests:", error);
        if (isMounted) {
          setApiErrors((prev) => [...prev, `Vendor requests: ${message}`]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated()) {
      fetchVendorRequests();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await apiRequest<ApiResponse<Product>>("/api/stall/getVendorProducts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted && response?.products) {
          setProducts(response.products);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching products:", error);
        if (isMounted) {
          setApiErrors((prev) => [...prev, `Product data: ${message}`]);
        }
      }
    };
    if (isAuthenticated()) {
      fetchProducts();
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="container mx-auto pt-24 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded mt-2 animate-pulse"></div>
                    </div>
                  </div>
                  <Separator />
                  <nav className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-9 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-8 w-32 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mt-2 mx-auto animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!vendorData) {
    return null;
  }

  return (
    <PageTransition>
      <div className="container mx-auto pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Vendor Dashboard</CardTitle>
                <CardDescription>
                  Manage your products and events
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={vendorData.image_url}
                      alt={vendorData.name}
                    />
                    <AvatarFallback>
                      {vendorData.name?.charAt(0) || "V"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {vendorData.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vendorData.email}
                    </p>
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
                    variant={activeTab === "events" ? "default" : "ghost"}
                    className="w-full justify-start truncate"
                    onClick={() => handleTabChange("events")}
                  >
                    <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Events</span>
                  </Button>
                  <Button
                    variant={activeTab === "history" ? "default" : "ghost"}
                    className="w-full justify-start truncate"
                    onClick={() => handleTabChange("history")}
                  >
                    <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      Stall Booking Request History
                    </span>
                    <Badge className="ml-auto flex-shrink-0">
                      {vendorRequestsHistory.filter(
                        (r) => r.status === "pending"
                      ).length || 0}
                    </Badge>
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
                <Button
                  variant="outline"
                  className="w-full justify-start truncate"
                >
                  <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Logout</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "products" && (
              <ProductsSection products={products} />
            )}
            {activeTab === "events" && (
              <EventsSection
                events={events.map((e) => ({
                  id: e.event_id,
                  name: e.event_name,
                  date: e.date,
                  status: e.status
                }))}
              />
            )}
            {activeTab === "history" && (
              <RequestHistorySection
                history={vendorRequestsHistory}
              />
            )}
            {activeTab === "settings" && <SettingsSection />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VendorProfile;
