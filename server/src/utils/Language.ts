export const Language = {
  FR: "fr",
  EN: "en",
  CH: "ch",
} as const;
export type Language = (typeof Language)[keyof typeof Language];
export const isLanguage = (language: string): language is Language =>
  Object.values(Language).includes(language as Language);
