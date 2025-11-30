import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { HeadphonesIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function SupportDashboard() {
  const { tickets, users, updateTicket, currentUser } = useApp();
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [response, setResponse] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateStatus = (ticketId: string, status: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    updateTicket(ticketId, { status, assignedTo: currentUser?.id });
    toast.success(`Ticket marked as ${status}`);
  };

  const handleAssignToMe = (ticketId: string) => {
    updateTicket(ticketId, { 
      status: 'in-progress', 
      assignedTo: currentUser?.id 
    });
    toast.success('Ticket assigned to you');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    myTickets: tickets.filter(t => t.assignedTo === currentUser?.id).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Support Dashboard</h1>
          <p className="text-gray-600">Manage customer inquiries and support tickets</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Tickets</CardDescription>
              <CardTitle className="text-3xl">{stats.open}</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertCircle className="size-8 text-yellow-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <Clock className="size-8 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved Today</CardDescription>
              <CardTitle className="text-3xl">{stats.resolved}</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckCircle2 className="size-8 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>My Tickets</CardDescription>
              <CardTitle className="text-3xl">{stats.myTickets}</CardTitle>
            </CardHeader>
            <CardContent>
              <HeadphonesIcon className="size-8 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Support Tickets</CardTitle>
                <CardDescription>Complete list of customer support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <div className="py-12 text-center text-gray-600">
                    No support tickets yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map(ticket => {
                        const user = users.find(u => u.id === ticket.userId);
                        return (
                          <TableRow key={ticket.id}>
                            <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                            <TableCell>{user?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedTicket(ticket.id)}
                                  >
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{ticket.subject}</DialogTitle>
                                    <DialogDescription>
                                      From: {user?.name} ({user?.email})
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex gap-2">
                                      <Badge className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority}
                                      </Badge>
                                      <Badge className={getStatusColor(ticket.status)}>
                                        {ticket.status}
                                      </Badge>
                                    </div>
                                    
                                    <div>
                                      <p className="text-sm mb-2">Message:</p>
                                      <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm">{ticket.message}</p>
                                      </div>
                                    </div>

                                    <div className="flex gap-2">
                                      {ticket.status === 'open' && (
                                        <Button onClick={() => {
                                          handleAssignToMe(ticket.id);
                                        }}>
                                          Assign to Me
                                        </Button>
                                      )}
                                      {ticket.status === 'in-progress' && (
                                        <Button onClick={() => handleUpdateStatus(ticket.id, 'resolved')}>
                                          Mark Resolved
                                        </Button>
                                      )}
                                      {ticket.status === 'resolved' && (
                                        <Button onClick={() => handleUpdateStatus(ticket.id, 'closed')}>
                                          Close Ticket
                                        </Button>
                                      )}
                                      {ticket.status !== 'open' && ticket.status !== 'closed' && (
                                        <Button 
                                          variant="outline"
                                          onClick={() => handleUpdateStatus(ticket.id, 'open')}
                                        >
                                          Reopen
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="open">
            <Card>
              <CardHeader>
                <CardTitle>Open Tickets</CardTitle>
                <CardDescription>Unassigned support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.filter(t => t.status === 'open').length === 0 ? (
                  <div className="py-12 text-center text-gray-600">
                    No open tickets
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.filter(t => t.status === 'open').map(ticket => {
                      const user = users.find(u => u.id === ticket.userId);
                      return (
                        <Card key={ticket.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                <CardDescription>From: {user?.name}</CardDescription>
                              </div>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{ticket.message}</p>
                            <Button size="sm" onClick={() => handleAssignToMe(ticket.id)}>
                              Assign to Me
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assigned">
            <Card>
              <CardHeader>
                <CardTitle>My Assigned Tickets</CardTitle>
                <CardDescription>Tickets assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.filter(t => t.assignedTo === currentUser?.id).length === 0 ? (
                  <div className="py-12 text-center text-gray-600">
                    No tickets assigned to you
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.filter(t => t.assignedTo === currentUser?.id).map(ticket => {
                      const user = users.find(u => u.id === ticket.userId);
                      return (
                        <Card key={ticket.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                <CardDescription>From: {user?.name}</CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                                <Badge className={getStatusColor(ticket.status)}>
                                  {ticket.status}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{ticket.message}</p>
                            <div className="flex gap-2">
                              {ticket.status === 'in-progress' && (
                                <Button size="sm" onClick={() => handleUpdateStatus(ticket.id, 'resolved')}>
                                  Mark Resolved
                                </Button>
                              )}
                              {ticket.status === 'resolved' && (
                                <Button size="sm" onClick={() => handleUpdateStatus(ticket.id, 'closed')}>
                                  Close Ticket
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Tickets</CardTitle>
                <CardDescription>Successfully resolved support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length === 0 ? (
                  <div className="py-12 text-center text-gray-600">
                    No resolved tickets
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resolved</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').map(ticket => {
                        const user = users.find(u => u.id === ticket.userId);
                        return (
                          <TableRow key={ticket.id}>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{user?.name}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(ticket.updatedAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
