import { randomElement } from "./commons";

export const MATCHER_PREFIX = "matcher:";

const matchers = new Map();

function registerMatcher(regex, matcher) {
    matchers.set(regex, matcher);
}

registerMatcher(/^all$/, (pattern, string, array) => array);

registerMatcher(/random\[([0-9]+)\]/, (pattern, string, array) => {
    let match = string.match(pattern);
    let numberOfElements = parseInt(match[1]);
    let result = [];
    if (numberOfElements) {
        for (let i = 0; i < numberOfElements; i ++) {
            result.push(randomElement(array));
        }
    }
    return result;
});

export function getMatchedArray(string, array) {
    let result = [];
    matchers.forEach((value, key) => {
        if (key.test(string)) {
            let attempt = value(key, string, array);
            if (attempt && attempt.length != 0) {
                result = attempt;
            }
        }
    });
    return result;
}