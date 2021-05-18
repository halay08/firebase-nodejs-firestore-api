/**
 * Check if string is valid JSON or not
 *
 * @param {string} str
 * @returns Boolean
 *
 * @example
 *
 * isJSON("something");
 * // -> false
 * isJSON("\"something\"");
 * // -> true
 * isJSON("{ foo: 42 }");
 * // -> false
 * isJSON("{ \"foo\": 42 }");
 * // -> true
 */
export function isJSON(str: string) {
    if (/^\s*$/.test(str)) return false;
    // eslint-disable-next-line no-param-reassign
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    // eslint-disable-next-line no-param-reassign
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    // eslint-disable-next-line no-param-reassign
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return /^[\],:{}\s]*$/.test(str);
}
