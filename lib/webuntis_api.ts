import { Subject, UserSubject } from "@/types/subjects";
import { FieldMap, studyFieldType } from "@/types/types";
import { Lesson, SchoolYear, WebUntis } from "webuntis";
import { writeFileSync } from "fs";

// Overwrite in .env file
const default_settings = {
  school: process.env.WEBUNTIS_SCHOOL || "HS-Albstadt",
  username: process.env.WEBUNTIS_USERNAME || "ITS1",
  password: process.env.WEBUNTIS_PASSWORD || "",
  server: process.env.WEBUNTIS_SERVER || "hepta.webuntis.com",
  useragent: process.env.WEBUNTIS_USERAGENT || "WebUntis/1.0",
};

export class WebUntisAPI {
  public webuntis: WebUntis;
  private static instance: WebUntisAPI;
  private currentSchoolyear: SchoolYear | null = null;
  private validateSession: boolean = true;

  static getInstance() {
    if (!WebUntisAPI.instance) {
      WebUntisAPI.instance = new WebUntisAPI();
    }
    return WebUntisAPI.instance;
  }

  constructor(
    school: string = default_settings.school,
    username: string = default_settings.username,
    password: string = default_settings.password,
    server: string = default_settings.server
  ) {
    this.webuntis = new WebUntis(school, username, password, server);
  }

  // login für WebUntis
  async login() {
    try {
      await this.webuntis.login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async logout() {
    try {
      await this.webuntis.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  // aktuelles Semester
  async getCurrentSchoolYear() {
    const schoolYear = await this.webuntis.getCurrentSchoolyear(
      this.validateSession
    );
    if (schoolYear.id === null || schoolYear.id === undefined) {
      throw new Error("No current school year found.");
    }
    this.currentSchoolyear = schoolYear;
    return schoolYear;
  }

  async getSchoolYears() {
    return await this.webuntis.getSchoolyears(true);
  }

  async getSchoolYearByName(name: string) {
    const years = await this.getSchoolYears();
    const year = years.find((y) => y.name === name);
    if (!year) {
      throw new Error(`School year with name ${name} not found.`);
    }
    return year;
  }
  // Alle Fakultäten / Studiengänge
  async getDepartments() {
    return await this.webuntis.getDepartments();
  }

  async getClasses() {
    return await this.webuntis.getClasses(
      this.validateSession,
      this.currentSchoolyear!.id
    );
  }

  async getTeachers() {
    return await this.webuntis.getTeachers(this.validateSession);
  }

  async getSubjects() {
    return await this.webuntis.getSubjects(this.validateSession);
  }

  async getRooms() {
    return await this.webuntis.getRooms(this.validateSession);
  }

  async getTimegrid() {
    return await this.webuntis.getTimegrid(this.validateSession);
  }

  async getTimetableForClass(
    classId: number = 5549,
    year: SchoolYear | null = this.currentSchoolyear
  ) {
    if (!this.currentSchoolyear) {
      this.currentSchoolyear = await this.getCurrentSchoolYear();
    }

    if (!year) {
      year = this.currentSchoolyear;
    }
    // Ensure dates are within the current school year
    const startDate = new Date(year.startDate);
    const endDate = new Date(year.endDate);

    // Use the school year's date range instead of arbitrary 3 months
    // Returns LESSONS, su: subject: ro: room, te: teacher, cl: class
    return await this.webuntis.getTimetableForRange(
      startDate,
      endDate,
      classId,
      WebUntis.TYPES.CLASS
    );
  }

  setCurrentSchoolyear(year: SchoolYear) {
    this.currentSchoolyear = year;
  }

  async getTimeTableByClasses(
    enrolledSubjects: UserSubject[],
    studyField: studyFieldType
  ) {
    this.currentSchoolyear = await this.getSchoolYearByName("2025/2026");

    if (studyField === "Other") {
      return [];
    }

    const classList = await this.getClasses();
    const class_key = FieldMap[studyField]; // "TI", "WI", "ITS"
    if (!class_key) {
      throw new Error(`Invalid study field: ${studyField}`);
    }
    const filteredClasses = classList.filter((c) =>
      c.name.startsWith(class_key)
    );

    const subjects = await this.getSubjects();
    const enrolled_untis_subjects_ids = subjects
      .filter((s) => enrolledSubjects.some((es) => es.id === s.id))
      .map((s) => s.id);

    let timetableEntries: Lesson[] = [];
    for (const classId of filteredClasses.map((c) => c.id)) {
      const entries = await this.getTimetableForClass(classId);
      timetableEntries = timetableEntries.concat(entries);
    }

    const uncompleted_subjects = enrolledSubjects.filter((s) => !s.completed);

    const filteredTimetable = timetableEntries.filter((entry) =>
      uncompleted_subjects.some((us) => us.id === entry.su[0]?.id)
    );

    return filteredTimetable;
  }

  async getAllLessonsForSchoolYear(year: SchoolYear = this.currentSchoolyear!) {
    if (!year) {
      year = await this.getCurrentSchoolYear();
    }

    this.setCurrentSchoolyear(year);

    const classList = await this.getClasses();

    // For now Only TI-*, ITS-*, WIN-*
    const filteredClasses = classList.filter((c) =>
      ["TI", "ITS", "WIN"].some((prefix) => c.name.startsWith(prefix))
    );

    let timetableEntries: Lesson[] = [];

    for (const classId of filteredClasses.map((c) => c.id)) {
      const entries = await this.getTimetableForClass(classId);
      timetableEntries = timetableEntries.concat(entries);
    }

    return timetableEntries;
  }
}

const webuntisApi = new WebUntisAPI();
await webuntisApi.login();

export { webuntisApi };
