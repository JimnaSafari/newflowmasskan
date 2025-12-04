import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { UserCog, Shield, Users, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_verified: boolean;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  updated_at: string;
  email?: string;
}

const UserManagement = () => {
  const queryClient = useQueryClient();

  // Fetch all users with their profiles
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      // First get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Then get their profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profileError) throw profileError;

      // Combine auth users with profiles
      const combinedUsers: UserProfile[] = authUsers.users.map(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);
        return {
          ...profile,
          email: authUser.email,
          id: authUser.id,
          role: (profile?.role as 'admin' | 'moderator' | 'user') || 'user',
          created_at: profile?.created_at || authUser.created_at,
          updated_at: profile?.updated_at || authUser.updated_at,
        } as UserProfile;
      });

      return combinedUsers;
    },
  });

  // Update user role mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("User role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user role");
    },
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'user':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'moderator':
        return <UserCog className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserRole.mutate({ userId, newRole });
  };

  const UserStats = () => {
    const adminCount = users?.filter(u => u.role === 'admin').length || 0;
    const moderatorCount = users?.filter(u => u.role === 'moderator').length || 0;
    const userCount = users?.filter(u => u.role === 'user').length || 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Administrators</p>
                <p className="text-2xl font-bold text-red-600">{adminCount}</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moderators</p>
                <p className="text-2xl font-bold text-blue-600">{moderatorCount}</p>
              </div>
              <UserCog className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regular Users</p>
                <p className="text-2xl font-bold text-gray-600">{userCount}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserStats />

          {isLoading ? (
            <LoadingSpinner />
          ) : users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name || 'User'}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-primary">
                              {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {user.full_name || 'Unnamed User'}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                            <Calendar className="h-4 w-4" />
                            Joined {format(new Date(user.created_at), 'MMM dd, yyyy')}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground">
                              Phone: {user.phone}
                            </div>
                          )}
                          {user.is_verified && (
                            <Badge variant="secondary" className="mt-2">
                              Verified Account
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last updated: {format(new Date(user.updated_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
