import dotenv from "dotenv"

export const getEnv = (key: string): string => {
    if (process.env.DEPLOY_ENV !== 'production') {
        dotenv.config({ quiet: true });
    }
    return process.env[key];
}
