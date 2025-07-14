"use client";
import { CalendarView } from "@/components/calendar-view";
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
import { useEffect, useState } from "react";
import { Lesson } from "webuntis";
import {
  CalendarEvent,
  convertWebUntisLessons,
  groupConsecutiveLessons,
} from "@/lib/webuntis-utils";

export default function CalendarPage() {
  const [lessons, setLessons] = useState<CalendarEvent[] | null>([]);
  useEffect(() => {
    // Fetch classes from WebUntis API
    fetch("/api/webuntis")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched lessons:", data);
        const events = convertWebUntisLessons(data);

        // Group consecutive lessons of the same subject
        const groupedEvents = groupConsecutiveLessons(events);
        setLessons(groupedEvents);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
        // Fallback to mock data if API fails
      });
  }, []);

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
        <CalendarView classes={lessons || []} />
      </div>
    </>
  );
}
