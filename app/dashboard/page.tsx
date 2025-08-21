"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/hooks/auth_hook";
import { t } from "i18next";

// Mock data - replace with actual data from Firebase
const mockData = {
  upcomingClasses: [
    {
      id: 1,
      name: "Computer Science 101",
      time: "9:00 AM",
      location: "Room 204",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Calculus II",
      time: "11:00 AM",
      location: "Math Building 301",
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "English Literature",
      time: "2:00 PM",
      location: "Liberal Arts 105",
      color: "bg-purple-500",
    },
  ],
  upcomingExams: [
    {
      id: 1,
      name: "Midterm - Computer Science 101",
      date: "March 15, 2024",
      daysLeft: 5,
      progress: 60,
    },
    {
      id: 2,
      name: "Quiz - Calculus II",
      date: "March 12, 2024",
      daysLeft: 2,
      progress: 80,
    },
  ],
  recentNotes: [
    {
      id: 1,
      title: "Data Structures Overview",
      class: "Computer Science 101",
      lastModified: "2 hours ago",
    },
    {
      id: 2,
      title: "Integration Techniques",
      class: "Calculus II",
      lastModified: "1 day ago",
    },
    {
      id: 3,
      title: "Shakespeare Analysis",
      class: "English Literature",
      lastModified: "3 days ago",
    },
  ],
  weeklyStats: {
    classesAttended: 12,
    totalClasses: 15,
    assignmentsCompleted: 8,
    totalAssignments: 10,
    studyHours: 25,
    targetHours: 30,
  },
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const currentDate = new Date();
const currentDay = currentDate.getDay();

export default function DashboardPage() {
  const [selectedDay, setSelectedDay] = useState(
    currentDay === 0 ? 6 : currentDay - 1
  ); // Convert Sunday (0) to Saturday (6)

  const getWeekDates = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates();

  const { user, loading, setUser } = useAuthStore();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Welcome Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-2xl">{t("welcome", { name : user?.displayName || "User" })}</CardTitle>
              <CardDescription>
                Here's what's happening with your studies today, March 10, 2024
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Weekly Calendar */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                This Week
              </CardTitle>
              <CardDescription>March 10 - March 16, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(index)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      selectedDay === index
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="text-xs font-medium">{day}</div>
                    <div className="text-lg font-bold">
                      {weekDates[index].getDate()}
                    </div>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">
                  {weekDays[selectedDay]}, March{" "}
                  {weekDates[selectedDay].getDate()}
                </h4>
                {mockData.upcomingClasses.map((class_) => (
                  <div
                    key={class_.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${class_.color}`}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{class_.name}</div>
                      <div className="text-xs text-gray-500">
                        {class_.time} • {class_.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Classes Attended</span>
                  <span>
                    {mockData.weeklyStats.classesAttended}/
                    {mockData.weeklyStats.totalClasses}
                  </span>
                </div>
                <Progress
                  value={
                    (mockData.weeklyStats.classesAttended /
                      mockData.weeklyStats.totalClasses) *
                    100
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Assignments</span>
                  <span>
                    {mockData.weeklyStats.assignmentsCompleted}/
                    {mockData.weeklyStats.totalAssignments}
                  </span>
                </div>
                <Progress
                  value={
                    (mockData.weeklyStats.assignmentsCompleted /
                      mockData.weeklyStats.totalAssignments) *
                    100
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study Hours</span>
                  <span>
                    {mockData.weeklyStats.studyHours}/
                    {mockData.weeklyStats.targetHours}h
                  </span>
                </div>
                <Progress
                  value={
                    (mockData.weeklyStats.studyHours /
                      mockData.weeklyStats.targetHours) *
                    100
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Classes
              </CardTitle>
              <CardDescription>3 classes scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.upcomingClasses.map((class_) => (
                <div
                  key={class_.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className={`w-3 h-3 rounded-full ${class_.color}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{class_.name}</div>
                    <div className="text-xs text-gray-500">{class_.time}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Upcoming Exams
              </CardTitle>
              <CardDescription>2 exams this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.upcomingExams.map((exam) => (
                <div key={exam.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{exam.name}</div>
                    <Badge
                      variant={exam.daysLeft <= 3 ? "destructive" : "secondary"}
                    >
                      {exam.daysLeft} days
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">{exam.date}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Preparation</span>
                      <span>{exam.progress}%</span>
                    </div>
                    <Progress value={exam.progress} />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Exam
              </Button>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recent Notes
              </CardTitle>
              <CardDescription>Your latest study notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{note.title}</div>
                    <div className="text-xs text-gray-500">
                      {note.class} • {note.lastModified}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
