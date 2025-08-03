import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import OrderStats from "@/components/orders/order-stats";
import OrdersTable from "@/components/orders/orders-table";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Orders Dashboard</h1>
          <p className="mt-2 text-sm text-slate-700">
            Manage and track all your orders in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStats />

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
