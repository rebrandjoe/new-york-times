import { serwist } from "@serwist/next/config";

export default await serwist.withNextConfig(() => ({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  esbuildOptions: {
    // The bundled runtime caching strategies check `process.env.NODE_ENV`;
    // esbuild targets the browser and won't polyfill `process` on its own.
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  },
}));
