"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/lib/webuntis-utils";

interface MonthViewProps {
  currentDate: Date;
  classes: CalendarEvent[];
}

export function MonthView({ currentDate, classes }: MonthViewProps) {
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Adjust to start from Monday
    const startDay = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (startDay === 0 ? 6 : startDay - 1));

    // Adjust to end on Sunday
    const endDay = lastDay.getDay();
    endDate.setDate(lastDay.getDate() + (endDay === 0 ? 0 : 7 - endDay));

    const days = [];
    const currentDateIter = new Date(startDate);

    while (currentDateIter <= endDate) {
      days.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return { days, currentMonth: month };
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

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === monthData.currentMonth;
  };

  return (
    <div className="h-full">
      {/* Month Header */}
      <div className="grid grid-cols-7 border-b dark:border-gray-700">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="p-4 text-center border-r dark:border-gray-700 last:border-r-0"
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 h-full">
        {monthData.days.map((date) => {
          const dayClasses = getClassesForDay(date);
          return (
            <div
              key={date.toISOString()}
              className={`min-h-32 p-2 border-r border-b dark:border-gray-700 last:border-r-0 ${
                isToday(date) ? "bg-blue-50 dark:bg-blue-900/20" : ""
              } ${
                !isCurrentMonth(date) ? "bg-gray-50 dark:bg-gray-800/50" : ""
              }`}
            >
              <div className="space-y-1">
                <div
                  className={`text-sm font-medium ${
                    isToday(date)
                      ? "text-blue-600 dark:text-blue-400"
                      : isCurrentMonth(date)
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayClasses.slice(0, 3).map((classEvent) => (
                    <div
                      key={classEvent.id}
                      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: `${classEvent.color}20`,
                        color: classEvent.color,
                        borderLeft: `3px solid ${classEvent.color}`,
                      }}
                      title={`${classEvent.title} - ${classEvent.location} - ${classEvent.professor}`}
                    >
                      <div className="font-medium truncate">
                        {classEvent.title}
                      </div>
                      <div className="text-xs opacity-75">
                        {new Date(classEvent.startTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </div>
                    </div>
                  ))}
                  {dayClasses.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                      +{dayClasses.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
