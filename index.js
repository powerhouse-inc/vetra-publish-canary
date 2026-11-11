// A tiny long-running host for the vetra-publish canary: answers HTTP on
// PORT (the instance chart probes / on 6540).
const http = require("node:http");
// The instance chart probes 6540 (PORT is set to 3000 for other hosts).
const port = 6540;
module.exports = { canary: true };
if (require.main === module) {
  http
    .createServer((_req, res) => res.end(`vetra-publish canary (preview test)\n`))
    .listen(port, () => console.log(`canary listening on ${port}`));
}
