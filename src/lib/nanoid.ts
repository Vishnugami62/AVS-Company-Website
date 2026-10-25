import { randomInt } from "crypto";

/**
 * Tiny dependency-free random-id helper (subset of nanoid's API) using Node's
 * CSPRNG. Avoids an extra package while keeping ids cryptographically random.
 */
export function customAlphabet(alphabet: string, size: number) {
  return () => {
    let id = "";
    for (let i = 0; i < size; i++) {
      id += alphabet[randomInt(0, alphabet.length)];
    }
    return id;
  };
}

/** A numeric one-time code of the given length (no leading-zero stripping). */
export function numericCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) code += randomInt(0, 10).toString();
  return code;
}
