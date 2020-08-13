const router = require('express').Router();
const service = require('../../service/');
const asyncHandler = require('express-async-handler'); // expressでもasync使いたい

const HEADERS = {
  'content-type': 'image/svg+xml',
  'cache-control': 'max-age=0, no-cache, no-store, must-revalidate',
};

// 簡易的な生死確認
router.get('/', (req, res) => {
  const client = req.query.client;
  if (client === 'gas') {
    res.send('Glitch woke up');
    return;
  }
  res.send('<h1>Server is running</h1>');
});

// 画像返却(閲覧回数)
router.get('/visiter.svg', asyncHandler(async (req, res) => {
    const { color  } = req.query;
    const VISITER_COUNTS_SVG = await service.getVisiterCountsSvg(color);
    res.set(HEADERS);
    res.send(VISITER_COUNTS_SVG);
  })
);

// 画像返却(日付)
router.get('/date.svg', asyncHandler(async (req, res) => {
    const { color  } = req.query;
    const DATE_SVG = service.getDateSvg(color);
    res.set(HEADERS);
    res.send(DATE_SVG);
  })
);

// 画像返却(githubの言語使用率)
router.get('/github.svg', asyncHandler(async (req, res) => {
    const { account, bgcolor} = req.query;
    const GITHUB_REPOS_SVG = await service.getGithubReposSvg(account, bgcolor);
    res.set(HEADERS);
    res.send(GITHUB_REPOS_SVG);
  })
);

module.exports = router;
