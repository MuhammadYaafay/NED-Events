
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/navbar/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import VendorProfile from "./pages/VendorProfile";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ConfirmPayment from "./pages/ConfirmPayment";
import NotFound from "./pages/NotFound";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import ManageBooth from "./pages/ManageBooth";
import EventDetails from "./pages/EventDetails";
import BookStall from "./pages/BookStall";
import PaymentMethods from "./pages/PaymentMethods";
import Receipt from "./pages/Receipt";
import FixTicketReservation from "./components/FixTicketReservation";

// Routes for the requested features
import EventManagement from "./pages/EventManagement";
import AttendeeManagement from "./pages/AttendeeManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vendor-profile" element={<VendorProfile />} />
            <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
            <Route path="/confirm-payment" element={<ConfirmPayment />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/manage-booth/:id" element={<ManageBooth />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/book-stall" element={<BookStall />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/receipt/:id" element={<Receipt />} />
            
            {/* Routes for requested features */}
            <Route path="/event-management/:id" element={<EventManagement />} />
            <Route path="/attendee-management/:id" element={<AttendeeManagement />} />
            <Route path="/analytics-dashboard/:id" element={<AnalyticsDashboard />} />
            
            {/* Temporary settings route redirection */}
            <Route path="/settings" element={<Navigate to="/vendor-profile?tab=settings" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Toaster />
          <Sonner />
          <FixTicketReservation />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
