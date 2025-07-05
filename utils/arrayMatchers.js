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
    if (numberOfElements) {
        let result = [];
        for (let i = 0; i < numberOfElements; i ++) {
            result.push(randomElement(array));
        }
        return result;
    }
    return [];
});

registerMatcher(/length>([0-9]+)/, (pattern, string, array) => {
    let match = string.match(pattern);
    let lengthRequired = parseInt(match[1]);
    if (lengthRequired) {
        return array.filter((message) => message.length >= lengthRequired);
    }
    return [];
})

export function getMatchedArray(string, array) {
    let result = array;
    string.split("+").forEach((matcherSyntax) => {
        matchers.forEach((value, key) => {
            if (key.test(matcherSyntax)) {
                result = value(key, matcherSyntax, result);
            }
        })
    })
    return result;
}