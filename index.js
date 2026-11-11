// A tiny long-running host for the vetra-publish canary: answers HTTP on
// PORT (the instance chart probes / on 6540).
const http = require("node:http");
const port = Number(process.env.PORT) || 6540;
module.exports = { canary: true };
if (require.main === module) {
  http
    .createServer((_req, res) => res.end(`vetra-publish canary ${process.env.npm_package_version ?? ""}\n`))
    .listen(port, () => console.log(`canary listening on ${port}`));
}
