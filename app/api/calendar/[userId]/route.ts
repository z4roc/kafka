import { getUserCourseOfStudy, getUserSubjects } from "@/lib/subjects";
import { webuntisApi } from "@/lib/webuntis_api";
import ical from "ical-generator";

import { NextRequest } from "next/server";

import { convertWebUntisLessons, WebUntisLesson } from "@/lib/webuntis-utils";
import { studyFieldType } from "@/types/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // Fetch calendar events for the user
  const subjects = await getUserSubjects(userId);
  const userCourseOfStudy = await getUserCourseOfStudy(userId);

  const events = await webuntisApi.getTimeTableByClasses(
    subjects,
    (userCourseOfStudy as studyFieldType) || "Other"
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
