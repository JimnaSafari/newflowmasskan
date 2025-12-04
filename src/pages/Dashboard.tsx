import React from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUserBookings } from '@/hooks/useBookings';
import { useUserPurchases } from '@/hooks/usePurchases';
import { useUserQuotes } from '@/hooks/useQuotes';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Calendar, MapPin, Package, Home, Clock, CheckCircle, XCircle, Truck, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: number | string, icon: React.ElementType, description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useUserBookings();
  const { data: purchases, isLoading: purchasesLoading, error: purchasesError, refetch: refetchPurchases } = useUserPurchases();
  const { data: quotes, isLoading: quotesLoading, error: quotesError, refetch: refetchQuotes } = useUserQuotes();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const totalBookings = bookings?.length || 0;
  const totalPurchases = purchases?.length || 0;
  const totalQuotes = quotes?.length || 0;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-background to-muted/20 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile?.full_name || user?.email}!</h1>
            <p className="text-muted-foreground">Here's a summary of your activity.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard title="Total Bookings" value={totalBookings} icon={Home} description="Your property reservations" />
            <StatCard title="Total Purchases" value={totalPurchases} icon={Package} description="Items from the marketplace" />
            <StatCard title="Moving Quotes" value={totalQuotes} icon={Truck} description="Your requested quotes" />
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings" className="flex items-center gap-2"><Home className="h-4 w-4" />My Bookings</TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-2"><Package className="h-4 w-4" />My Purchases</TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2"><Truck className="h-4 w-4" />Moving Quotes</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Property Bookings</CardTitle>
                  <CardDescription>Your rental and Airbnb bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? <LoadingSpinner /> : bookingsError ? <ErrorMessage onRetry={refetchBookings} /> : (
                    bookings && bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="p-4 border rounded-lg flex items-start gap-4 hover:bg-muted/50 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0">
                              {booking.property?.image && <img src={booking.property.image} alt={booking.property.title} className="w-full h-full object-cover rounded-lg" />}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold">{booking.property?.title || 'Property'}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" />{booking.property?.location}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-3 w-3" />{format(new Date(booking.booking_date), 'PPP')}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              <p className="text-xs text-muted-foreground mt-2">Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">You haven't booked any properties yet.</p>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases">
              <Card>
                <CardHeader>
                  <CardTitle>Marketplace Purchases</CardTitle>
                  <CardDescription>Items you've purchased from the marketplace.</CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasesLoading ? <LoadingSpinner /> : purchasesError ? <ErrorMessage onRetry={refetchPurchases} /> : (
                    purchases && purchases.length > 0 ? (
                      <div className="space-y-4">
                        {purchases.map((purchase) => (
                          <div key={purchase.id} className="p-4 border rounded-lg flex items-start gap-4 hover:bg-muted/50 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0">
                              {purchase.item?.image && <img src={purchase.item.image} alt={purchase.item.title} className="w-full h-full object-cover rounded-lg" />}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold">{purchase.item?.title || 'Item'}</h3>
                              <p className="text-sm text-muted-foreground">{purchase.item?.category}</p>
                              <p className="font-bold text-primary mt-1">KSh {purchase.purchase_price.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(purchase.status)}>{purchase.status}</Badge>
                              <p className="text-xs text-muted-foreground mt-2">Purchased on {format(new Date(purchase.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No purchases yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">You haven't purchased any items yet.</p>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>Moving Quotes</CardTitle>
                  <CardDescription>Your requested quotes for moving services.</CardDescription>
                </CardHeader>
                <CardContent>
                  {quotesLoading ? <LoadingSpinner /> : quotesError ? <ErrorMessage onRetry={refetchQuotes} /> : (
                    quotes && quotes.length > 0 ? (
                      <div className="space-y-4">
                        {quotes.map((quote) => (
                          <div key={quote.id} className="p-4 border rounded-lg flex items-start gap-4 hover:bg-muted/50 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0">
                              {quote.service?.image && <img src={quote.service.image} alt={quote.service.name} className="w-full h-full object-cover rounded-lg" />}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold">{quote.service?.name || 'Moving Service'}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" />{quote.pickup_location} to {quote.delivery_location}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-3 w-3" />Moving on {format(new Date(quote.moving_date), 'PPP')}</p>
                              {quote.quote_amount && <p className="font-bold text-primary mt-1">Quoted: KSh {quote.quote_amount.toLocaleString()}</p>}
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                              <p className="text-xs text-muted-foreground mt-2">Requested on {format(new Date(quote.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No quotes yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">You haven't requested any moving quotes yet.</p>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
