import { expect, test } from "vitest";
import { webuntisApi } from "@/lib/webuntis_api";

test("Get Current School Year", async () => {
  console.log(webuntisApi.webuntis.sessionInformation);
  const schoolYear = await webuntisApi.getCurrentSchoolYear();
  expect(schoolYear).toBeDefined();
});

test("Get All School Years", async () => {});
