import { SchoolYear, WebUntis } from "webuntis";

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
    console.log(
      `WebUntisAPI initialized with school: ${school}, username: ${username}, server: ${server}`
    );
  }

  // Just for testing purposes
  private TI_4: number = 5246;

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
    return await this.webuntis.getSchoolyears();
  }
  // Alle Fakultäten / Studiengänge
  async getDepartments() {
    return await this.webuntis.getDepartments();
  }

  async getClasses() {
    if (!this.currentSchoolyear) {
      this.currentSchoolyear = await this.getCurrentSchoolYear();
    }
    return await this.webuntis.getClasses(
      this.validateSession,
      this.currentSchoolyear.id
    );
  }

  async getSubjects() {
    if (!this.currentSchoolyear) {
      this.currentSchoolyear = await this.getCurrentSchoolYear();
    }
    return await this.webuntis.getSubjects(this.validateSession);
  }

  async getRooms() {
    if (!this.currentSchoolyear) {
      this.currentSchoolyear = await this.getCurrentSchoolYear();
    }
    return await this.webuntis.getRooms(this.validateSession);
  }

  async getTimegrid() {
    return await this.webuntis.getTimegrid(this.validateSession);
  }

  async getTimetable(year: SchoolYear | null = this.currentSchoolyear) {
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
    console.log(
      `Fetching timetable for ${
        year.name
      } from ${startDate.toISOString()} to ${endDate.toISOString()}`
    );
    return await this.webuntis.getTimetableForRange(
      startDate,
      endDate,
      this.TI_4,
      WebUntis.TYPES.CLASS
    );
  }
}

const webuntisApi = new WebUntisAPI();
await webuntisApi.login();

export { webuntisApi };
