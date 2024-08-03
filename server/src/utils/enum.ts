// lib/enum.ts
export function getEnumValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export function getEnumKeys<T extends Record<string, any>>(obj: T) {
  return Object.keys(obj) as [keyof T];
}
