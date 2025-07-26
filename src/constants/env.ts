import dotenv from 'dotenv';


export const getEnv = (key: string) => {
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config();
        return key
    }
    return key
}
