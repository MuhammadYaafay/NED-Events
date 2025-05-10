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
  Ticket,
  Store,
  Loader
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from "@/utils/apiUtils";
import { compressImage } from "@/utils/imageUtils";

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  event_time: string;  // changed from time to event_time
  category: string;
  location: string;
  image: string | null;
  ticket_price: string;
  ticket_max_quantity: string;
  has_stall: boolean;
  stall_price?: string;
  stall_max_quantity?: string;
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    event_time: '',  // changed from time to event_time
    category: '',
    location: '',
    image: null,
    ticket_price: '',
    ticket_max_quantity: '',
    has_stall: false,
    stall_price: '',
    stall_max_quantity: ''
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 50MB",
          variant: "destructive"
        });
        return;
      }

      setImageLoading(true);
      try {
        const compressedFile = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        });
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImage(e.target?.result as string);
          setFormData(prev => ({
            ...prev,
            image: e.target?.result as string
          }));
        };
        reader.onerror = () => {
          toast({
            title: "Error",
            description: "Failed to read image file",
            variant: "destructive"
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Error",
          description: "Failed to process image. Please try a different file.",
          variant: "destructive"
        });
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleInputChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return Boolean(formData.title && formData.category);
      case 2:
        return Boolean(
          formData.description && 
          formData.start_date && 
          formData.location
        );
      case 3:
        return Boolean(
          formData.ticket_price && 
          formData.ticket_max_quantity && 
          (!formData.has_stall || (formData.has_stall && formData.stall_price && formData.stall_max_quantity))
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      const response = await apiRequest("/api/event/create", {
        method: "POST",
        body: {
          ...formData,
          event_time: formData.event_time,  // explicitly include event_time
          image: coverImage
        },
        authenticated: true  // Add this to include auth token
      });

      if (response) {
        toast({
          title: "Event Created Successfully!",
          description: "Your event has been published and is now live.",
        });
        navigate('/events');
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error Creating Event",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderImageUpload = () => {
    if (imageLoading) {
      return (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader className="h-6 w-6 text-primary animate-spin" />
            </div>
            <div className="text-gray-300 font-medium">Processing image...</div>
          </div>
        </div>
      );
    }

    if (coverImage) {
      return (
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
      );
    }

    return (
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
    );
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
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="category">Category</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
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
                    {renderImageUpload()}
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
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <div className="flex items-center mt-2 text-gray-400 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>Markdown formatting supported</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="start_date">Start Date</Label>
                        <span className="text-xs text-gray-400">Required</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon className="h-4 w-4" />
                        </div>
                        <Input 
                          id="start_date" 
                          type="date"
                          className="bg-card/50 border-gray-800 pl-10"
                          value={formData.start_date}
                          onChange={(e) => handleInputChange('start_date', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="end_date">End Date</Label>
                        <span className="text-xs text-gray-400">Required</span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon className="h-4 w-4" />
                        </div>
                        <Input 
                          id="end_date" 
                          type="date"
                          className="bg-card/50 border-gray-800 pl-10"
                          value={formData.end_date}
                          onChange={(e) => handleInputChange('end_date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="event_time">Event Time</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <Input 
                        id="event_time" 
                        type="time"
                        className="bg-card/50 border-gray-800 pl-10"
                        value={formData.event_time}
                        onChange={(e) => handleInputChange('event_time', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="location">Location</Label>
                      <span className="text-xs text-gray-400">Required</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <Input 
                        id="location" 
                        placeholder="Enter the event venue or address"
                        className="bg-card/50 border-gray-800 pl-10"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
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
            
            {/* Step 3: Tickets & Pricing */}
            {step === 3 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Tickets & Pricing</h2>
                  <p className="text-gray-400">Set up your event's ticket types and pricing</p>
                </div>
                
                <div className="space-y-6">
                  {/* Ticket Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Badge className="mr-2">Tickets</Badge>
                      <h3 className="text-lg font-medium">Standard Ticket</h3>
                    </div>
                    
                    <div className="space-y-4 border border-gray-800 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="ticket_price">Ticket Price</Label>
                            <span className="text-xs text-gray-400">Required</span>
                          </div>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-gray-400">
                              <DollarSign className="h-4 w-4" />
                            </div>
                            <Input 
                              id="ticket_price" 
                              placeholder="0.00"
                              value={formData.ticket_price}
                              onChange={(e) => handleInputChange('ticket_price', e.target.value)}
                              className="bg-card/50 border-gray-800 pl-10"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <Label htmlFor="ticket_max_quantity">Available Tickets</Label>
                            <span className="text-xs text-gray-400">Required</span>
                          </div>
                          <Input 
                            id="ticket_max_quantity" 
                            type="number"
                            placeholder="Number of tickets available"
                            value={formData.ticket_max_quantity}
                            onChange={(e) => handleInputChange('ticket_max_quantity', e.target.value)}
                            className="bg-card/50 border-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stalls Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Badge className="mr-2">Stalls</Badge>
                      <h3 className="text-lg font-medium">Vendor Stalls</h3>
                    </div>
                    
                    <div className="space-y-4 border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch 
                          id="has_stall" 
                          checked={formData.has_stall}
                          onCheckedChange={(checked) => handleInputChange('has_stall', checked)}
                        />
                        <Label htmlFor="has_stall">Enable vendor stalls for this event</Label>
                      </div>

                      {formData.has_stall && (
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <Label htmlFor="stall_price">Stall Price</Label>
                                <span className="text-xs text-gray-400">Required</span>
                              </div>
                              <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                  <DollarSign className="h-4 w-4" />
                                </div>
                                <Input 
                                  id="stall_price" 
                                  placeholder="0.00"
                                  value={formData.stall_price}
                                  onChange={(e) => handleInputChange('stall_price', e.target.value)}
                                  className="bg-card/50 border-gray-800 pl-10"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <Label htmlFor="stall_max_quantity">Available Stalls</Label>
                                <span className="text-xs text-gray-400">Required</span>
                              </div>
                              <Input 
                                id="stall_max_quantity" 
                                type="number"
                                placeholder="Number of stalls available"
                                value={formData.stall_max_quantity}
                                onChange={(e) => handleInputChange('stall_max_quantity', e.target.value)}
                                className="bg-card/50 border-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="mr-2 h-5 w-5" />
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
                        <Badge className="mb-2 bg-primary hover:bg-primary">{formData.category}</Badge>
                        <h3 className="text-2xl font-bold text-white">{formData.title}</h3>
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
                                <div className="text-gray-400">
                                  {new Date(formData.start_date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                {formData.end_date && (
                                  <div className="text-gray-400">
                                    to {new Date(formData.end_date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex">
                              <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-medium">Location</div>
                                <div className="text-gray-400">{formData.location}</div>
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
                                <div className="text-gray-400">${parseFloat(formData.ticket_price).toFixed(2)}</div>
                                <div className="text-gray-400">{formData.ticket_max_quantity} available</div>
                              </div>
                            </div>
                            
                            {formData.has_stall && (
                              <div className="flex">
                                <Store className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Vendor Stalls</div>
                                  <div className="text-gray-400">${parseFloat(formData.stall_price || '0').toFixed(2)} per stall</div>
                                  <div className="text-gray-400">{formData.stall_max_quantity} stalls available</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-800 my-6" />
                      
                      <h4 className="text-lg font-medium mb-3">Event Description</h4>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {formData.description}
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
