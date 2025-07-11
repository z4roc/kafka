"use client";
import { CalendarView, ClassEvent } from "@/components/calendar-view";
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
import { webuntisApi } from "@/lib/webuntis_api";
import { useEffect } from "react";

// Mock data - replace with actual WebUntis API data
const mockClasses: ClassEvent[] = [
  {
    id: 1,
    title: "Computer Science 101",
    startTime: "2024-03-11T09:00:00",
    endTime: "2024-03-11T10:30:00",
    location: "Room 204",
    professor: "Dr. Smith",
    color: "#3b82f6", // blue
    type: "lecture",
  },
  {
    id: 2,
    title: "Calculus II",
    startTime: "2024-03-11T11:00:00",
    endTime: "2024-03-11T12:30:00",
    location: "Math Building 301",
    professor: "Prof. Johnson",
    color: "#10b981", // green
    type: "lecture",
  },
  {
    id: 3,
    title: "English Literature",
    startTime: "2024-03-11T14:00:00",
    endTime: "2024-03-11T15:30:00",
    location: "Liberal Arts 105",
    professor: "Dr. Williams",
    color: "#8b5cf6", // purple
    type: "seminar",
  },
  {
    id: 4,
    title: "Computer Science 101",
    startTime: "2024-03-13T09:00:00",
    endTime: "2024-03-13T10:30:00",
    location: "Room 204",
    professor: "Dr. Smith",
    color: "#3b82f6",
    type: "lecture",
  },
  {
    id: 5,
    title: "Physics Lab",
    startTime: "2024-03-12T13:00:00",
    endTime: "2024-03-12T16:00:00",
    location: "Physics Lab 2",
    professor: "Dr. Brown",
    color: "#f59e0b", // amber
    type: "lab",
  },
  {
    id: 6,
    title: "Calculus II",
    startTime: "2024-03-14T11:00:00",
    endTime: "2024-03-14T12:30:00",
    location: "Math Building 301",
    professor: "Prof. Johnson",
    color: "#10b981",
    type: "lecture",
  },
];

export default async function CalendarPage() {
  const lessons = await webuntisApi.getTimetable();
  console.log("Fetched lessons:", lessons);

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
                <BreadcrumbPage>Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CalendarView classes={mockClasses} />
      </div>
    </>
  );
}
