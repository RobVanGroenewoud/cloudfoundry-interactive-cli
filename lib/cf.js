const execa = require("execa");

module.exports = {
  context: async () => {
    const { stdout } = await execa("cf", ["t"]);
    return stdout;
  },
  runningApps: async () => {
    const { stdout } = await execa("cf", ["a"]);
    return stdout
      .split("\n")
      .filter(line => line.includes("started"))
      .map(line => line.split(/\s+/).shift());
  },
  recentLogs: async appName => {
    const { stdout } = await execa("cf", ["logs", "--recent", appName]);
    return stdout;
  },
  env: async appName => {
    const { stdout } = await execa("cf", ["env", appName]);
    return stdout;
  }
};
