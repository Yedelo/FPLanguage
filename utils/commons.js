export const LOGO = "§3§l+ §r§lFPLanguage §3§l+";

export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomString(length) {
  return Math.random().toString(36).substring(2, length + 2);
}