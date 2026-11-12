// A tiny long-running host for the vetra-publish canary: answers HTTP on
// PORT (the instance chart probes / on 6540).
const http = require("node:http");
const crypto = require("node:crypto");
// The instance chart probes 6540 (PORT is set to 3000 for other hosts).
const port = 6540;
module.exports = { canary: true };
// First 12 hex of sha256: shows a secret arrived and which value, never the value.
const hash = (v) =>
  v === undefined ? null : crypto.createHash("sha256").update(v).digest("hex").slice(0, 12);

if (require.main === module) {
  // A setting that breaks the host: tests a failed settings-only update.
  if (process.env.CANARY_CRASH === "1") {
    console.error("CANARY_CRASH=1: exiting");
    process.exit(1);
  }
  http
    .createServer((req, res) => {
      if (req.url === "/settings") {
        res.setHeader("content-type", "application/json");
        res.end(
          JSON.stringify({
            plain: {
              PH_HOST: process.env.PH_HOST ?? null,
              ADMINS: process.env.ADMINS ?? null,
              PUBLIC_URL: process.env.PUBLIC_URL ?? null,
              VETRA_SETTINGS_REVISION: process.env.VETRA_SETTINGS_REVISION ?? null,
              CANARY_PLAIN: process.env.CANARY_PLAIN ?? null,
            },
            secretHashes: {
              CANARY_SECRET: hash(process.env.CANARY_SECRET),
              PH_WORKFLOWS_SECRETS_MASTER_KEY: hash(process.env.PH_WORKFLOWS_SECRETS_MASTER_KEY),
              PH_ATTACHMENT_URL_SIGNING_SECRET: hash(process.env.PH_ATTACHMENT_URL_SIGNING_SECRET),
            },
            database: Boolean(process.env.PH_SWITCHBOARD_DATABASE_URL),
          }),
        );
        return;
      }
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.end("<!doctype html><title>canary</title><p>vetra-publish canary</p>\n");
    })
    .listen(port, () => console.log(`canary listening on ${port}`));
}
