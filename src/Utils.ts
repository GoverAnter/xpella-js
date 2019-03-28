/**
 * Tests each elements of the array to see if the string starts with one
 * @param str The string to test
 * @param arr The array of elements to test
 * @returns The matching array element, or undefined if nothing found
 */
export function beginsWith(str: string, arr: Array<string>) : string {
  for (let el of arr) {
    if (str.startsWith(el)) {
      return el;
    }
  }
}