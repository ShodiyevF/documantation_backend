import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import EnvLib from "@lib/env.lib";

const envPath = path.resolve(".env");
const outputPath = path.resolve("src/types/env_variables.d.ts");

EnvLib.checkExists()
EnvLib.checkVariables()

const fileContent = fs.readFileSync(envPath, "utf8");
const env = dotenv.parse(fileContent);

const keys = Object.keys(env);

const typeContent = `
export type EnvVariables =
${keys.map(k => `  | "${k}"`).join("\n")};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

fs.writeFileSync(outputPath, typeContent.trimStart(), "utf8");