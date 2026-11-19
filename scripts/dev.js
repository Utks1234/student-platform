import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("==================================================");
console.log("🚀 Starting LearnX Platform Development Environment");
console.log("   - Backend API: http://localhost:5001");
console.log("   - Frontend UI: http://localhost:3000");
console.log("==================================================");

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

const backend = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(rootDir, "backend"),
  stdio: "inherit",
  shell: true,
});

const frontend = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(rootDir, "frontend"),
  stdio: "inherit",
  shell: true,
});

backend.on("error", (err) => {
  console.error("Backend process error:", err);
});

frontend.on("error", (err) => {
  console.error("Frontend process error:", err);
});

const cleanup = () => {
  console.log("\n🛑 Stopping LearnX Platform...");
  try {
    if (backend && !backend.killed) {
      if (isWin) {
        spawn("taskkill", ["/pid", backend.pid, "/f", "/t"]);
      } else {
        backend.kill("SIGINT");
      }
    }
  } catch {}
  try {
    if (frontend && !frontend.killed) {
      if (isWin) {
        spawn("taskkill", ["/pid", frontend.pid, "/f", "/t"]);
      } else {
        frontend.kill("SIGINT");
      }
    }
  } catch {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
