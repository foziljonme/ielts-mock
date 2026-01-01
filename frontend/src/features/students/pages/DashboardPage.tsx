import {
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { dashboardStats } from "../../../data/mockData";

const progressData = [{ name: "Progress", value: 75, fill: "#3b82f6" }];

const performanceData = [
  { week: "Week 1", score: 6.5 },
  { week: "Week 2", score: 6.8 },
  { week: "Week 3", score: 7.0 },
  { week: "Week 4", score: 7.2 },
  { week: "Week 5", score: 7.5 },
];

const upcomingClasses = [
  {
    title: "Speaking Practice",
    time: "Today, 18:00",
    instructor: "Sarah Johnson",
  },
  {
    title: "Writing Skills",
    time: "Tomorrow, 16:00",
    instructor: "Sarah Johnson",
  },
  {
    title: "Reading Comprehension",
    time: "Wed, 18:00",
    instructor: "Sarah Johnson",
  },
];

export default function DashboardPage() {
  const stats = dashboardStats.student;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Track your IELTS preparation progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Overall
            </span>
          </div>
          <h3 className="text-3xl mb-1">{stats.overallScore}</h3>
          <p className="text-sm opacity-90">Current Score</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            {stats.completedLessons}
          </h3>
          <p className="text-sm text-gray-600">Lessons Completed</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            {stats.upcomingClasses}
          </h3>
          <p className="text-sm text-gray-600">Upcoming Classes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl text-gray-900 mb-1">
            {stats.progressPercentage}%
          </h3>
          <p className="text-sm text-gray-600">Course Progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Overall Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={progressData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-32">
            <p className="text-3xl text-gray-900">
              {stats.progressPercentage}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#666" />
              <YAxis domain={[6, 8]} stroke="#666" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Skills Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(stats.skillScores).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700 capitalize">
                    {skill}
                  </span>
                  <span className="text-sm text-gray-900">{score}/9.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(score / 9) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg text-gray-900 mb-6">Upcoming Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((cls, index) => (
              <div
                key={index}
                className="flex gap-4 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{cls.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{cls.instructor}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cls.time}
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
