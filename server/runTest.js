const glob = require("glob");
const Mocha = require("mocha");
const fs = require("fs");
// Create a new Mocha instance
const mocha = new Mocha({
  timeout: 20000, // Set the test timeout
});
process.env.NODE_ENV = "test";

fs.readdir("testing", (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach((file) => {
    mocha.addFile("testing/" + file);
  });

  // Run the tests
  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0; // Exit with non-zero status if there are failures
    process.exit(0);
  });
});
