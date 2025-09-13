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

  const detectOverlaps = (events: CalendarEvent[]) => {
    const sortedEvents = [...events].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // Group overlapping events together
    const overlapGroups: CalendarEvent[][] = [];

    for (const event of sortedEvents) {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);

      // Find if this event belongs to an existing group
      let addedToGroup = false;

      for (const group of overlapGroups) {
        const hasOverlap = group.some((groupEvent) => {
          const groupStart = new Date(groupEvent.startTime);
          const groupEnd = new Date(groupEvent.endTime);
          return startTime < groupEnd && endTime > groupStart;
        });

        if (hasOverlap) {
          group.push(event);
          addedToGroup = true;
          break;
        }
      }

      // If no overlap found, create new group
      if (!addedToGroup) {
        overlapGroups.push([event]);
      }
    }

    // Create position map
    const eventPositions = new Map();

    for (const group of overlapGroups) {
      // Sort group by start time
      group.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      group.forEach((event, index) => {
        eventPositions.set(event.id, {
          event,
          positionInGroup: index,
          totalInGroup: group.length,
          overlappingEvents: group.filter((e) => e.id !== event.id),
        });
      });
    }

    // Return in original order
    return sortedEvents.map((event) => eventPositions.get(event.id));
  };

  const getClassPosition = (
    classEvent: CalendarEvent,
    positionInGroup: number,
    totalInGroup: number
  ) => {
    const startTime = new Date(classEvent.startTime);
    const endTime = new Date(classEvent.endTime);
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;
    const duration = endHour - startHour;

    const top = (startHour - 7) * 60; // 60px per hour
    const height = duration * 60; // 60px per hour

    // Calculate width and left position for overlapping events
    const width = totalInGroup > 1 ? 100 / totalInGroup : 100;
    const left = totalInGroup > 1 ? positionInGroup * width : 0;

    return { top, height, width, left };
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
          {weekDates.map((date) => {
            const dayEvents = getClassesForDay(date);
            const eventPositions = detectOverlaps(dayEvents);

            return (
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
                {eventPositions.map(
                  ({ event, positionInGroup, totalInGroup }) => {
                    const { top, height, width, left } = getClassPosition(
                      event,
                      positionInGroup,
                      totalInGroup
                    );
                    return (
                      <Card
                        key={event.id}
                        className="absolute p-1 shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          width: `${width}%`,
                          left: `${left}%`,
                          borderLeftColor: event.color,
                          backgroundColor: `${event.color}15`,
                        }}
                      >
                        <div className="space-y-1 px-1">
                          <div
                            className="font-medium text-xs truncate"
                            style={{ color: event.color }}
                          >
                            {event.title}
                          </div>
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(event.startTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                          {width > 30 && (
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 truncate">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                          {height > 80 && width > 40 && (
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 truncate">
                              <User className="h-3 w-3 mr-1" />
                              {event.professor}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
