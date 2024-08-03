export const Language = {
  FR: "fr",
  EN: "en",
  CH: "ch",
} as const;
export type Language = (typeof Language)[keyof typeof Language];
