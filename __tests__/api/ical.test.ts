import { expect, test } from "vitest";

test("Generate iCal", async () => {
  //https://localhost/api/calendar/okbId56Y5DNBKfFwSefC5H4u4mU2
  const userId = "okbId56Y5DNBKfFwSefC5H4u4mU2";
  fetch(`/api/calendar/${userId}`).then((res) => {
    expect(res.status).toBe(200);
    res.text().then((text) => {
      console.log(text);
      expect(text).toContain("BEGIN:VCALENDAR");
      expect(text).toContain("END:VCALENDAR");
    });
  });
});
