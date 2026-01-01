import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dashboardStats } from "../../../data/mockData";

const enrollmentData = [
  { month: "Jul", students: 35 },
  { month: "Aug", students: 42 },
  { month: "Sep", students: 38 },
  { month: "Oct", students: 55 },
  { month: "Nov", students: 48 },
  { month: "Dec", students: 62 },
];

const groupDistribution = [
  { name: "Advanced", value: 45, color: "#3b82f6" },
  { name: "Intermediate", value: 35, color: "#8b5cf6" },
  { name: "Beginner", value: 20, color: "#10b981" },
];

export default function TenantAdminDashboardPage() {
  const stats = dashboardStats.tenantAdmin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your IELTS center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.totalStudents}</h3>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.totalTeachers}</h3>
          <p className="text-sm text-gray-600">Total Teachers</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.activeGroups}</h3>
          <p className="text-sm text-gray-600">Active Groups</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            +{stats.recentEnrollments}
          </h3>
          <p className="text-sm text-gray-600">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <h3 className="text-2xl mb-1">${stats.revenue.toLocaleString()}</h3>
          <p className="text-sm opacity-90">Monthly Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">
            Student Enrollment Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Group Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={groupDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {groupDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {groupDistribution.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left">
              <UserPlus className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm text-gray-900">Add Student</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left">
              <GraduationCap className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-900">Add Teacher</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left">
              <BookOpen className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-sm text-gray-900">Create Group</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors text-left">
              <DollarSign className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-sm text-gray-900">View Payments</p>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">New student enrolled</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Payment received</p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">New group created</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
