#! /usr/bin/env node
import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import readline from "readline";

console.log("Hello, World!");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const repoUrl =
	"https://github.com/wavygoten/react-typescript-extension-boilerplate";

const args = process.argv.slice(2);
const folderArg = args.filter((arg) => !arg.includes("--"))[0];

const withYarn = args.includes("--with-yarn");

let pm = withYarn ? "yarn" : "npm";

const setup = (folderName) => {
	const gitSpinner = ora(
		chalk.green.bold(
			`Cloning create-react-typescript-extension into ${folderName}`
		)
	).start();

	exec(`git clone ${repoUrl} ${folderName}`, (gitErr, gitStdout, gitStdErr) => {
		if (gitErr) {
			gitSpinner.fail();
			console.error(
				chalk.red.bold(`Failed to clone repository: ${gitErr.message}`)
			);
			return;
		}

		gitSpinner.succeed();

		const installSpinner = ora(
			chalk.green.bold(`Installing dependencies`)
		).start();

		exec(
			`cd ${folderName} && ${pm} install --legacy-peer-deps`,
			(installErr) => {
				if (installErr) {
					installSpinner.fail();
					console.error(
						chalk.red.bold(
							`Failed to install dependencies: ${installErr.message}`
						)
					);
					return;
				}

				installSpinner.succeed();

				console.log(
					chalk.yellow(
						"\n🚧 Remember to set up your environment variables properly by:\n1. Duplicating the .env.example file, removing .example, and entering your variables\n\n"
					)
				);
				console.log(
					chalk.green.bold(
						`🚀 Successfully created project! After having filled out your .env, run '${pm} run install' to install and ${pm} start to build and develop your extension. Make sure to install it locally in your browser to test. Have fun!`
					)
				);
				rl.close();
			}
		);
	});
};

console.log(
	"  _   ____    ___ _   _  _   \n" +
		" | |_|__ /   / __| | | |/_\\ \n" +
		" |  _||_ \\  | (__| |_| / _ \\\n" +
		"  \\__|___/   \\___|\\___/_/ \\_\\\n"
);

if (!folderArg) {
	console.log(chalk.green.bold("Enter the name of the project:"));

	rl.question("> ", (folderName) => {
		if (folderName === "" || folderName.includes(" ")) {
			console.log(chalk.red.bold("Please enter a valid folder name!"));
		} else {
			console.log(" ");
			setup(folderName);
		}
		rl.close();
	});
} else {
	setup(folderArg);
}
