import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCreateProperty } from '@/hooks/useListings';
import { useCreateMarketplaceItem } from '@/hooks/useListings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AdminListingFormProps {
  type: 'property' | 'marketplace';
}

interface PropertyFormData {
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  price_type: string;
  managed_by: string;
  description: string;
  landlord_name?: string;
  agency_name?: string;
  featured: boolean;
}

interface MarketplaceFormData {
  title: string;
  location: string;
  price: number;
  category: string;
  condition: string;
  description: string;
}

const AdminListingForm = ({ type }: AdminListingFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData | MarketplaceFormData>(
    type === 'property' 
      ? {
          title: '',
          location: '',
          price: 0,
          bedrooms: 1,
          bathrooms: 1,
          area: 0,
          type: '',
          price_type: '',
          managed_by: '',
          description: '',
          featured: false,
        } as PropertyFormData
      : {
          title: '',
          location: '',
          price: 0,
          category: '',
          condition: '',
          description: '',
        } as MarketplaceFormData
  );
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const bucket = type === 'property' ? 'property-images' : 'marketplace-images';
  const { uploadImage, uploading } = useImageUpload(bucket);
  const createProperty = useCreateProperty();
  const createMarketplaceItem = useCreateMarketplaceItem();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, 6);
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setImages(newImages);
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to create a listing");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least 1 image");
      return;
    }

    try {
      // Upload all images
      const imageUrls = await Promise.all(
        images.map(image => uploadImage(image))
      );
      const primaryImageUrl = imageUrls[0];

      if (type === 'property') {
        const propertyData = formData as PropertyFormData;
        await createProperty.mutateAsync({
          ...propertyData,
          image: primaryImageUrl,
          images: imageUrls,
          rating: 4.5, // Default rating
          reviews: 0, // Default reviews
        });
        toast.success("Property listed successfully!");
      } else {
        const marketplaceData = formData as MarketplaceFormData;
        await createMarketplaceItem.mutateAsync({
          ...marketplaceData,
          image: primaryImageUrl,
          images: imageUrls,
        });
        toast.success("Item listed successfully!");
      }

      setIsOpen(false);
      setFormData(
        type === 'property' 
          ? {
              title: '',
              location: '',
              price: 0,
              bedrooms: 1,
              bathrooms: 1,
              area: 0,
              type: '',
              price_type: '',
              managed_by: '',
              description: '',
              featured: false,
            } as PropertyFormData
          : {
              title: '',
              location: '',
              price: 0,
              category: '',
              condition: '',
              description: '',
            } as MarketplaceFormData
      );
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create listing";
      toast.error(errorMessage);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add {type === 'property' ? 'Property' : 'Item'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {type === 'property' ? 'Property' : 'Marketplace'} Listing</DialogTitle>
          <DialogDescription>
            Fill in the details to create your listing. Images will appear on the client side immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Images (Required)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg border-2 border-dashed border-gray-300" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors h-32 flex flex-col justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Click to add image</p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {images.length}/6 images uploaded
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={(formData as any).title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Enter property/item title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={(formData as any).location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (KSh) *</Label>
            <Input
              id="price"
              type="number"
              value={(formData as any).price}
              onChange={(e) => updateFormData('price', parseInt(e.target.value) || 0)}
              placeholder="Enter price"
              required
            />
          </div>

          {/* Property-specific fields */}
          {type === 'property' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={(formData as PropertyFormData).bedrooms}
                    onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value) || 1)}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={(formData as PropertyFormData).bathrooms}
                    onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value) || 1)}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={(formData as PropertyFormData).area}
                    onChange={(e) => updateFormData('area', parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type *</Label>
                  <Select 
                    value={(formData as PropertyFormData).type} 
                    onValueChange={(value) => updateFormData('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rental">Rental</SelectItem>
                      <SelectItem value="Airbnb">Airbnb</SelectItem>
                      <SelectItem value="Office">Office Space</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Bedsitter">Bedsitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-type">Price Type *</Label>
                  <Select 
                    value={(formData as PropertyFormData).price_type} 
                    onValueChange={(value) => updateFormData('price_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Per Month</SelectItem>
                      <SelectItem value="night">Per Night</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managed-by">Managed By *</Label>
                  <Select 
                    value={(formData as PropertyFormData).managed_by} 
                    onValueChange={(value) => updateFormData('managed_by', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select management type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landlord">Landlord</SelectItem>
                      <SelectItem value="agency">Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featured">Featured Property</Label>
                  <Select 
                    value={(formData as PropertyFormData).featured ? 'yes' : 'no'} 
                    onValueChange={(value) => updateFormData('featured', value === 'yes')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Featured?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData as PropertyFormData).managed_by === 'landlord' && (
                <div className="space-y-2">
                  <Label htmlFor="landlord-name">Landlord Name</Label>
                  <Input
                    id="landlord-name"
                    value={(formData as PropertyFormData).landlord_name || ''}
                    onChange={(e) => updateFormData('landlord_name', e.target.value)}
                    placeholder="Enter landlord name"
                  />
                </div>
              )}

              {(formData as PropertyFormData).managed_by === 'agency' && (
                <div className="space-y-2">
                  <Label htmlFor="agency-name">Agency Name</Label>
                  <Input
                    id="agency-name"
                    value={(formData as PropertyFormData).agency_name || ''}
                    onChange={(e) => updateFormData('agency_name', e.target.value)}
                    placeholder="Enter agency name"
                  />
                </div>
              )}
            </>
          )}

          {/* Marketplace-specific fields */}
          {type === 'marketplace' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={(formData as MarketplaceFormData).category} 
                  onValueChange={(value) => updateFormData('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select 
                  value={(formData as MarketplaceFormData).condition} 
                  onValueChange={(value) => updateFormData('condition', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={(formData as any).description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Enter detailed description..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || createProperty.isPending || createMarketplaceItem.isPending || images.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {uploading || createProperty.isPending || createMarketplaceItem.isPending ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminListingForm;