import { expect, test } from "vitest";
import { WebUntisAPI } from "@/lib/webuntis_api";

test("Get TimeTable for ID", async () => {
  const webuntis = new WebUntisAPI();
  await webuntis.login();
  const schoolYear = await webuntis.getTimetable();
  await webuntis.logout();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/schoolYear_output.json",
    JSON.stringify(schoolYear, null, 2)
  );
  expect(schoolYear).toBeDefined();
});

test("Get All School Years", async () => {});

test("Get All Departments", async () => {
  const webuntis = new WebUntisAPI();
  await webuntis.login();
  const departments = await webuntis.getDepartments();
  await webuntis.logout();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/departments_output.json",
    JSON.stringify(departments, null, 2)
  );
  expect(departments).toBeDefined();
});

test("Get All Classes", async () => {
  const webuntis = new WebUntisAPI();
  await webuntis.login();
  const classes = await webuntis.getClasses();
  await webuntis.logout();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/classes_output.json",
    JSON.stringify(classes, null, 2)
  );
  expect(classes).toBeDefined();
});

test("Get All Subjects", async () => {
  const webuntis = new WebUntisAPI();
  await webuntis.login();
  const subjects = await webuntis.getSubjects();
  await webuntis.logout();
  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/subjects_output.json",
    JSON.stringify(subjects, null, 2)
  );
  expect(subjects).toBeDefined();
});
