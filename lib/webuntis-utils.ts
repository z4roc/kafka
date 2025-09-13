// WebUntis data conversion utilities

export interface WebUntisLesson {
  id: number;
  date: number; // YYYYMMDD format
  startTime: number; // HHMM format
  endTime: number; // HHMM format
  kl: Array<{ id: number; name: string; longname: string }>; // classes
  te: Array<{ id: number; name: string; longname: string }>; // teachers
  su: Array<{ id: number; name: string; longname: string }>; // subjects
  ro: Array<{ id: number; name: string; longname: string }>; // rooms
  lstext?: string;
  lsnumber?: number;
  sg?: string;
  activityType: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  location: string;
  professor: string;
  color: string;
  type: "lecture" | "seminar" | "lab" | "exam";
  classes: string[];
  subject: string;
  activityType: string;
}

// Convert WebUntis date format (YYYYMMDD) to Date object
export function parseWebUntisDate(dateNumber: number): Date {
  const dateStr = dateNumber.toString();
  const year = Number.parseInt(dateStr.substring(0, 4));
  const month = Number.parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
  const day = Number.parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}

// Convert WebUntis time format (HHMM) to hours and minutes
export function parseWebUntisTime(timeNumber: number): {
  hours: number;
  minutes: number;
} {
  const timeStr = timeNumber.toString().padStart(4, "0");
  const hours = Number.parseInt(timeStr.substring(0, 2));
  const minutes = Number.parseInt(timeStr.substring(2, 4));
  return { hours, minutes };
}

// Create full DateTime from WebUntis date and time
export function createWebUntisDateTime(date: number, time: number): Date {
  const dateObj = parseWebUntisDate(date);
  const { hours, minutes } = parseWebUntisTime(time);
  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj;
}

// Generate color based on subject name
export function getSubjectColor(subjectName: string): string {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#ec4899", // pink
    "#6366f1", // indigo
  ];

  // Simple hash function to consistently assign colors
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Determine activity type for calendar display
export function mapActivityType(
  activityType: string
): "lecture" | "seminar" | "lab" | "exam" {
  const type = activityType.toLowerCase();
  if (type.includes("lab") || type.includes("praktikum")) return "lab";
  if (type.includes("seminar") || type.includes("übung")) return "seminar";
  if (
    type.includes("klausur") ||
    type.includes("prüfung") ||
    type.includes("exam")
  )
    return "exam";
  return "lecture"; // default
}

// Convert WebUntis lesson to calendar event
export function convertWebUntisToCalendarEvent(
  lesson: WebUntisLesson
): CalendarEvent {
  const startDateTime = createWebUntisDateTime(lesson.date, lesson.startTime);
  const endDateTime = createWebUntisDateTime(lesson.date, lesson.endTime);

  const subject =
    lesson.su[0]?.longname || lesson.su[0]?.name || "Unknown Subject";
  const teacher =
    lesson.te[0]?.longname || lesson.te[0]?.name || "Unknown Teacher";
  const room = lesson.ro[0]?.name || lesson.ro[0]?.longname || "Unknown Room";
  const classes = lesson.kl.map((kl) => kl.name);

  return {
    id: lesson.id,
    title: subject,
    startTime: startDateTime.toISOString(),
    endTime: endDateTime.toISOString(),
    location: room,
    professor: teacher,
    color: getSubjectColor(subject),
    type: mapActivityType(lesson.activityType),
    classes,
    subject,
    activityType: lesson.activityType,
  };
}

// Convert array of WebUntis lessons to calendar events
export function convertWebUntisLessons(
  lessons: WebUntisLesson[]
): CalendarEvent[] {
  return lessons.map(convertWebUntisToCalendarEvent);
}

// Group consecutive lessons of the same subject
export function groupConsecutiveLessons(
  events: CalendarEvent[]
): CalendarEvent[] {
  if (events.length === 0) return [];

  const grouped: CalendarEvent[] = [];
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  let currentGroup = sortedEvents[0];

  for (let i = 1; i < sortedEvents.length; i++) {
    const current = sortedEvents[i];
    const currentGroupEnd = new Date(currentGroup.endTime);
    const currentStart = new Date(current.startTime);

    // Check if lessons are consecutive and same subject
    if (
      currentGroupEnd.getTime() === currentStart.getTime() &&
      currentGroup.subject === current.subject &&
      currentGroup.professor === current.professor &&
      currentGroup.location === current.location
    ) {
      // Extend the current group
      currentGroup = {
        ...currentGroup,
        endTime: current.endTime,
        id: currentGroup.id, // Keep the first ID
      };
    } else {
      // Start a new group
      grouped.push(currentGroup);
      currentGroup = current;
    }
  }

  grouped.push(currentGroup);
  return grouped;
}
