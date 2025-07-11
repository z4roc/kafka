import { webuntisApi } from "@/lib/webuntis_api";

export default async function TestPage() {
  const lessons = await webuntisApi.getTimetable();
  console.log("Fetched lessons:", lessons);
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page to verify the current user state.</p>
    </div>
  );
}
