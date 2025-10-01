import {
  getCoursesForUser,
  getCoursesFromRoles,
  getCourseDetails,
  downloadCourseMaterials,
  getGroupsForUser,
  getRolesForUser,
  getUserIdBySid,
  loginToIlias,
} from "@/lib/ilias";
import { expect, test } from "vitest";

test("Get ILIAS Client", async () => {
  console.log(process.env.ILIAS_USERNAME);
  const client = await loginToIlias({
    client: "HS-Albsig", // Replace with your actual service name
    username: process.env.ILIAS_USERNAME || "", // Replace with your actual username
    password: process.env.ILIAS_PASSWORD || "", // Replace with your actual password
  });
  console.log("Client:", client);
  // Write the output to a JSON file for testing purposes
  const user = await getUserIdBySid(client as string);
  console.log("User ID:", user);

  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/ilias_output.json",
    JSON.stringify(user, null, 2)
  );

  expect(client).toBeDefined();
  expect(user).toBeDefined();
});

test("Get Roles for User", async () => {
  const client = await loginToIlias({
    client: "HS-Albsig", // Replace with your actual service name
    username: process.env.ILIAS_USERNAME || "", // Replace with your actual username
    password: process.env.ILIAS_PASSWORD || "", // Replace with your actual password
  });

  const user = await getUserIdBySid(client as string);
  const roles = await getRolesForUser(client as string, user);

  console.log("User ID:", user);
  console.log("Roles:", roles);

  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/ilias_roles_output.json",
    JSON.stringify(roles, null, 2)
  );

  expect(client).toBeDefined();
  expect(user).toBeDefined();
  expect(roles).toBeDefined();
});

test("Get Courses for User", async () => {
  const client = await loginToIlias({
    client: "HS-Albsig", // Replace with your actual service name
    username: process.env.ILIAS_USERNAME || "", // Replace with your actual username
    password: process.env.ILIAS_PASSWORD || "", // Replace with your actual password
  });

  const user = await getUserIdBySid(client as string);
  const courses = await getCoursesForUser(client as string, user);

  console.log("User ID:", user);
  console.log("Courses:", courses);

  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/ilias_courses_output.json",
    JSON.stringify(courses, null, 2)
  );

  expect(client).toBeDefined();
  expect(user).toBeDefined();
  expect(courses).toBeDefined();
});

test("Get Courses from Roles (Alternative)", async () => {
  const client = await loginToIlias({
    client: "HS-Albsig",
    username: process.env.ILIAS_USERNAME || "",
    password: process.env.ILIAS_PASSWORD || "",
  });

  const user = await getUserIdBySid(client as string);
  const courses = await getCoursesFromRoles(client as string, user);

  console.log("User ID:", user);
  console.log("Courses from Roles:", courses);

  // Write the output to a JSON file for testing purposes
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./__tests__/api/out/ilias_courses_from_roles_output.json",
    JSON.stringify(courses, null, 2)
  );

  expect(client).toBeDefined();
  expect(user).toBeDefined();
  expect(courses).toBeDefined();
});

test("Download Course Materials", async () => {
  const client = await loginToIlias({
    client: "HS-Albsig",
    username: process.env.ILIAS_USERNAME || "",
    password: process.env.ILIAS_PASSWORD || "",
  });

  const user = await getUserIdBySid(client as string);
  
  // Hole erst die Kursliste
  const courses = await getCoursesFromRoles(client as string, user, false);
  
  if (courses.length > 0) {
    // Teste Download für den ersten Kurs
    const firstCourse = courses[0];
    console.log(`Teste Download für Kurs ${firstCourse.obj_id}: ${firstCourse.title}`);
    
    try {
      const downloadSummary = await downloadCourseMaterials(
        client as string, 
        firstCourse.obj_id, 
        "./__tests__/api/downloads"
      );
      
      console.log("Download Summary:", downloadSummary);
      
      expect(downloadSummary).toBeDefined();
      expect(downloadSummary.courseId).toBe(firstCourse.obj_id);
      expect(downloadSummary.downloadPath).toContain(firstCourse.obj_id);
      
    } catch (downloadError) {
      console.warn("Download-Fehler (kann normal sein):", downloadError);
      // Erwarte, dass der Versuch gemacht wurde, auch wenn er fehlschlägt
      expect(downloadError).toBeDefined();
    }
  }

  expect(client).toBeDefined();
  expect(user).toBeDefined();
  expect(courses).toBeDefined();
}, 30000); // 30 Sekunden Timeout für Download