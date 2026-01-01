import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { dashboardStats, mockStudents } from "../../../data/mockData";

const performanceData = [
  { month: "Aug", score: 6.5 },
  { month: "Sep", score: 6.8 },
  { month: "Oct", score: 7.0 },
  { month: "Nov", score: 7.2 },
  { month: "Dec", score: 7.2 },
];

const skillsData = [
  { skill: "Listening", score: 7.5 },
  { skill: "Reading", score: 7.2 },
  { skill: "Writing", score: 6.8 },
  { skill: "Speaking", score: 7.3 },
];

export default function TeacherDashboardPage() {
  const stats = dashboardStats.teacher;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.totalStudents}</h3>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.activeGroups}</h3>
          <p className="text-sm text-gray-600">Active Groups</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              This Week
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            {stats.upcomingClasses}
          </h3>
          <p className="text-sm text-gray-600">Upcoming Classes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              +0.3
            </span>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">{stats.avgScore}</h3>
          <p className="text-sm text-gray-600">Average Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Student Progress Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis domain={[5, 8]} stroke="#666" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Skills Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="skill" stroke="#666" />
              <YAxis domain={[0, 9]} stroke="#666" />
              <Tooltip />
              <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-4">
            Top Performing Students
          </h2>
          <div className="space-y-3">
            {mockStudents.slice(0, 5).map((student, index) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full text-sm">
                  #{index + 1}
                </div>
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.group}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-900">
                    {student.overallScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
