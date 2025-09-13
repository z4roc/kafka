import { login } from "@/lib/auth";
import { setAllSubjects } from "@/lib/subjects";
import { expect, test } from "vitest";

test("Test populate subjects", async () => {
  // This test is used to populate the Firestore database with subjects from subjects.json
  // Uncomment the line below to run it once
  await login(
    process.env.FIREBASE_EMAIL || "",
    process.env.FIREBASE_PASSWORD || ""
  );
  await setAllSubjects();
  expect(true).toBe(true);
});
