/*
 * The address search engines should index. The apex domain is canonical:
 * www.maragathamart.com should answer with a 301 to it. Kept free of imports
 * so the build (vite.config.ts, in Node) can read it too.
 */
export const SITE_URL = "https://maragathamart.com";
