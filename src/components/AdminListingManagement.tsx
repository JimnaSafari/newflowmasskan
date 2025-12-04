import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { 
  Home, Package, Truck, Edit, Trash2, Eye, Star, MapPin, 
  Calendar, DollarSign, Bed, Bath, Square 
} from 'lucide-react';
import { format } from 'date-fns';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  price_type: string;
  managed_by: string;
  featured: boolean;
  image: string;
  created_at: string;
}

interface MarketplaceItem {
  id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  condition: string;
  image: string;
  created_at: string;
}

interface MovingService {
  id: string;
  name: string;
  location: string;
  price_range: string;
  verified: boolean;
  rating: number;
  image: string;
  created_at: string;
}

const AdminListingManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch all properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["admin_all_properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all marketplace items
  const { data: marketplaceItems, isLoading: marketplaceLoading } = useQuery({
    queryKey: ["admin_all_marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all moving services
  const { data: movingServices, isLoading: servicesLoading } = useQuery({
    queryKey: ["admin_all_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moving_services")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Delete mutations
  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_all_properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete property");
    },
  });

  const deleteMarketplaceItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("marketplace_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_all_marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace_items"] });
      toast.success("Item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  const deleteMovingService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("moving_services")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_all_services"] });
      queryClient.invalidateQueries({ queryKey: ["moving_services"] });
      toast.success("Service deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete service");
    },
  });

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={property.image || '/placeholder.svg'}
            alt={property.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4" />
              {property.location}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms}
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms}
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                {property.area} sqft
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={property.featured ? 'default' : 'secondary'}>
                {property.type}
              </Badge>
              {property.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary mb-2">
              KSh {property.price.toLocaleString()}/{property.price_type}
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {format(new Date(property.created_at), 'MMM dd, yyyy')}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteProperty.mutate(property.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MarketplaceCard = ({ item }: { item: MarketplaceItem }) => (
    <Card className="border-l-4 border-l-secondary">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Package className="h-4 w-4" />
              {item.category}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4" />
              {item.location}
            </div>
            <Badge variant="outline">
              {item.condition}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary mb-2">
              KSh {item.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {format(new Date(item.created_at), 'MMM dd, yyyy')}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteMarketplaceItem.mutate(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceCard = ({ service }: { service: MovingService }) => (
    <Card className="border-l-4 border-l-accent">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={service.image || '/placeholder.svg'}
            alt={service.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4" />
              {service.location}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {service.price_range}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={service.verified ? 'default' : 'secondary'}>
                {service.verified ? 'Verified' : 'Unverified'}
              </Badge>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {service.rating || 4.5}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-3">
              {format(new Date(service.created_at), 'MMM dd, yyyy')}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteMovingService.mutate(service.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Listing Management</CardTitle>
          <CardDescription>
            Manage all properties, marketplace items, and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="properties">Properties</SelectItem>
                <SelectItem value="marketplace">Marketplace Items</SelectItem>
                <SelectItem value="services">Moving Services</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-4">
            {selectedCategory === 'properties' && (
              <>
                {propertiesLoading ? (
                  <LoadingSpinner />
                ) : properties && properties.length > 0 ? (
                  properties
                    .filter(property => 
                      !searchTerm || 
                      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      property.location.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No properties found</p>
                  </div>
                )}
              </>
            )}

            {selectedCategory === 'marketplace' && (
              <>
                {marketplaceLoading ? (
                  <LoadingSpinner />
                ) : marketplaceItems && marketplaceItems.length > 0 ? (
                  marketplaceItems
                    .filter(item => 
                      !searchTerm || 
                      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <MarketplaceCard key={item.id} item={item} />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No marketplace items found</p>
                  </div>
                )}
              </>
            )}

            {selectedCategory === 'services' && (
              <>
                {servicesLoading ? (
                  <LoadingSpinner />
                ) : movingServices && movingServices.length > 0 ? (
                  movingServices
                    .filter(service => 
                      !searchTerm || 
                      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      service.location.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No moving services found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminListingManagement;
