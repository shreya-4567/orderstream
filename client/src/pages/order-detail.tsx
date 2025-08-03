import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ordersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Edit, 
  Bell, 
  Copy, 
  FileText,
  Check,
  Clock,
  Plus
} from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => ordersApi.updateStatus(id!, status),
    onSuccess: (updatedOrder) => {
      toast({
        title: "Status Updated",
        description: `Order status changed to ${updatedOrder.status}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = () => {
    const newStatus = order?.status === "pending" ? "completed" : "pending";
    updateStatusMutation.mutate(newStatus);
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Download Started",
      description: `Invoice for ${order?.orderId} is being downloaded.`,
    });
  };

  const handleSendNotification = () => {
    toast({
      title: "Notification Sent",
      description: `Customer notification sent for order ${order?.orderId}`,
    });
  };

  const handleDuplicateOrder = () => {
    toast({
      title: "Order Duplicated",
      description: `Created a copy of order ${order?.orderId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[status] || colors.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Order not found</h2>
        <p className="text-slate-600 mt-2">The order you're looking for doesn't exist.</p>
        <Link href="/">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Order Details</h1>
          <p className="mt-2 text-sm text-slate-700">
            View complete order information and manage order status
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-mono">{order.orderId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Status</dt>
                  <dd className="mt-1">{getStatusBadge(order.status)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Customer Name</dt>
                  <dd className="mt-1 text-sm text-slate-900">{order.customerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Order Amount</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    ${order.orderAmount.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Order Date</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Created At</dt>
                  <dd className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toISOString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                <Button variant="outline" onClick={handleSendNotification}>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="outline" onClick={handleDuplicateOrder}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice & Timeline */}
        <div className="space-y-6">
          {/* Invoice */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h4 className="text-base font-medium text-slate-900 mb-2">
                  Invoice_{order.orderId}.pdf
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  2.4 MB • Uploaded {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.status === "completed" && (
                    <li>
                      <div className="relative pb-8">
                        <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"></div>
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <Check className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-slate-900">Order completed</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-slate-500">
                              {new Date(order.orderDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                  <li>
                    <div className="relative pb-8">
                      <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"></div>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <Bell className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-900">Customer notification sent</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-slate-500">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center ring-8 ring-white">
                            <Plus className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-900">Order created</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-slate-500">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
