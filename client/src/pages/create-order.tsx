import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { insertOrderSchema, type InsertOrder } from "@shared/schema";
import { ordersApi, uploadApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CloudUpload, 
  FileText, 
  X,
  Loader2 
} from "lucide-react";

export default function CreateOrder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      customerName: "",
      orderAmount: 0,
      orderDate: new Date().toISOString().split('T')[0],
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      toast({
        title: "Order Created",
        description: `Order ${order.orderId} has been created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setTimeout(() => setLocation("/"), 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadApi.uploadFile(file);
      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: "Invoice file uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const onSubmit = (data: InsertOrder) => {
    if (!uploadedFile) {
      toast({
        title: "Missing Invoice",
        description: "Please upload an invoice file.",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create New Order</h1>
          <p className="mt-2 text-sm text-slate-700">
            Add a new order to the system with customer details and invoice
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

      <div className="max-w-3xl space-y-6">
        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    {...form.register("customerName")}
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderAmount">Order Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      $
                    </span>
                    <Input
                      id="orderAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      {...form.register("orderAmount", { valueAsNumber: true })}
                    />
                  </div>
                  {form.formState.errors.orderAmount && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.orderAmount.message}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Invoice Upload</Label>
                {!uploadedFile ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                    <CloudUpload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="mt-4">
                      <Label
                        htmlFor="invoice-file"
                        className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Upload a file
                      </Label>
                      <span className="text-slate-600"> or drag and drop</span>
                      <Input
                        id="invoice-file"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">PDF up to 10MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {isUploading && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={createOrderMutation.isPending || isUploading}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Order"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Order Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Customer Name</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {watchedValues.customerName || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Order Amount</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    ${(watchedValues.orderAmount || 0).toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Order Date</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {watchedValues.orderDate ? 
                      new Date(watchedValues.orderDate).toLocaleDateString() : 
                      "Today"
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Invoice</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {uploadedFile ? uploadedFile.name : "No file selected"}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
