const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const config = {
  api: {
    baseUrl: appUrl,
  },
};
