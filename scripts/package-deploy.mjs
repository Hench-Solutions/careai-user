// Collects everything the server needs into ./deploy (upload its contents to the host).
import { cpSync, existsSync, rmSync } from "node:fs";

// `clean` runs before the build so nothing from an earlier build can be uploaded.
if (process.argv[2] === "clean") {
  for (const dir of [".next/standalone", ".next/static", "deploy"])
    rmSync(dir, { recursive: true, force: true });
  process.exit(0);
}

const standalone = ".next/standalone";
if (!existsSync(`${standalone}/server.js`)) {
  console.error(
    "Run `npm run deploy`; .next/standalone/server.js is missing.",
  );
  process.exit(1);
}
rmSync("deploy", { recursive: true, force: true });
cpSync(standalone, "deploy", { recursive: true });
cpSync(".next/static", "deploy/.next/static", { recursive: true });
rmSync("deploy/.env", { force: true }); // local values; production ones live in .env.production
if (existsSync("public"))
  cpSync("public", "deploy/public", { recursive: true });
console.log(
  "Ready: upload the contents of ./deploy. Start command: node server.js",
);
