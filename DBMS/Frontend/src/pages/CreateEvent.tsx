
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Upload, 
  Image, 
  FileText, 
  DollarSign, 
  Calendar as CalendarIcon, 
  X, 
  Check, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Link,
  Users,
  Plus,
  Loader2,
  Ticket
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { toast } from "@/components/ui/use-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [eventType, setEventType] = useState('in-person');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Event Created Successfully!",
        description: "Your event has been published and is now live.",
      });
      navigate('/events');
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
            <p className="text-gray-400 mb-8">Fill in the details to create and publish your event</p>
            
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-gray-700'}`}>
                    {step > 1 ? <Check className="h-4 w-4" /> : <span>1</span>}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Basic Info</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step > 1 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                
                <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-gray-700'}`}>
                    {step > 2 ? <Check className="h-4 w-4" /> : <span>2</span>}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Details</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step > 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                
                <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary/10' : 'border-gray-700'}`}>
                    {step > 3 ? <Check className="h-4 w-4" /> : <span>3</span>}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Tickets</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step > 3 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                
                <div className={`flex items-center ${step >= 4 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 4 ? 'border-primary bg-primary/10' : 'border-gray-700'}`}>
                    <span>4</span>
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Review</span>
                </div>
              </div>
            </div>
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <p className="text-gray-400">Let's start with the essential details of your event</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="title">Event Title</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <Input 
                      id="title" 
                      placeholder="Give your event a clear, descriptive name"
                      className="bg-card/50 border-gray-800"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="organizer">Organizer</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <Input 
                      id="organizer" 
                      placeholder="Who is hosting this event?"
                      className="bg-card/50 border-gray-800"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="category">Category</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <Select>
                      <SelectTrigger className="bg-card/50 border-gray-800">
                        <SelectValue placeholder="Select event category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts & Entertainment</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="sports">Sports & Fitness</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="cover">Cover Image</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    
                    {coverImage ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-800 aspect-[16/9]">
                        <img 
                          src={coverImage} 
                          alt="Event cover" 
                          className="w-full h-full object-cover" 
                        />
                        <button 
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black p-1 rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-gray-500 transition-colors cursor-pointer relative">
                        <input 
                          type="file" 
                          id="coverImage" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <Image className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-gray-300 font-medium">Upload Cover Image</div>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB (16:9 ratio recommended)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-10 flex justify-end">
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Event Details */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <p className="text-gray-400">Provide the specifics about your event</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="description">Event Description</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your event, what attendees can expect..."
                      className="bg-card/50 border-gray-800 min-h-[150px]"
                    />
                    <div className="flex items-center mt-2 text-gray-400 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>Markdown formatting supported</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="start-date">Start Date</Label>
                        <span className="text-xs text-gray-400">Required</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon className="h-4 w-4" />
                        </div>
                        <Input 
                          id="start-date" 
                          type="date"
                          className="bg-card/50 border-gray-800 pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="end-date">End Date</Label>
                        <span className="text-xs text-gray-400">Optional</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon className="h-4 w-4" />
                        </div>
                        <Input 
                          id="end-date" 
                          type="date"
                          className="bg-card/50 border-gray-800 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="start-time">Start Time</Label>
                        <span className="text-xs text-gray-400">Required</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <Input 
                          id="start-time" 
                          type="time"
                          className="bg-card/50 border-gray-800 pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="end-time">End Time</Label>
                        <span className="text-xs text-gray-400">Optional</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <Input 
                          id="end-time" 
                          type="time"
                          className="bg-card/50 border-gray-800 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                 
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="capacity">Max Capacity</Label>
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <Input 
                        id="capacity" 
                        type="number"
                        placeholder="Maximum number of attendees"
                        className="bg-card/50 border-gray-800 pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch id="featured" />
                      <Label htmlFor="featured">Feature this event on homepage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="private" />
                      <Label htmlFor="private">Private event (invitation only)</Label>
                    </div>
                  </div>
                </div>

                <div className="mb-8 pt-5">
                  <h2 className="text-xl font-semibold mb-4">Stall Details</h2>
                  <p className="text-gray-400">Want to add stalls in your event</p>
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="capacity">Max Capacity</Label>
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <Input 
                        id="capacity" 
                        type="number"
                        placeholder="Maximum number of stalls"
                        className="bg-card/50 border-gray-800 pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 pt-5">
                      <Label htmlFor="capacity">Size</Label>
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <Input 
                        id="capacity" 
                        type="number"
                        placeholder="Stalls size"
                        className="bg-card/50 border-gray-800 pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 pt-5">
                      <Label htmlFor="capacity">Price</Label>
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <Input 
                        id="capacity" 
                        type="number"
                        placeholder="Stalls price"
                        className="bg-card/50 border-gray-800 pl-10"
                      />
                    </div>
                  </div>
                
                <div className="mt-10 flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Tickets & Pricing */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Tickets & Pricing</h2>
                  <p className="text-gray-400">Set up your event's ticket types and pricing</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <Badge className="mr-2">Ticket Type #1</Badge>
                      <h3 className="text-lg font-medium">Standard Ticket</h3>
                    </div>
                    
                    <div className="space-y-4 border border-gray-800 rounded-lg p-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label htmlFor="ticket-name">Ticket Name</Label>
                          <span className="text-xs text-gray-400">Required</span>
                        </div>
                        <Input 
                          id="ticket-name" 
                          placeholder="e.g., Standard, VIP, Early Bird"
                          defaultValue="Standard Ticket"
                          className="bg-card/50 border-gray-800"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="ticket-price">Price</Label>
                            <span className="text-xs text-gray-400">Required</span>
                          </div>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-gray-400">
                              <DollarSign className="h-4 w-4" />
                            </div>
                            <Input 
                              id="ticket-price" 
                              placeholder="0.00"
                              defaultValue="99.00"
                              className="bg-card/50 border-gray-800 pl-10"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="ticket-quantity">Quantity Available</Label>
                            <span className="text-xs text-gray-400">Required</span>
                          </div>
                          <Input 
                            id="ticket-quantity" 
                            type="number"
                            placeholder="Number of tickets available"
                            defaultValue="100"
                            className="bg-card/50 border-gray-800"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="sale-start">Sale Start</Label>
                            <span className="text-xs text-gray-400">Optional</span>
                          </div>
                          <Input 
                            id="sale-start" 
                            type="date"
                            className="bg-card/50 border-gray-800"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="sale-end">Sale End</Label>
                            <span className="text-xs text-gray-400">Optional</span>
                          </div>
                          <Input 
                            id="sale-end" 
                            type="date"
                            className="bg-card/50 border-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-gray-300 font-medium">Add Another Ticket Type</div>
                      <p className="text-gray-400 text-sm">Create VIP, early bird, or group tickets</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-800 my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Checkout Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-remaining" defaultChecked />
                        <Label htmlFor="show-remaining">Show remaining tickets to customers</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="collect-info" defaultChecked />
                        <Label htmlFor="collect-info">Collect attendee information during checkout</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="limit-tickets" />
                        <Label htmlFor="limit-tickets">Limit tickets per order</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 4: Review & Publish */}
            {step === 4 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>
                  <p className="text-gray-400">Review your event details before publishing</p>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-card/50 rounded-lg overflow-hidden border border-gray-800">
                    <div className="aspect-[3/1] relative">
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt="Event cover" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="mb-2 bg-primary hover:bg-primary">Technology</Badge>
                        <h3 className="text-2xl font-bold text-white">Tech Conference 2023: Future of AI</h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-medium mb-3">Event Details</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex">
                              <Calendar className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-medium">Date & Time</div>
                                <div className="text-gray-400">June 15, 2023</div>
                                <div className="text-gray-400">9:00 AM - 6:00 PM</div>
                              </div>
                            </div>
                            
                            <div className="flex">
                              <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-medium">Location</div>
                                <div className="text-gray-400">San Francisco Convention Center</div>
                                <div className="text-gray-400">747 Howard St, San Francisco, CA 94103</div>
                              </div>
                            </div>
                            
                            <div className="flex">
                              <Users className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-medium">Capacity</div>
                                <div className="text-gray-400">100 attendees maximum</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-medium mb-3">Ticket Information</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex">
                              <Ticket className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-medium">Standard Ticket</div>
                                <div className="text-gray-400">$99.00</div>
                                <div className="text-gray-400">100 available</div>
                              </div>
                            </div>
                            
                            <div className="flex">
                              <Calendar className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-medium">Sales Period</div>
                                <div className="text-gray-400">Now until event date</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-800 my-6" />
                      
                      <h4 className="text-lg font-medium mb-3">Event Description</h4>
                      <p className="text-gray-300 text-sm">
                        Join us for the most innovative tech conference of the year, focusing on the future of Artificial Intelligence and how it will shape our world. Hear from leading experts, participate in hands-on workshops, and network with professionals in the field.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-card/30 rounded-lg p-4 border border-gray-800 flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Almost Ready to Publish!</h4>
                      <p className="text-sm text-gray-400">
                        Once published, your event will be visible to the public and people can start registering. You can edit most details after publishing.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <div className="space-x-3">
                    <Button variant="outline">Save as Draft</Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          Publish Event
                          <Check className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateEvent;
