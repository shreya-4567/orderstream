import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Sales Analytics</h1>
          <p className="mt-2 text-sm text-slate-700">
            Track performance and analyze order trends
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 mb-4" />
                <p className="font-medium">Revenue Chart Placeholder</p>
                <p className="text-sm mt-2">Implement with Chart.js or Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <p className="font-medium">Order Volume Chart Placeholder</p>
                <p className="text-sm mt-2">Implement with Chart.js or Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
