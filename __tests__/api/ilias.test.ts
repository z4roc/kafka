import {
  getCoursesForUser,
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
