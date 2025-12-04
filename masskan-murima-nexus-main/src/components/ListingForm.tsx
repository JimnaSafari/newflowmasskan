import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Plus, Bed, Bath, Square } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCreateProperty } from '@/hooks/useListings';
import { useCreateMarketplaceItem } from '@/hooks/useListings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ListingFormProps {
  type: 'property' | 'marketplace';
}

interface PropertyFormData {
  title?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  price_type?: string;
  managed_by?: string;
  description?: string;
}

interface MarketplaceFormData {
  title?: string;
  location?: string;
  price?: number;
  category?: string;
  condition?: string;
  description?: string;
}

type FormData = PropertyFormData & MarketplaceFormData;

const ListingForm = ({ type }: ListingFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
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
      const newImages = [...images, ...files].slice(0, 6); // Maximum 6 images
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

    if (images.length < 3) {
      toast.error("Please upload at least 3 images");
      return;
    }

    try {
      // Upload all images
      const imageUrls = await Promise.all(
        images.map(image => uploadImage(image))
      );
      const primaryImageUrl = imageUrls[0];

      if (type === 'property') {
        const propertyData = {
          ...formData,
          image: primaryImageUrl,
          images: imageUrls,
          managed_by: formData.managed_by!,
          title: formData.title!,
          location: formData.location!,
          price: formData.price!,
          bedrooms: formData.bedrooms!,
          bathrooms: formData.bathrooms!,
          area: formData.area!,
          type: formData.type!,
          price_type: formData.price_type!,
        };
        await createProperty.mutateAsync(propertyData);
        toast.success("Property listed successfully!");
      } else {
        const marketplaceData = {
          ...formData,
          image: primaryImageUrl,
          images: imageUrls,
          title: formData.title!,
          location: formData.location!,
          price: formData.price!,
          category: formData.category!,
          condition: formData.condition!,
        };
        await createMarketplaceItem.mutateAsync(marketplaceData);
        toast.success("Item listed successfully!");
      }

      setIsOpen(false);
      setFormData({});
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create listing";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          List {type === 'property' ? 'Property' : 'Item'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {type === 'property' ? 'Property' : 'Marketplace'} Listing</DialogTitle>
          <DialogDescription>
            Fill in the details to create your listing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multiple Image Upload */}
          <div className="space-y-2">
            <Label>Property Images (At least 3 required)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors h-32 flex flex-col justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Add Image</p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload {images.length}/6 images (minimum 3 required)
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

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (KSh)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
              required
            />
          </div>

          {type === 'property' ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => setFormData({...formData, area: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rental">Rental</SelectItem>
                      <SelectItem value="Airbnb">Airbnb</SelectItem>
                      <SelectItem value="Office">Office Space</SelectItem>
                      <SelectItem value="bedsitter">Bedsitter</SelectItem>
                      <SelectItem value="single">Single Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_type">Price Type</Label>
                  <Select value={formData.price_type} onValueChange={(value) => setFormData({...formData, price_type: value})}>
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
              <div className="space-y-2">
                <Label htmlFor="managed_by">Managed By</Label>
                <Select value={formData.managed_by} onValueChange={(value) => setFormData({...formData, managed_by: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select management" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || createProperty.isPending || createMarketplaceItem.isPending || (type === 'property' && images.length < 3)}
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListingForm;
