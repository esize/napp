import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));
 
// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti("./env.mjs");
 
/** @type {import('next').NextConfig} */
export default {
  /** ... */
};