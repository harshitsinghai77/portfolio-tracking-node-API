var cluster = require("cluster");

if (cluster.isMaster) {
  console.log("Main master thread");

  let cpuCount = require("os").cpus().length;
  
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  console.log("Child thread");
  require("./app.js");
}
