import dotenv from "dotenv"

export const getEnv = (key: string): string => {
    dotenv.config({ quiet: true });
    return process.env[key];
}
