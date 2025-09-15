import { spawn } from "child_process";

// Set index path. 
export function setIndex(path: string){
    const args = ['-i', path];

    return runSeroost(args)
}

// Handle "index" command
export function runIndex() {
  const args = ["index"];

  return runSeroost(args);
}

// Handle "search_code" command
export function runSearch(query: string, mode = "code") {
  const args = ["-m", mode, "search", query];
  return runSeroost(args);
}

// Spawn seroost binary
function runSeroost(args: string[]) {
  return new Promise((resolve, reject) => {
    const proc = spawn("seroost", args);
    let out = "";
    let err = "";

    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (err += d.toString()));

    proc.on("close", (code) => {
      if (code === 0) {
        try {
          resolve(out);
        } catch {
          reject(new Error("Invalid JSON from Seroost: " + out));
        }
      } else {
        reject(new Error(err || "Seroost failed"));
      }
    });
  });
}
