import fs from 'fs'


const envContent = fs.readFileSync('../.env', 'utf-8');

const lines = envContent.split('\n');

const envVariables = {};

lines.forEach((line) => {
  if (line.trim() !== '' && line.indexOf('#') !== 0) {
    const [key, value] = line.split('=');

    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    envVariables[trimmedKey] = trimmedValue;
  }
});

const config = {
  development: {
    username: envVariables["POSTGRES_USER"],
    password: envVariables["POSTGRES_PASSWORD"],
    database: envVariables["POSTGRES_DB"],
    dialect: "postgres",
    port:5432
  },
};
export default config;
