import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Users, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    document.title = "Contact Us | Masskan Rima";
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };
  const contactInfo = [{
    icon: Phone,
    title: "Phone",
    details: ["+254 700 123 456", "+254 711 987 654"],
    description: "Call us Monday to Friday, 8AM - 6PM"
  }, {
    icon: Mail,
    title: "Email",
    details: ["info@masskanrima.com", "support@masskanrima.com"],
    description: "We'll respond within 24 hours"
  }, {
    icon: MapPin,
    title: "Office",
    details: ["Westlands, Nairobi", "Kenya"],
    description: "Visit us for in-person consultations"
  }, {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 8AM - 6PM", "Sat: 9AM - 4PM"],
    description: "Sunday: Closed"
  }];
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Modern Hero Section */}
      <section className="relative py-24 bg-orange-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Let's Start a
              <span className="text-blue-600"> Conversation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Ready to find your dream home or get expert moving services?
              Our team of professionals is here to make your experience seamless and enjoyable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-orange-100 backdrop-blur rounded-full px-6 py-3 shadow-lg">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Expert Team</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 backdrop-blur rounded-full px-6 py-3 shadow-lg">
                <Award className="h-5 w-5 text-orange-600" />
                <span className="font-medium">5-Star Service</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-100 backdrop-blur rounded-full px-6 py-3 shadow-lg">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-orange-600 max-w-2xl mx-auto">
              Choose the method that works best for you. We're always just a call, email, or visit away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{info.title}</h3>
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="font-semibold text-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-blue-600 mb-6">
                    Send Us a Message
                  </h2>
                  <p className="text-lg text-orange-600 leading-relaxed">
                    Have questions about our services? Need help finding the perfect property?
                    Or want to discuss your moving needs? We're here to help!
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Quick Response</h3>
                      <p className="text-muted-foreground">We typically respond within 2 hours during business days</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Expert Support</h3>
                      <p className="text-muted-foreground">Our team has over 10 years of combined experience</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Quality Guarantee</h3>
                      <p className="text-muted-foreground">100% satisfaction guarantee on all our services</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                          className="h-12 border-2 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                          className="h-12 border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+254 700 123 456"
                          className="h-12 border-2 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-semibold text-foreground">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="How can we help?"
                          className="h-12 border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold text-foreground">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="border-2 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send className="h-5 w-5" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/80 font-medium">Happy Clients</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-white/80 font-medium">Properties Listed</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-white/80 font-medium">Expert Agents</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
              <div className="text-white/80 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-orange-600 max-w-2xl mx-auto">
              Located in the heart of Westlands, Nairobi. Easy access by car or public transport.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-12 w-12 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Westlands, Nairobi</h3>
                    <p className="text-muted-foreground">Kenya</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Directions
                  </Button>
                </div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop')] bg-cover bg-center opacity-25"></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-orange-600 max-w-2xl mx-auto">
              Quick answers to common questions about our services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  How quickly can you respond to my inquiry?
                </h3>
                <p className="text-muted-foreground">
                  We typically respond within 2 hours during business days and within 24 hours on weekends.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Do you offer virtual consultations?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We offer video calls, phone consultations, and email support for your convenience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  What areas do you serve?
                </h3>
                <p className="text-muted-foreground">
                  We serve the entire Nairobi metropolitan area and can assist with properties nationwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Contact;
