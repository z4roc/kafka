import { getUserSubjects } from "@/lib/subjects";
import { webuntisApi } from "@/lib/webuntis_api";
import ical from "ical-generator";
import {
  convertWebUntisLessons,
  convertWebUntisToCalendarEvent,
  WebUntisLesson,
} from "@/lib/webuntis-utils";
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  // Fetch calendar events for the user
  const subjects = await getUserSubjects(userId);

  const events = await webuntisApi.getTimeTableByClasses(
    subjects,
    "Technische Informatik"
  );

  const parsedEvents = convertWebUntisLessons(events as WebUntisLesson[]);

  const calendar = ical({ name: "User Calendar" });

  parsedEvents.forEach((event) => {
    calendar.createEvent({
      start: event.startTime,
      end: event.endTime,
      summary: event.title,
      description: event.professor,
      location: event.location,
    });
  });

  const calendarData = calendar.toString();

  return new Response(calendarData, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="calendar.ics"',
    },
  });
}
