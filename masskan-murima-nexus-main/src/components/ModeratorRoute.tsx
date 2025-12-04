import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

interface ModeratorRouteProps {
  children: React.ReactNode;
}

const ModeratorRoute: React.FC<ModeratorRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Allow both admin and moderator roles
  const hasAccess = profile?.role === 'admin' || profile?.role === 'moderator';

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p className="text-muted-foreground">
                  You don't have permission to access this page. Administrator or moderator privileges required.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>This page is restricted to administrators and moderators only</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you are an administrator or moderator, please use the Admin Portal to log in.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/admin-login'}
                  className="w-full"
                >
                  Go to Admin Portal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ModeratorRoute;
