"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Target,
  TrendingUp,
  Bell,
  Plus,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  FileText,
  Users,
  MapPin,
  CreditCard,
  Mail,
} from "lucide-react";

export default function Dashboard() {
  const [currentTime] = useState(new Date());

  // Mock data - replace with Firebase data
  const upcomingDeadlines = [
    {
      id: 1,
      title: "Mathematik Hausaufgabe",
      subject: "Mathematik",
      dueDate: "2025-09-16",
      priority: "high",
    },
    {
      id: 2,
      title: "Geschichte Essay",
      subject: "Geschichte",
      dueDate: "2025-09-18",
      priority: "medium",
    },
    {
      id: 3,
      title: "Physik Labor",
      subject: "Physik",
      dueDate: "2025-09-20",
      priority: "low",
    },
  ];

  const todayClasses = [
    {
      id: 1,
      subject: "Mathematik",
      time: "08:00 - 09:30",
      room: "Raum 101",
      status: "upcoming",
    },
    {
      id: 2,
      subject: "Deutsch",
      time: "10:00 - 11:30",
      room: "Raum 205",
      status: "current",
    },
    {
      id: 3,
      subject: "Physik",
      time: "13:00 - 14:30",
      room: "Labor 3",
      status: "upcoming",
    },
  ];

  const recentNotes = [
    {
      id: 1,
      title: "Quadratische Gleichungen",
      subject: "Mathematik",
      lastEdited: "2025-09-13",
    },
    {
      id: 2,
      title: "Weimarer Republik",
      subject: "Geschichte",
      lastEdited: "2025-09-12",
    },
    {
      id: 3,
      title: "Optik Grundlagen",
      subject: "Physik",
      lastEdited: "2025-09-11",
    },
  ];

  const semesterProgress = {
    currentWeek: 3,
    totalWeeks: 16,
    completedAssignments: 8,
    totalAssignments: 24,
    averageGrade: 2.1,
  };

  const institutionalLinks = [
    {
      category: "Akademisch",
      links: [
        {
          name: "Ilias",
          url: "https://elearning.hs-albsig.de/",
          icon: GraduationCap,
          description: "Lernplattform",
        },
        {
          name: "WebUntis",
          url: "https://hepta.webuntis.com/WebUntis/?school=HS-Albstadt#/basic/timetablePublic",
          icon: Calendar,
          description: "Vorlesungszeiten",
        },
        {
          name: "HS-In-One",
          url: "https://hisinone.hs-albsig.de/",
          icon: FileText,
          description: "Hochschulportal",
        },
        {
          name: "Bibliothek",
          url: "https://bsz.ibs-bw.de/aDISWeb/app?service=direct/0/Home/$DirectLink&sp=SOPAC08",
          icon: BookOpen,
          description: "Katalog & Reservierung",
        },
      ],
    },
    {
      category: "Services",
      links: [
        {
          name: "Studierendenwerk",
          url: "#",
          icon: Users,
          description: "BAföG & Beratung",
        },
        {
          name: "Campus Navigator",
          url: "#",
          icon: MapPin,
          description: "Gebäude & Räume",
        },
        {
          name: "Semesterticket",
          url: "#",
          icon: CreditCard,
          description: "ÖPNV Berechtigung",
        },
        {
          name: "IT-Services",
          url: "#",
          icon: Mail,
          description: "E-Mail & WLAN",
        },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getClassStatus = (status: string) => {
    switch (status) {
      case "current":
        return "bg-blue-500 text-white";
      case "upcoming":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-3">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Calendar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Hallo zaroc
                </h1>
                <p className="text-muted-foreground">
                  Hier ist dein Überblick für heute,{" "}
                  {currentTime.toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Neue Aufgabe
              </Button>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Semester Progress */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Semester Fortschritt
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Woche {semesterProgress.currentWeek} von{" "}
                          {semesterProgress.totalWeeks}
                        </span>
                        <span className="text-card-foreground">
                          {Math.round(
                            (semesterProgress.currentWeek /
                              semesterProgress.totalWeeks) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (semesterProgress.currentWeek /
                            semesterProgress.totalWeeks) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Aufgaben</p>
                        <p className="text-lg font-semibold text-card-foreground">
                          {semesterProgress.completedAssignments}/
                          {semesterProgress.totalAssignments}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Durchschnitt</p>
                        <p className="text-lg font-semibold text-card-foreground">
                          {semesterProgress.averageGrade}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Heutiger Stundenplan
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Nichts zu tun..
                  </p>
                  <div className="space-y-3 flex items-center justify-center">
                    {
                      /*todayClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {classItem.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {classItem.time} • {classItem.room}
                          </p>
                        </div>
                        <Badge className={getClassStatus(classItem.status)}>
                          {classItem.status === "current" ? "Jetzt" : "Bald"}
                        </Badge>
                      </div>
                    ))*/
                      <Image
                        src="/kurukuru.gif"
                        alt="Loading..."
                        width={200}
                        height={200}
                      />
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Anstehende Termine
                  </CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityColor(
                            deadline.priority
                          )}`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {deadline.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {deadline.subject} • {deadline.dueDate}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Notes */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Letzte Notizen
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/70 cursor-pointer transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {note.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {note.subject} • {note.lastEdited}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Study Time This Week */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Lernzeit diese Woche
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-card-foreground">
                        24.5h
                      </p>
                      <p className="text-sm text-muted-foreground">
                        von 30h Ziel
                      </p>
                    </div>
                    <Progress value={82} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mo-So</span>
                      <span className="text-green-500">
                        +2.5h vs. letzte Woche
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Schnellaktionen
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">Neue Notiz</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">Termin</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                    >
                      <Target className="h-4 w-4" />
                      <span className="text-xs">Ziel setzen</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs">Lernplan</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Overview Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Wochenübersicht
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(
                    (day, index) => (
                      <div key={day} className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {day}
                        </p>
                        <div className="h-20 bg-muted/50 rounded-lg flex items-end justify-center p-2">
                          <div
                            className="w-full bg-primary rounded-sm"
                            style={{ height: `${Math.random() * 80 + 20}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 5 + 1)}h
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar with Institutional Links */}
        <div className="w-80 bg-card/50 border-l border-border">
          <div className="sticky top-0 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Hochschul-Services
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Schnellzugriff auf wichtige Plattformen und Services deiner
                Hochschule
              </p>
            </div>

            {institutionalLinks.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group cursor-pointer border border-border/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <link.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {link.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Contact Section */}
            <Card className="bg-background/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">
                  Schnellkontakt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <p>Studierendenservice:</p>
                  <p className="text-foreground">+49 123 456-789</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>IT-Helpdesk:</p>
                  <p className="text-foreground">helpdesk@uni.de</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Notfall Campus:</p>
                  <p className="text-foreground">+49 123 456-911</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
