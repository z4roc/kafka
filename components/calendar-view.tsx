"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Grid3X3 } from "lucide-react";
import { WeekView } from "@/components/week-view";
import { MonthView } from "@/components/month-view";

export interface ClassEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  professor: string;
  color: string;
  type: "lecture" | "seminar" | "lab" | "exam";
}

interface CalendarViewProps {
  classes: ClassEvent[];
}

type ViewMode = "week" | "month";

export function CalendarView({ classes }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateRange = () => {
    if (viewMode === "week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const formatOptions: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      const startStr = startOfWeek.toLocaleDateString("en-US", formatOptions);
      const endStr = endOfWeek.toLocaleDateString("en-US", formatOptions);
      const year = startOfWeek.getFullYear();

      return `${startStr} - ${endStr}, ${year}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-2xl font-bold">
                {formatDateRange()}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="h-8"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Week
                </Button>
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="h-8"
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Month
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Content */}
      <Card className="flex-1">
        <CardContent className="p-0">
          {viewMode === "week" ? (
            <WeekView currentDate={currentDate} classes={classes} />
          ) : (
            <MonthView currentDate={currentDate} classes={classes} />
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Class Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-blue-500 text-blue-700 dark:text-blue-300"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Lecture
            </Badge>
            <Badge
              variant="outline"
              className="border-green-500 text-green-700 dark:text-green-300"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Seminar
            </Badge>
            <Badge
              variant="outline"
              className="border-purple-500 text-purple-700 dark:text-purple-300"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Lab
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-500 text-amber-700 dark:text-amber-300"
            >
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              Exam
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
