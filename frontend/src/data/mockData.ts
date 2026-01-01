export const mockStudents = [
  {
    id: "1",
    name: "Michael Chen",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@email.com",
    group: "IELTS Advanced",
    overallScore: 7.5,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Sofia Rodriguez",
    firstName: "Sofia",
    lastName: "Rodriguez",
    email: "sofia.r@email.com",
    group: "IELTS Intermediate",
    overallScore: 6.5,
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Raj Patel",
    firstName: "Raj",
    lastName: "Patel",
    email: "raj.patel@email.com",
    group: "IELTS Advanced",
    overallScore: 7.0,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Emily Zhang",
    firstName: "Emily",
    lastName: "Zhang",
    email: "emily.z@email.com",
    group: "IELTS Beginner",
    overallScore: 5.5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "Ahmed Hassan",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.h@email.com",
    group: "IELTS Intermediate",
    overallScore: 6.0,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "6",
    name: "Maria Silva",
    firstName: "Maria",
    lastName: "Silva",
    email: "maria.silva@email.com",
    group: "IELTS Advanced",
    overallScore: 7.5,
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
  },
];

export const mockTeachers = [
  {
    id: "1",
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@ielts.com",
    specialization: "Speaking & Writing",
    students: 24,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "James Anderson",
    firstName: "James",
    lastName: "Anderson",
    email: "james.a@ielts.com",
    specialization: "Reading & Listening",
    students: 28,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Linda Wu",
    firstName: "Linda",
    lastName: "Wu",
    email: "linda.w@ielts.com",
    specialization: "All Skills",
    students: 32,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Robert Taylor",
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.t@ielts.com",
    specialization: "Academic Writing",
    students: 20,
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
  },
];

export const mockGroups = [
  {
    id: "1",
    name: "IELTS Advanced",
    level: "Advanced",
    students: 12,
    teacher: "Sarah Johnson",
    schedule: "Mon, Wed, Fri 18:00-20:00",
  },
  {
    id: "2",
    name: "IELTS Intermediate",
    level: "Intermediate",
    students: 15,
    teacher: "James Anderson",
    schedule: "Tue, Thu 17:00-19:00",
  },
  {
    id: "3",
    name: "IELTS Beginner",
    level: "Beginner",
    students: 18,
    teacher: "Linda Wu",
    schedule: "Mon, Wed 16:00-18:00",
  },
  {
    id: "4",
    name: "IELTS Intensive",
    level: "Advanced",
    students: 8,
    teacher: "Robert Taylor",
    schedule: "Daily 10:00-14:00",
  },
];

export const mockGrades = [
  {
    studentId: "1",
    studentName: "Michael Chen",
    listening: 8.0,
    reading: 7.5,
    writing: 7.0,
    speaking: 7.5,
    overall: 7.5,
    date: "2024-12-15",
    group: "IELTS Advanced",
  },
  {
    studentId: "2",
    studentName: "Sofia Rodriguez",
    listening: 6.5,
    reading: 7.0,
    writing: 6.0,
    speaking: 6.5,
    overall: 6.5,
    date: "2024-12-15",
    group: "IELTS Intermediate",
  },
  {
    studentId: "3",
    studentName: "Raj Patel",
    listening: 7.5,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0,
    overall: 7.0,
    date: "2024-12-15",
    group: "IELTS Advanced",
  },
  {
    studentId: "4",
    studentName: "Emily Zhang",
    listening: 5.5,
    reading: 6.0,
    writing: 5.0,
    speaking: 5.5,
    overall: 5.5,
    date: "2024-12-10",
    group: "IELTS Beginner",
  },
  {
    studentId: "5",
    studentName: "Ahmed Hassan",
    listening: 6.0,
    reading: 6.5,
    writing: 5.5,
    speaking: 6.0,
    overall: 6.0,
    date: "2024-12-12",
    group: "IELTS Intermediate",
  },
];

export const mockTenants = [
  {
    id: "t1",
    name: "IELTS Excellence Center",
    location: "New York",
    students: 245,
    teachers: 12,
    status: "active",
  },
  {
    id: "t2",
    name: "Global IELTS Academy",
    location: "London",
    students: 189,
    teachers: 8,
    status: "active",
  },
  {
    id: "t3",
    name: "Success IELTS Institute",
    location: "Toronto",
    students: 320,
    teachers: 15,
    status: "active",
  },
  {
    id: "t4",
    name: "Premier IELTS School",
    location: "Sydney",
    students: 156,
    teachers: 6,
    status: "trial",
  },
];

export const dashboardStats = {
  teacher: {
    totalStudents: 24,
    activeGroups: 3,
    upcomingClasses: 8,
    avgScore: 7.2,
    recentActivity: [
      {
        type: "grade",
        message: "Graded Michael Chen - Overall 7.5",
        time: "2 hours ago",
      },
      {
        type: "class",
        message: "Completed Advanced Speaking class",
        time: "5 hours ago",
      },
      {
        type: "grade",
        message: "Graded Sofia Rodriguez - Overall 6.5",
        time: "1 day ago",
      },
    ],
  },
  student: {
    overallScore: 7.5,
    completedLessons: 32,
    upcomingClasses: 3,
    progressPercentage: 75,
    skillScores: {
      listening: 8.0,
      reading: 7.5,
      writing: 7.0,
      speaking: 7.5,
    },
  },
  tenantAdmin: {
    totalStudents: 245,
    totalTeachers: 12,
    activeGroups: 8,
    revenue: 42500,
    recentEnrollments: 18,
  },
  saasAdmin: {
    totalTenants: 24,
    activeTenants: 20,
    totalStudents: 3245,
    totalRevenue: 125000,
  },
};
