import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Users, Briefcase, Calendar, Settings, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { UserRole } from '../../contexts/AppContext';

export function AdminDashboard() {
  const { users, professionals, bookings, tickets, deleteUser, updateUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast.success('User deleted successfully');
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUser(userId, { role: newRole });
    toast.success('User role updated');
  };

  const stats = {
    totalUsers: users.length,
    totalProfessionals: professionals.length,
    totalBookings: bookings.length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform settings, users, and services</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <Users className="size-8 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Professionals</CardDescription>
              <CardTitle className="text-3xl">{stats.totalProfessionals}</CardTitle>
            </CardHeader>
            <CardContent>
              <Briefcase className="size-8 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{stats.totalBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="size-8 text-purple-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Tickets</CardDescription>
              <CardTitle className="text-3xl">{stats.openTickets}</CardTitle>
            </CardHeader>
            <CardContent>
              <Settings className="size-8 text-yellow-600" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="professionals">Professionals</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and roles</CardDescription>
                  </div>
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sm:w-64"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: string) => handleRoleChange(user.id, value as UserRole)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="size-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professionals">
            <Card>
              <CardHeader>
                <CardTitle>Professional Listings</CardTitle>
                <CardDescription>Overview of all service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professionals.map(prof => (
                      <TableRow key={prof.id}>
                        <TableCell>{prof.name}</TableCell>
                        <TableCell>{prof.title}</TableCell>
                        <TableCell>{prof.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{prof.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({prof.reviewCount})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{prof.services.length} services</Badge>
                        </TableCell>
                        <TableCell>${prof.hourlyRate}/hr</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Platform-wide booking activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Professional</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map(booking => {
                      const prof = professionals.find(p => p.id === booking.professionalId);
                      const service = prof?.services.find(s => s.id === booking.serviceId);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>{prof?.name || 'Unknown'}</TableCell>
                          <TableCell>{service?.name || 'Unknown'}</TableCell>
                          <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="size-5 text-blue-600" />
                    <CardTitle>Platform Settings</CardTitle>
                  </div>
                  <CardDescription>Configure platform-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="mb-2">Service Categories</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage service categories available on the platform
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Development', 'Design', 'Marketing', 'Consulting', 'Writing', 'Business'].map(cat => (
                        <Badge key={cat} variant="outline">{cat}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="mb-2">Commission Settings</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Platform commission rate for service bookings
                    </p>
                    <div className="flex items-center gap-4">
                      <Input type="number" defaultValue="10" className="w-24" />
                      <span className="text-sm text-gray-600">% per transaction</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="mb-2">Booking Settings</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Configure booking and cancellation policies
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Minimum advance booking</span>
                        <span className="text-sm text-gray-600">24 hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cancellation deadline</span>
                        <span className="text-sm text-gray-600">12 hours before</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="mb-2">Platform Statistics</h4>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue (Estimated)</p>
                        <p className="text-2xl">${(bookings.length * 50).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active This Month</p>
                        <p className="text-2xl">{bookings.filter(b => b.status !== 'cancelled').length}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
