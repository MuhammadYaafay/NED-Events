import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";


import PageTransition from "@/components/PageTransition";



const Home = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Event" 
              className={`w-full h-full object-cover transition-all duration-1000 ${heroLoaded ? 'scale-100 blur-0' : 'scale-110 blur-md'}`}
            />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <div className={`transform transition-all duration-700 ${heroLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-gradient">Unforgettable</span> Events Start Here
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  Discover, create, and experience extraordinary moments with our premium event platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/events">
                    <Button size="lg" className="btn-hover-effect min-w-[180px]">
                      View All Events
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/create-event">
                    <Button size="lg" variant="outline" className="min-w-[180px]">
                      Host an Event
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          

        </section>
        <section className="py-20 bg-gradient-to-b from-background to-black/90">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gradient-to-br from-black to-primary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Host Your Own Event?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Turn your vision into reality with our powerful event management platform.
                Get started in minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/create-event">
                  <Button size="lg" className="btn-hover-effect min-w-[200px]">
                    Create Event
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline" className="min-w-[200px]">
                    Explore First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
