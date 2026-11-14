import { spawnSync, spawn } from "node:child_process";
const build = spawnSync(process.execPath, ["scripts/build.mjs"], {
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status || 1);
const args = [];
for (const arg of process.argv.slice(2)) {
  if (arg === "--strictPort") continue;
  args.push(arg === "--host" ? "--ip" : arg);
}
const child = spawn(
  process.execPath,
  ["node_modules/wrangler/bin/wrangler.js", "dev", ...args],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code || 0));
