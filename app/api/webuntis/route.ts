import { webuntisApi } from "@/lib/webuntis_api";
import { writeFileSync } from "fs";

type ResponseData = {
  message: string;
};

export async function POST(request: Request) {
  try {
    const { subjects } = await request.json();

    const allLessons = await webuntisApi.getAllLessonsForSchoolYear(
      await webuntisApi.getSchoolYearByName("2025/2026")
    );

    const lessons = allLessons.filter((lesson) =>
      subjects.some(
        (subject: { id: number }) => subject.id === lesson.su[0]?.id
      )
    );

    const uniqueLessons = Array.from(
      new Map(lessons.map((lesson) => [lesson.id, lesson])).values()
    );

    return new Response(JSON.stringify(uniqueLessons), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in WebUntis API handler:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
