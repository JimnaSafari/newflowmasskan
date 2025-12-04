import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHero from "@/components/PageHero";
import { useState } from "react";
import { locationData, allCounties } from "@/data/locations";
import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroAirbnb from "@/assets/hero-airbnb.jpg";

const Airbnb = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [guests, setGuests] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock data for Airbnb properties
  const properties = [
    {
      id: "9d0ffa08-2df5-4a11-91da-662952d7a8a2",
      title: "Cozy Studio Near City Center",
      location: "Westlands, Nairobi",
      price: 12000,
      priceType: "night" as const,
      rating: 4.9,
      reviews: 42,
      bedrooms: 1,
      bathrooms: 1,
      area: 450,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      type: "airbnb" as const
    },
    {
      id: "694ee174-ced2-4593-8941-e40fe063a0bd",
      title: "Luxury Penthouse Suite",
      location: "Kilimani, Nairobi",
      price: 25000,
      priceType: "night" as const,
      rating: 5.0,
      reviews: 31,
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=300&fit=crop",
      type: "airbnb" as const,
      featured: true
    },
    {
      id: "75f43f63-863b-46cf-b74f-394859dc6c33",
      title: "Modern Apartment with Pool",
      location: "Kileleshwa, Nairobi",
      price: 18000,
      priceType: "night" as const,
      rating: 4.8,
      reviews: 28,
      bedrooms: 2,
      bathrooms: 2,
      area: 1000,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      type: "airbnb" as const
    },
    {
      id: "b86556b4-6410-47f5-9662-6b81dc785d19",
      title: "Charming Garden Villa",
      location: "Karen, Nairobi",
      price: 30000,
      priceType: "night" as const,
      rating: 4.7,
      reviews: 19,
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      type: "airbnb" as const
    }
  ];

  const { user } = useAuth();

  const handleBookNow = (property) => {
    if (!user) {
      toast.error("Please log in to book a property");
      return;
    }
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const towns = selectedCounty ? locationData[selectedCounty] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <PageHero 
        title="Airbnb Stays"
        subtitle="Experience Kenyan hospitality with our unique stays."
        imageUrl={heroAirbnb}
      />

      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Location</label>
                <Select onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCounties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Price per night</label>
                <Select onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10000">KSh 0 - KSh 10,000</SelectItem>
                    <SelectItem value="10000-20000">KSh 10,000 - KSh 20,000</SelectItem>
                    <SelectItem value="20000+">KSh 20,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Guests</label>
                <Select onValueChange={setGuests}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4+">4+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 bg-orange-500 hover:bg-orange-600 text-white">
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div key={property.id} onClick={() => handleBookNow(property)}>
                <PropertyCard {...property} />
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

export default Airbnb;
