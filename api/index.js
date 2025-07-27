"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const express = require("express");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const blob = require("@vercel/blob");
const axios = require("axios");
const getEnv = (key) => {
  dotenv.config({ quiet: true });
  return process.env[key];
};
const SETTING = {
  PORT: getEnv("PORT") || 3e3
};
const SERVICE = {
  GITHUB: {
    TOKEN: getEnv("GITHUB_TOKEN")
  }
};
const TOOLS = {
  SVG: {
    HEIGHT: 28,
    WIDTH: 27,
    DIGIT: 9,
    COLOR: "cornflowerblue"
  }
};
const INFRA = {
  VERCEL: {
    BLOB: {
      FILENAME: "counters.json"
    }
  }
};
const blobName = INFRA.VERCEL.BLOB.FILENAME;
const storeConfig = {
  contentType: "application/json",
  access: "public",
  allowOverwrite: true
};
const initializeCounter = async () => {
  try {
    const initialData = { viewer: 0 };
    await blob.put(blobName, JSON.stringify(initialData), storeConfig);
    console.log(`Blob '${blobName}' initialized!`);
  } catch (error) {
    console.error("Initialization error:", error);
  }
};
const ensureBlobExists = async () => {
  try {
    const blobs = await blob.list();
    const blob$1 = blobs.blobs.find((b) => b.pathname === blobName);
    if (!blob$1) {
      console.log(`Blob '${blobName}' not found. Initializing...`);
      await initializeCounter();
    } else {
      console.log(`Blob '${blobName}' already exists.`);
    }
  } catch (error) {
    console.error("Ensure Blob Error:", error);
  }
};
const resolveBlob = async (response) => {
  try {
    const blobData = await response.json();
    return blobData;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
  }
};
const incrementViewer = async (viewer) => {
  ensureBlobExists();
  try {
    const blobs = await blob.list();
    const blob$1 = blobs.blobs.find((b) => b.pathname === blobName);
    if (!blob$1) throw new Error(`Blob '${blobName}' not found`);
    const response = await fetch(blob$1.url);
    const blobData = await resolveBlob(response);
    const counter = blobData;
    counter.viewer = viewer;
    await blob.put(blobName, JSON.stringify(counter), storeConfig);
    console.log("updated viewer");
  } catch (error) {
    console.error("Update error:", error);
  }
};
const getViewerCount = async () => {
  try {
    const blobs = await blob.list();
    const blob$1 = blobs.blobs.find((b) => b.pathname === blobName);
    if (!blob$1) throw new Error(`Blob '${blobName}' not found`);
    const response = await fetch(blob$1.url);
    const blobData = await resolveBlob(response);
    console.log("read viewer");
    return blobData.viewer || 0;
  } catch (error) {
    console.error("Fetch error:", error);
    return 0;
  }
};
const verecel = {
  add: async (viewer) => await incrementViewer(Number(viewer)),
  read: async () => await getViewerCount()
};
const getVisiterCounts = async () => {
  const VIEWER = (await verecel.read() + 1).toString();
  await verecel.add(VIEWER);
  const SHAPED_VIEWER = shapedVisiterCounts(VIEWER);
  return SHAPED_VIEWER;
};
const shapedVisiterCounts = (viewer) => {
  const ZERO_PADDING_VIEWER = zeroPadding(viewer);
  return ZERO_PADDING_VIEWER.split("");
};
const zeroPadding = (str, digit = 8) => {
  const PADDING_CHAR = Array(10).fill(0).join("");
  return `${PADDING_CHAR + str}`.slice(-digit);
};
const getDate = () => {
  const SHAPED_DATE = shapedDate();
  return SHAPED_DATE;
};
const shapedDate = () => {
  const DATE = (/* @__PURE__ */ new Date()).toLocaleDateString("ja-JP");
  return [...DATE].map((c) => c === "-" ? "/" : c);
};
const fetcher = async (url, query) => {
  return await axios({
    headers: { Authorization: `bearer ${SERVICE.GITHUB.TOKEN}` },
    url,
    method: "post",
    data: query
  }).then(
    ({ data }) => {
      const user = data.data.user;
      if (user != null) {
        let result = Array.from(user.repositories.nodes);
        result = result.filter((repo) => repo.languages.edges.length !== 0);
        return { isSuccess: true, data: result };
      } else {
        return { isSuccess: true, data: [] };
      }
    }
  ).catch(
    (e) => {
      console.log(e.message);
      return { isSuccess: false, data: [] };
    }
  );
};
const getGithubRepos = async (account = "taka1156") => {
  const GITHUB_URL = `https://api.github.com/graphql`;
  const QUERY = graphQLQuery(account);
  const { isSuccess, data } = await fetcher(GITHUB_URL, QUERY);
  if (isSuccess && data.length !== 0) {
    const SHAPED_REPOS = shapedGithubRepos(data);
    const RESULT = calRepo(SHAPED_REPOS);
    return RESULT;
  } else {
    const ErrorSvg = [
      {
        display: "E: No data",
        color: "#FF2400"
      }
    ];
    return ErrorSvg;
  }
};
const shapedGithubRepos = (repos) => {
  const REPOS = repos.map((repo) => repo.languages.edges);
  const langs = [];
  REPOS.forEach((repo) => {
    repo.forEach((lang) => {
      const { size, node } = lang;
      langs.push({
        name: node.name,
        color: node.color,
        size
      });
    });
  });
  const LANGS_NAME = [.../* @__PURE__ */ new Set([...langs.map((lang) => lang.name)])];
  const LANGS_COLOR = [.../* @__PURE__ */ new Set([...langs.map((lang) => lang.color)])];
  const LANGS_TOTAL_SIZE = new Array(LANGS_NAME.length).fill(0);
  LANGS_NAME.forEach((lang, index) => {
    for (let i = 0, max = langs.length; i < max; i++) {
      if (langs[i].name === lang) {
        LANGS_TOTAL_SIZE[index] += langs[i].size;
      }
    }
  });
  const REPOS_DATA = LANGS_NAME.map((lang, index) => {
    return {
      name: lang,
      color: LANGS_COLOR[index],
      size: LANGS_TOTAL_SIZE[index]
    };
  });
  return REPOS_DATA;
};
const calRepo = (repos) => {
  const REPOS_DATA = repos;
  REPOS_DATA.sort((a, b) => b.size - a.size);
  const TOP_USED_LANGS = REPOS_DATA.slice(0, 5);
  const TOTAL_SIZE = TOP_USED_LANGS.reduce(
    (accum, repo) => accum += repo.size,
    0
  );
  const TOP_FIVE_DATA = TOP_USED_LANGS.map((lang) => {
    return {
      name: lang.name,
      color: lang.color,
      rate: Math.round(lang.size / TOTAL_SIZE * 100)
    };
  });
  const result = TOP_FIVE_DATA.map((repo) => {
    if (repo.color === "#f1e05a") {
      repo.color = "gold";
    }
    return {
      display: `${repo.name}: ${repo.rate}%`,
      color: repo.color
    };
  });
  return result;
};
const graphQLQuery = (account) => {
  return {
    query: `query {
    user(login: "${account}") {
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes {
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                color
                name
              } 
            }
          }
        }
      }
    }
  }`
  };
};
const service = {
  getVisiterCounts,
  getDate,
  getGithubRepos
};
const { HEIGHT, WIDTH, DIGIT, COLOR } = TOOLS.SVG;
const generateVisiterSvg = (viewer, color = COLOR) => {
  const DISPLAY_NUM = viewer.reduce((accum, num, i) => {
    return accum + `<rect id="Rectangle" fill="#000000" x="${i * WIDTH}" y="0" width="${WIDTH}" height="${HEIGHT}"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="${color}">
            <tspan x="${i * WIDTH + 6}" y="22">${num}</tspan>
        </text>`;
  }, "");
  return `<svg width="${WIDTH * DIGIT}px" height="${HEIGHT}px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Visiter</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${DISPLAY_NUM}
        </g>
    </svg>`;
};
const generateDateSvg = (date, color = COLOR) => {
  const DISPLAY_DATE = date.reduce((accum, char, i) => {
    return accum + `<rect id="Rectangle" fill="#000000" x="${i * WIDTH}" y="0" width="${WIDTH}" height="${HEIGHT}"></rect>
        <text id="0" font-family="Courier" font-size="25" font-weight="normal" fill="${color}">
            <tspan x="${i * WIDTH + 6}" y="22">${char}</tspan>
        </text>`;
  }, "");
  return `<svg width="${WIDTH * DIGIT}px" height="${HEIGHT}px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Date</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${DISPLAY_DATE}
        </g>
    </svg>`;
};
const generateGithubSvg = (repos, bgcolor = "white") => {
  const DISPLAY_LANGS = repos.reduce((accum, lang, i) => {
    return accum + `<rect id="Rectangle" fill="${bgcolor}" x="0" y="${HEIGHT * i}" width="400" height="${HEIGHT}"></rect>
        <circle cx="8" cy="${HEIGHT * i + 15}" r="6" fill="${lang.color}" />
        <text id="20" font-family="Courier" font-size="24" font-weight="normal" fill="${lang.color}">
          <tspan x="20" y="${HEIGHT * i + 20}">${lang.display}</tspan>
        </text>`;
  }, "");
  return `<svg width="${WIDTH * 9}px" height="${HEIGHT * repos.length - 2}px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Most Used Languages</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${DISPLAY_LANGS}
        </g>
    </svg>`;
};
const svg = { generateVisiterSvg, generateDateSvg, generateGithubSvg };
const router = express.Router();
const HEADERS = {
  "content-type": "image/svg+xml",
  "cache-control": "max-age=0, no-cache, no-store, must-revalidate"
};
router.get("/", (_, res) => {
  res.send("<h1>Server is running</h1>");
});
router.get(
  "/visiter.svg",
  asyncHandler(async (req, res) => {
    const COLOR2 = req.query.color;
    const VISITER_COUNTS = await service.getVisiterCounts();
    const VISITER_COUNTS_SVG = svg.generateVisiterSvg(VISITER_COUNTS, COLOR2);
    res.set(HEADERS);
    res.send(VISITER_COUNTS_SVG);
  })
);
router.get(
  "/date.svg",
  asyncHandler(async (req, res) => {
    const COLOR2 = req.query.color;
    const DATE = service.getDate();
    const DATE_SVG = svg.generateDateSvg(DATE, COLOR2);
    res.set(HEADERS);
    res.send(DATE_SVG);
  })
);
router.get(
  "/github.svg",
  asyncHandler(async (req, res) => {
    const ACCOUNT = req.query.account;
    const BG_COLOR = req.query.bgcolor;
    const GITHUB_REPOS = await service.getGithubRepos(ACCOUNT);
    const GITHUB_REPOS_SVG = svg.generateGithubSvg(GITHUB_REPOS, BG_COLOR);
    res.set(HEADERS);
    res.send(GITHUB_REPOS_SVG);
  })
);
const app = express();
app.use("/api/v1/", router);
const PORT = SETTING.PORT;
app.listen(PORT, () => {
  console.info("Server Start");
});
const viteNodeApp = app;
exports.default = app;
exports.viteNodeApp = viteNodeApp;
