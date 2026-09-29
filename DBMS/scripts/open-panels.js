import http from "node:http";
import { execFile } from "node:child_process";

const panels = [
  "http://127.0.0.1:5173/customer.html",
  "http://127.0.0.1:5173/kds.html",
  "http://127.0.0.1:5173/admin.html"
];
const healthUrl = "http://127.0.0.1:5173/customer.html";
const maxAttempts = 30;

function waitForFrontend(attempt = 1) {
  const request = http.get(healthUrl, (response) => {
    response.resume();
    if (response.statusCode && response.statusCode < 500) {
      openPanels();
      return;
    }
    retry(attempt);
  });

  request.on("error", () => retry(attempt));
  request.setTimeout(1000, () => {
    request.destroy();
    retry(attempt);
  });
}

function retry(attempt) {
  if (attempt >= maxAttempts) {
    console.error("Could not open panels because the frontend did not start on port 5173.");
    process.exitCode = 1;
    return;
  }
  setTimeout(() => waitForFrontend(attempt + 1), 500);
}

function openPanels() {
  for (const panel of panels) {
    if (process.platform === "win32") {
      execFile("cmd.exe", ["/c", "start", "", panel]);
    } else if (process.platform === "darwin") {
      execFile("open", [panel]);
    } else {
      execFile("xdg-open", [panel]);
    }
  }
  console.log("Opened Customer, KDS, and Admin panels.");
}

waitForFrontend();