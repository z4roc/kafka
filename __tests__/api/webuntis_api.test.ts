import { expect, test } from "vitest";
import { webuntisApi } from "@/lib/webuntis_api";

test("Get TimeTable for Class ID", async () => {
  webuntisApi.setCurrentSchoolyear(
    await webuntisApi.getSchoolYearByName("2025/2026")
  );
  const schoolYear = await webuntisApi.getTimetableForClass();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/schoolYear_output.json",
    JSON.stringify(schoolYear, null, 2)
  );
  expect(schoolYear).toBeDefined();
});

test("Get All School Years", async () => {
  const schoolYears = await webuntisApi.getSchoolYears();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/schoolYears_output.json",
    JSON.stringify(schoolYears, null, 2)
  );
  expect(schoolYears).toBeDefined();
});

test("Get All Departments", async () => {
  const departments = await webuntisApi.getDepartments();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/departments_output.json",
    JSON.stringify(departments, null, 2)
  );
  expect(departments).toBeDefined();
});

test("Get All Classes", async () => {
  webuntisApi.setCurrentSchoolyear(
    await webuntisApi.getSchoolYearByName("2025/2026")
  );
  const classes = await webuntisApi.getClasses();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/classes_output.json",
    JSON.stringify(classes, null, 2)
  );
  expect(classes).toBeDefined();
});

test("Get All Subjects", async () => {
  const subjects = await webuntisApi.getSubjects();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/subjects_output.json",
    JSON.stringify(subjects, null, 2)
  );
  expect(subjects).toBeDefined();
});
