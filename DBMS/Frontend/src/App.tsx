
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import VendorProfile from "./pages/VendorProfile";
import ConfirmPayment from "./pages/ConfirmPayment";
import NotFound from "./pages/NotFound";
import EventDetails from "./pages/EventDetails";
import BookStall from "./pages/BookStall";
import PaymentMethods from "./pages/PaymentMethods";
import Receipt from "./pages/Receipt";
import FixTicketReservation from "./components/FixTicketReservation";

// Routes for the requested features

import AttendeeManagement from "./pages/AttendeeManagement";


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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vendor-profile" element={<VendorProfile />} />
            <Route path="/confirm-payment" element={<ConfirmPayment />} />
            <Route path="/event-details/:id" element={<EventDetails />} />
            <Route path="/book-stall" element={<BookStall />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/receipt/:id" element={<Receipt />} />
            
            {/* Routes for requested features */}
            <Route path="/attendee-management/:id" element={<AttendeeManagement />} />
       
            
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
