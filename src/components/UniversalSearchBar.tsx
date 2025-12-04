import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, MapPin, CalendarIcon, Users, Home, Building, Truck, ShoppingCart, DollarSign, Bed, Bath } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { locationData } from '@/data/locations';

interface UniversalSearchBarProps {
  className?: string;
}

const UniversalSearchBar = ({ className = "" }: UniversalSearchBarProps) => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'rentals', label: 'Rentals', icon: Home },
    { value: 'airbnb', label: 'Airbnb', icon: Building },
    { value: 'office', label: 'Office Space', icon: Building },
    { value: 'movers', label: 'Movers', icon: Truck },
    { value: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
  ];

  const handleSearch = () => {
    // Build comprehensive search params
    const params = new URLSearchParams();

    if (location) params.append('location', location);
    if (searchTerm) params.append('search', searchTerm);
    if (checkIn) params.append('checkIn', checkIn.toISOString());
    if (checkOut) params.append('checkOut', checkOut.toISOString());
    if (guests) params.append('guests', guests);
    if (priceRange) params.append('priceRange', priceRange);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (bathrooms) params.append('bathrooms', bathrooms);

    let targetPath = '/';

    switch (category) {
      case 'rentals':
        targetPath = `/rentals?${params.toString()}`;
        break;
      case 'airbnb':
        targetPath = `/airbnb?${params.toString()}`;
        break;
      case 'office':
        targetPath = `/office?${params.toString()}`;
        break;
      case 'movers':
        targetPath = `/movers?${params.toString()}`;
        break;
      case 'marketplace':
        targetPath = `/marketplace?${params.toString()}`;
        break;
      default:
        // If no category selected, use general search on homepage
        targetPath = `/?${params.toString()}`;
    }

    navigate(targetPath);
  };

  const selectedCategory = categories.find(cat => cat.value === category);

  return (
    <div className={`bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20 ${className}`}>
      {/* Main Search Row - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Location */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-white/80">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-black h-11 rounded-full hover:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(locationData).flat().map((town) => (
                  <SelectItem key={town.name} value={town.name}>
                    {town.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category with Icon */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-white/80">Service</label>
          <div className="relative">
            {selectedCategory && (
              <selectedCategory.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-black h-11 rounded-full hover:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-white/80">Search</label>
          <Input
            placeholder="What are you looking for?"
            className="bg-white/90 border-white/30 text-black placeholder:text-gray-500 h-11 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-full shadow-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Conditional Advanced Options - Only show when needed */}
      {category && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="bg-white/90 border-white/30 text-black hover:bg-white h-10 rounded-full px-6 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Options
            {category === 'airbnb' && ' (Dates, Guests)'}
            {category === 'rentals' && ' (Property Type)'}
            {category === 'office' && ' (Occupants)'}
          </Button>
        </div>
      )}

      {/* Advanced Options - Collapsed by default */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Airbnb specific options */}
            {category === 'airbnb' && (
              <>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-white/80">Check-in</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/90 border-white/30 text-black hover:bg-white h-11 pl-10 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                            !checkIn && "text-gray-500"
                          )}
                        >
                          {checkIn ? format(checkIn, "MMM dd") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="rounded-md border shadow-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-white/80">Check-out</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/90 border-white/30 text-black hover:bg-white h-11 pl-10 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                            !checkOut && "text-gray-500"
                          )}
                        >
                          {checkOut ? format(checkOut, "MMM dd") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || (checkIn && date <= checkIn);
                          }}
                          initialFocus
                          className="rounded-md border shadow-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-white/80">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-black h-11 rounded-full hover:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Rentals specific options */}
            {category === 'rentals' && (
              <>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-white/80">Property Type</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-black h-11 rounded-full hover:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Room</SelectItem>
                        <SelectItem value="bedsitter">Bedsitter</SelectItem>
                        <SelectItem value="one-bedroom">One Bedroom</SelectItem>
                        <SelectItem value="two-bedroom">Two Bedroom</SelectItem>
                        <SelectItem value="three-bedroom">Three Bedroom</SelectItem>
                        <SelectItem value="four-bedroom">Four Bedroom</SelectItem>
                        <SelectItem value="five-bedroom">Five Bedroom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="md:col-span-2"></div>
              </>
            )}

            {/* Office specific options */}
            {category === 'office' && (
              <>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-white/80">Occupants</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="pl-10 bg-white/90 border-white/30 text-black h-11 rounded-full hover:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Occupants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Person</SelectItem>
                        <SelectItem value="2">2 People</SelectItem>
                        <SelectItem value="3">3 People</SelectItem>
                        <SelectItem value="4">4 People</SelectItem>
                        <SelectItem value="5">5+ People</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="md:col-span-2"></div>
              </>
            )}
          </div>
        </div>
      )}



      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-600 z-10" />
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="pl-10 bg-white border-gray-200 text-gray-900 h-12 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-50000">Under KSh 50,000</SelectItem>
                  <SelectItem value="50000-100000">KSh 50K - 100K</SelectItem>
                  <SelectItem value="100000-200000">KSh 100K - 200K</SelectItem>
                  <SelectItem value="200000-500000">KSh 200K - 500K</SelectItem>
                  <SelectItem value="500000+">Over KSh 500K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div className="relative">
              <Bed className="absolute left-3 top-3 h-4 w-4 text-gray-600 z-10" />
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="pl-10 bg-white border-gray-200 text-gray-900 h-12 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4 Bedrooms</SelectItem>
                  <SelectItem value="5+">5+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div className="relative">
              <Bath className="absolute left-3 top-3 h-4 w-4 text-gray-600 z-10" />
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger className="pl-10 bg-white border-gray-200 text-gray-900 h-12 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bathroom</SelectItem>
                  <SelectItem value="2">2 Bathrooms</SelectItem>
                  <SelectItem value="3">3 Bathrooms</SelectItem>
                  <SelectItem value="4+">4+ Bathrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 h-12 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalSearchBar;
