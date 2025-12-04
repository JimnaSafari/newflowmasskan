import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useState } from "react";
import { Json } from "@/integrations/supabase/types";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  price_type?: string;
  priceType?: "month" | "night";
  rating: number;
  reviews?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: Json | null;
  type: string;
  featured?: boolean;
  managed_by?: string;
  landlord_name?: string;
  agency_name?: string;
  image?: string; // Keep for backward compatibility
}

const PropertyCard = ({
  title,
  location,
  price,
  price_type,
  priceType,
  rating,
  reviews = 0,
  bedrooms,
  bathrooms,
  area,
  images,
  type,
  featured = false,
  managed_by,
  landlord_name,
  agency_name,
  image
}: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // Safely handle images prop and create a safe array of strings
  const safeImages: string[] = (() => {
    if (Array.isArray(images)) {
      return images.filter((img): img is string => typeof img === 'string');
    }
    if (image && typeof image === 'string') {
      return [image];
    }
    return [];
  })();

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 bg-card/80 backdrop-blur">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={safeImages.length > 0 ? safeImages[0] : `https://via.placeholder.com/400x300.png?text=${title.replace(/\s/g, "+")}`}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Multiple Images Indicator */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {safeImages.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
            {safeImages.length > 3 && (
              <div className="text-white text-xs font-medium ml-1">
                +{safeImages.length - 3}
              </div>
            )}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <Badge className="bg-secondary text-secondary-foreground">
              Featured
            </Badge>
          )}
          <Badge variant="outline" className="bg-white/90 text-foreground border-white/20">
            {type}
          </Badge>
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white p-0"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
        
        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1">
          <span className="font-bold text-primary">
            KSh {price.toLocaleString()}
            <span className="text-sm text-muted-foreground">
              /{priceType || price_type || (type === "Airbnb" ? "night" : "month")}
            </span>
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Managed by */}
        {managed_by && (
          <div className="mb-3">
            <Badge variant={managed_by === 'Landlord' ? 'default' : 'secondary'}>
              {managed_by === 'Landlord' ? 'Landlord' : 'Managed by an Agency'}
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="font-medium text-sm">{rating}</span>
          <span className="text-muted-foreground text-sm ml-1">
            ({reviews} reviews)
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{area} sqft</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gradient-primary" size="lg">
          {type === "Rental" ? "View Details" : "Book Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
