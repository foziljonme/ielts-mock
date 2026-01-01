import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardStats, mockTenants } from "../../../data/mockData";

const revenueData = [
  { month: "Jul", revenue: 98000 },
  { month: "Aug", revenue: 105000 },
  { month: "Sep", revenue: 112000 },
  { month: "Oct", revenue: 118000 },
  { month: "Nov", revenue: 122000 },
  { month: "Dec", revenue: 125000 },
];

export default function SaasAdminDashboardPage() {
  const stats = dashboardStats.saasAdmin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">SaaS Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-3xl mb-1">{stats.totalTenants}</h3>
          <p className="text-sm opacity-90">Total Tenants</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.activeTenants}</h3>
          <p className="text-sm text-gray-600">Active Tenants</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            {stats.totalStudents.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            ${stats.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Monthly Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Tenant Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { month: "Jul", tenants: 18 },
                { month: "Aug", tenants: 19 },
                { month: "Sep", tenants: 20 },
                { month: "Oct", tenants: 21 },
                { month: "Nov", tenants: 23 },
                { month: "Dec", tenants: 24 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="tenants" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">All Tenants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-gray-700">
                  Tenant
                </th>
                <th className="text-left px-6 py-4 text-sm text-gray-700">
                  Location
                </th>
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Students
                </th>
                <th className="text-center px-6 py-4 text-sm text-gray-700">
                  Teachers
                </th>
                <th className="text-left px-6 py-4 text-sm text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-900">
                        {tenant.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      {tenant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-900">
                      {tenant.students}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-900">
                      {tenant.teachers}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                        tenant.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
