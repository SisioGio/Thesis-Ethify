const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const PORT = 4200;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Test server listening on port ${PORT}`);
  });
}

module.exports = server;
