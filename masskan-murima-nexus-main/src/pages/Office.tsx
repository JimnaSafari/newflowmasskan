import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import BookingModal from "@/components/BookingModal";
import heroOffice from "@/assets/hero-office.jpg";

const Office = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Office Spaces | Masskan Murima";
  }, []);

  const handleBookNow = (property) => {
    if (!user) {
      toast.error("Please log in to book an office space");
      return;
    }
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const offices = [
    {
      id: "9d0ffa08-2df5-4a11-91da-662952d7a8a2",
      title: "Modern Co-working Space",
      location: "Westlands, Nairobi",
      price: 40000,
      priceType: "month" as const,
      rating: 4.6,
      reviews: 21,
      bedrooms: 0,
      bathrooms: 2,
      area: 600,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      type: "rental" as const
    },
    {
      id: "694ee174-ced2-4593-8941-e40fe063a0bd",
      title: "Grade A Office Floor",
      location: "Upper Hill, Nairobi",
      price: 250000,
      priceType: "month" as const,
      rating: 4.8,
      reviews: 14,
      bedrooms: 0,
      bathrooms: 4,
      area: 2500,
      image: "https://images.unsplash.com/photo-1507209696998-3c532be9b2b4?w=800&h=600&fit=crop",
      type: "rental" as const,
      featured: true
    },
    {
      id: "75f43f63-863b-46cf-b74f-394859dc6c33",
      title: "Private Office Suite",
      location: "Kilimani, Nairobi",
      price: 120000,
      priceType: "month" as const,
      rating: 4.7,
      reviews: 9,
      bedrooms: 0,
      bathrooms: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
      type: "rental" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero 
        title="Office Spaces for Rent"
        subtitle="Flexible offices, co-working, and corporate floors in prime locations."
        imageUrl={heroOffice}
      />

      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Enter location..." className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black rounded-full" />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Office Type</label>
                <Select>
                  <SelectTrigger>
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Office Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cowork">Co-working</SelectItem>
                    <SelectItem value="private">Private Office</SelectItem>
                    <SelectItem value="floor">Whole Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Price Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">KSh 0 - 50,000</SelectItem>
                    <SelectItem value="50000-150000">KSh 50,000 - 150,000</SelectItem>
                    <SelectItem value="150000+">KSh 150,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 bg-orange-500 hover:bg-orange-600">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Available Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((o) => (
              <div key={o.id} onClick={() => handleBookNow(o)}>
                <PropertyCard {...o} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProperty && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          propertyTitle={selectedProperty.title}
          propertyId={selectedProperty.id || ''}
        />
      )}

      <Footer />
    </div>
  );
};

export default Office;
