import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, Plus, Upload } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCreateMovingService } from "@/hooks/useListings";
import { toast } from "sonner";

const MovingServiceForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploading } = useImageUpload("moving-service-images");
  const createMovingService = useCreateMovingService();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location || !priceRange || !imageFile) {
      toast.error("Please fill all required fields and add an image");
      return;
    }

    try {
      const imageUrl = await uploadImage(imageFile);
      await createMovingService.mutateAsync({
        name,
        location,
        price_range: priceRange,
        image: imageUrl,
        description: description || undefined,
      });
      toast.success("Moving service created successfully!");
      setIsOpen(false);
      setName("");
      setLocation("");
      setPriceRange("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create moving service";
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Moving Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Moving Service</DialogTitle>
          <DialogDescription>Provide details about the moving company/service</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Logo / Image</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors h-40 flex flex-col justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-contain" />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Click to upload</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ms-name">Service Name</Label>
              <Input id="ms-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ms-location">Location</Label>
              <Input id="ms-location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ms-price">Price Range</Label>
            <Input id="ms-price" placeholder="e.g. KSh 5,000 - 50,000" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ms-desc">Description (optional)</Label>
            <Textarea id="ms-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={uploading || createMovingService.isPending}>
              {uploading || createMovingService.isPending ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovingServiceForm;
