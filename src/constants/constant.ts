import { getEnv } from "./env";


export const SETTING = {
    PORT: getEnv('PORT') || 3000
}


export const SERVICE = {
    GITHUB: {
        TOKEN: getEnv('GITHUB_TOKEN')
    }
}


export const TOOLS = {
    SVG: {
        HEIGHT: 28,
        WIDTH: 27,
        DIGIT: 9,
        COLOR: 'cornflowerblue'
    }
}

export const INFRA = {
    VERCEL: {
        BLOB: {
            FILENAME: 'counters.json'
        },
        DB: {

        },
        KV: {

        }
    }
}
