"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, User, Users } from "lucide-react";
import type { CalendarEvent } from "@/lib/webuntis-utils";

interface WeekViewProps {
  currentDate: Date;
  classes: CalendarEvent[];
}

const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7; // Start from 7 AM
  return {
    time: `${hour.toString().padStart(2, "0")}:00`,
    hour,
  };
});

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekView({ currentDate, classes }: WeekViewProps) {
  const weekDates = useMemo(() => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  }, [currentDate]);

  const getClassesForDay = (date: Date) => {
    return classes.filter((classEvent) => {
      const classDate = new Date(classEvent.startTime);
      return (
        classDate.getDate() === date.getDate() &&
        classDate.getMonth() === date.getMonth() &&
        classDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getClassPosition = (classEvent: CalendarEvent) => {
    const startTime = new Date(classEvent.startTime);
    const endTime = new Date(classEvent.endTime);
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;
    const duration = endHour - startHour;

    console.log(
      `Class ${classEvent.title} starts at ${startHour} and lasts for ${duration} hours`
    );

    const top = (startHour - 7) * 60; // 60px per hour
    const height = duration * 65; // 60px per hour

    return { top, height };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="h-full">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b dark:border-gray-700">
        <div className="p-4 border-r dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Time
          </div>
        </div>
        {weekDates.map((date, index) => (
          <div
            key={date.toISOString()}
            className={`p-4 text-center border-r dark:border-gray-700 ${
              isToday(date) ? "bg-blue-50 dark:bg-blue-900/20" : ""
            }`}
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {weekDays[index]}
            </div>
            <div
              className={`text-lg font-semibold ${
                isToday(date)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="relative">
        <div className="grid grid-cols-8">
          {/* Time Column */}
          <div className="border-r dark:border-gray-700">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className="h-15 border-b dark:border-gray-700 p-2"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {slot.time}
                </div>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date) => (
            <div
              key={date.toISOString()}
              className="relative border-r dark:border-gray-700"
            >
              {/* Time Slots Background */}
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={`h-15 border-b dark:border-gray-700 ${
                    isToday(date) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                />
              ))}

              {/* Classes */}
              {getClassesForDay(date).map((classEvent) => {
                const { top, height } = getClassPosition(classEvent);
                return (
                  <Card
                    key={classEvent.id}
                    className="absolute left-2 right-2 p-1 shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      borderLeftColor: classEvent.color,
                      backgroundColor: `${classEvent.color}15`,
                    }}
                  >
                    <div className="space-y-1">
                      <div
                        className="font-medium text-xs truncate"
                        style={{ color: classEvent.color }}
                      >
                        {classEvent.title}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(classEvent.startTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 truncate">
                        <MapPin className="h-3 w-3 mr-1" />
                        {classEvent.location}
                      </div>
                      {height > 80 && (
                        <>
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 truncate">
                            <User className="h-3 w-3 mr-1" />
                            {classEvent.professor}
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
