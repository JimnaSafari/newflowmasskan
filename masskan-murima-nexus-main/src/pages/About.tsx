import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Shield, Award } from "lucide-react";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About Us | Masskan Rima";
  }, []);

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the safety and security of all our clients with verified listings and secure transactions."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building strong communities by connecting people with quality homes and services across Kenya."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing exceptional service and maintaining the highest standards in everything we do."
    },
    {
      icon: CheckCircle,
      title: "Reliability",
      description: "Dependable platform with transparent processes and responsive customer support when you need it."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Clients" },
    { number: "5,000+", label: "Properties Listed" },
    { number: "50+", label: "Cities Covered" },
    { number: "99%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <PageHero 
        title="About Masskan Rima"
        subtitle="Your trusted partner for property rentals, moving services, and marketplace solutions across Kenya."
        imageUrl="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop"
      />

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Founded with a vision to simplify property rentals and moving services in Kenya, 
              Masskan Rima has grown to become a trusted platform connecting thousands of 
              property seekers with quality homes and reliable service providers.
            </p>
            <p className="text-lg text-muted-foreground">
              We understand the challenges of finding the perfect home or office space, 
              which is why we've created a comprehensive platform that brings together 
              rentals, Airbnb stays, office spaces, moving services, and a marketplace 
              for buying and selling items.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground">
              To revolutionize the way people find homes, offices, and services in Kenya 
              by providing a reliable, transparent, and user-friendly platform that 
              connects communities and empowers both property owners and seekers.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Samuel Karanja - CEO */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img 
                  src="/team/samuel-karanja.jpg" 
                  alt="Samuel Karanja" 
                  className="w-full h-80 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Samuel Karanja</h3>
              <p className="text-primary font-medium mb-3">Chief Executive Officer (CEO)</p>
              <p className="text-muted-foreground">Leading the vision and strategy of Masskan Rima.</p>
            </div>

            {/* Brian Cheruiyot - CFO */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img 
                  src="/team/brian-cheruiyot.jpg" 
                  alt="Brian Cheruiyot" 
                  className="w-full h-80 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Brian Cheruiyot</h3>
              <p className="text-primary font-medium mb-3">Chief Financial Officer (CFO)</p>
              <p className="text-muted-foreground">Managing financial operations and growth initiatives.</p>
            </div>

            {/* Dennis Ndungu - COO */}
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img 
                  src="/team/dennis-ndungu.jpg" 
                  alt="Dennis Ndungu" 
                  className="w-full h-80 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dennis Ndungu</h3>
              <p className="text-primary font-medium mb-3">Chief Operating Officer (COO)</p>
              <p className="text-muted-foreground">Overseeing daily operations and platform excellence.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
