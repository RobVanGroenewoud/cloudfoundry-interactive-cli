#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const clipboardy = require("clipboardy");

const cf = require("./lib/cf");

const selectRunningApp = async () => {
  const runningApps = await cf.runningApps();
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "appName",
      pageSize: runningApps.length,
      message: "Select a running app",
      choices: runningApps
    }
  ]);
  return answer.appName;
};

const selectCommand = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "command",
      message: "What do you want to see?",
      choices: [
        { name: "Recent logs", value: "recentLogs" },
        { name: "Environment variables", value: "env" }
      ]
    }
  ]);
  return answer.command;
};

const copyToClipboardConfirmed = async () => {
  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "copyToClipboard",
      message: "Copy to clipboard?",
      default: false
    }
  ]);
  return answer.copyToClipboard;
};

(async () => {
  try {
    console.log("Getting apps...");
    console.log(await cf.context());

    const selectedAppName = await selectRunningApp();
    const cfCommand = await selectCommand();
    const cfOutput = await cf[cfCommand](selectedAppName);
    console.log(cfOutput);

    if (await copyToClipboardConfirmed()) {
      clipboardy.writeSync(cfOutput);
      console.log(chalk.yellow("Copied to clipboard 📋"));
    }
  } catch (error) {
    console.error(chalk.red(error));
    process.exit(1);
  }
})();
