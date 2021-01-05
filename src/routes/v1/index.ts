import express from 'express';
import asyncHandler from 'express-async-handler'; // expressでもasync使いたい
import service from '~/service/index';
import svg from '~/tools/svg/generateSvg';

const router: express.Router = express.Router();

type param = string | undefined;

const HEADERS = {
  'content-type': 'image/svg+xml',
  'cache-control': 'max-age=0, no-cache, no-store, must-revalidate',
};

// 簡易的な生死確認
router.get('/', (req, res) => {
  const client = req.query.client as param;
  if (client === 'gas') {
    res.send('Glitch woke up');
    return;
  }
  res.send('<h1>Server is running</h1>');
});

// 画像返却(閲覧回数)
router.get(
  '/visiter.svg',
  asyncHandler(async (req, res) => {
    const COLOR = req.query.color as param;
    const VISITER_COUNTS = await service.getVisiterCounts();
    const VISITER_COUNTS_SVG = svg.generateVisiterSvg(VISITER_COUNTS, COLOR);
    res.set(HEADERS);
    res.send(VISITER_COUNTS_SVG);
  })
);

// 画像返却(日付)
router.get(
  '/date.svg',
  asyncHandler(async (req, res) => {
    const COLOR = req.query.color as param;
    const DATE = service.getDate();
    const DATE_SVG = svg.generateDateSvg(DATE, COLOR);
    res.set(HEADERS);
    res.send(DATE_SVG);
  })
);

// 画像返却(githubの言語使用率)
router.get(
  '/github.svg',
  asyncHandler(async (req, res) => {
    const ACCOUNT = req.query.account as param;
    const BG_COLOR = req.query.bgcolor as param;
    const GITHUB_REPOS = await service.getGithubRepos(ACCOUNT);
    const GITHUB_REPOS_SVG = svg.generateGithubSvg(GITHUB_REPOS, BG_COLOR);
    res.set(HEADERS);
    res.send(GITHUB_REPOS_SVG);
  })
);

export { router };
