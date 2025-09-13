import type { NextApiRequest, NextApiResponse } from "next";
import { WebUntisAPI } from "@/lib/webuntis_api";
import { Lesson } from "webuntis";
import { writeFile } from "fs/promises";

type ResponseData = {
  message: string;
};

export async function POST(request: Request) {
  try {
    const { subjects } = await request.json();

    const webuntis = new WebUntisAPI();
    await webuntis.login();
    const lessons = await webuntis.getTimeTableByClasses(
      subjects,
      "Technische Informatik"
    );
    await webuntis.logout();

    if (process.env.NODE_ENV === "development") {
      await writeFile("./lessons.json", JSON.stringify(lessons, null, 2), {
        encoding: "utf-8",
      });
    }

    return new Response(JSON.stringify(lessons), {
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
