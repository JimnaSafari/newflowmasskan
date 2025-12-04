import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { format } from 'date-fns';
import {
  Calendar, MapPin, Package, Home, Truck, User, Mail, Phone,
  Eye, AlertTriangle, CheckCircle, XCircle, BarChart3, Users
} from 'lucide-react';

const ModeratorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch read-only data for moderator overview
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["moderator_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          properties(title, image, type, location, price, price_type)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["moderator_purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          marketplace_items(title, image, category)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["moderator_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mover_quotes")
        .select(`
          *,
          moving_services(name, image, location, price_range)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: properties } = useQuery({
    queryKey: ["moderator_properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
      case 'completed':
      case 'quoted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const OverviewCard = ({ title, count, icon: Icon, description }: { title: string; count?: number; icon: React.ComponentType<{ className?: string }>; description: string }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count || 0}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  const StatusIndicator = ({ status, type }: { status: string; type: 'booking' | 'purchase' | 'quote' }) => {
    const getStatusIcon = () => {
      switch (status) {
        case 'pending':
          return <AlertTriangle className="h-4 w-4" />;
        case 'confirmed':
        case 'completed':
        case 'quoted':
          return <CheckCircle className="h-4 w-4" />;
        case 'cancelled':
          return <XCircle className="h-4 w-4" />;
        default:
          return <Eye className="h-4 w-4" />;
      }
    };

    return (
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Moderator Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Monitor and oversee platform activities</p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Moderator Access</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            You have view-only access to monitor platform activities. Contact an administrator for approval actions.
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Quotes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OverviewCard
              title="Total Bookings"
              count={bookings?.length}
              icon={Home}
              description="Property reservations"
            />
            <OverviewCard
              title="Total Purchases"
              count={purchases?.length}
              icon={Package}
              description="Marketplace sales"
            />
            <OverviewCard
              title="Moving Quotes"
              count={quotes?.length}
              icon={Truck}
              description="Service requests"
            />
            <OverviewCard
              title="Total Properties"
              count={properties?.length}
              icon={MapPin}
              description="Listed properties"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest bookings and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings?.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.guest_name}</p>
                        <p className="text-sm text-muted-foreground">Booked {booking.properties?.title}</p>
                      </div>
                      <StatusIndicator status={booking.status} type="booking" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Bookings</span>
                    <Badge variant="secondary">
                      {bookings?.filter(b => b.status === 'pending').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Purchases</span>
                    <Badge variant="secondary">
                      {purchases?.filter(p => p.status === 'pending').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Quotes</span>
                    <Badge variant="secondary">
                      {quotes?.filter(q => q.status === 'confirmed').length || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Bookings Overview
              </CardTitle>
              <CardDescription>
                Monitor all property bookings and reservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <LoadingSpinner />
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {booking.properties?.image && (
                              <img
                                src={booking.properties.image}
                                alt={booking.properties.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {booking.properties?.title || 'Property'}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                <MapPin className="h-4 w-4" />
                                {booking.properties?.location}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.booking_date), 'PPP')}
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {booking.guest_name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {booking.guest_email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {booking.guest_phone}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <StatusIndicator status={booking.status} type="booking" />
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              View Only - Contact Admin for Actions
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Marketplace Purchases Overview
              </CardTitle>
              <CardDescription>
                Monitor all marketplace purchases and orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchasesLoading ? (
                <LoadingSpinner />
              ) : purchases && purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id} className="border-l-4 border-l-secondary">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {purchase.marketplace_items?.image && (
                              <img
                                src={purchase.marketplace_items.image}
                                alt={purchase.marketplace_items.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {purchase.marketplace_items?.title || 'Item'}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                <Package className="h-4 w-4" />
                                {purchase.marketplace_items?.category}
                              </div>
                              <div className="text-lg font-bold text-primary mb-2">
                                KSh {purchase.purchase_price.toLocaleString()}
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {purchase.buyer_name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {purchase.buyer_email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {purchase.buyer_phone}
                                </div>
                                {purchase.delivery_address && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {purchase.delivery_address}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <StatusIndicator status={purchase.status} type="purchase" />
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(purchase.created_at), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              View Only - Contact Admin for Actions
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No purchases yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Moving Quotes Overview
              </CardTitle>
              <CardDescription>
                Monitor all moving service quotes and requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <LoadingSpinner />
              ) : quotes && quotes.length > 0 ? (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <Card key={quote.id} className="border-l-4 border-l-accent">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {quote.moving_services?.image && (
                              <img
                                src={quote.moving_services.image}
                                alt={quote.moving_services.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {quote.moving_services?.name || 'Moving Service'}
                              </h3>
                              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(quote.moving_date), 'PPP')}
                              </div>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {quote.client_name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  {quote.client_email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {quote.client_phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {quote.pickup_location} → {quote.delivery_location}
                                </div>
                                {quote.quote_amount && (
                                  <div className="text-lg font-bold text-primary">
                                    KSh {quote.quote_amount.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <StatusIndicator status={quote.status} type="quote" />
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              View Only - Contact Admin for Actions
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No quotes yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorDashboard;
