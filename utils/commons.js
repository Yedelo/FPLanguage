export const LOGO = "§3§l+ §r§lFPLanguage §3§l+";

export function randomInt(min, max) {
    return Math.round(randomNumber(min, max));
}

export function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomString(length) {
  return Math.random().toString(36).substring(2, length + 2);
}

export function probability(chance) {
    return Math.random() < chance;
}

export function range(min, max) {
    return function() {
        return randomInt(min, max);
    }
} 