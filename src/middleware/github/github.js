const { generateGithubSvg } = require('../../tools/svg/svgGen.js');
const axios = require('axios');
require('dotenv').config();

// リポジトリデータを、Github APIから取得してSVGに変換して返却
async function getGithubRepos() {
  const GITHUB_ACCOUNT = process.env.GITHUB_ACCOUNT;
  const GITHUB_API = `https://api.github.com/users/${GITHUB_ACCOUNT}/repos?per_page=100&page=1`;

  const { data } = await axios.get(GITHUB_API).catch((e) => {
    console.log(e.message);
  });

  const REPOS = ShapedData(data)
  return generateGithubSvg(REPOS);
}

// リポジトリデータを整形
function ShapedData(repos) {
  let repo_langs = [];

  repos.forEach((repo) => {
    if (repo.language !== null) {
      repo_langs.push(repo.language);
    }
  });

  const LANG_LIST = [...new Set(repo_langs)];

  let graph = [];
  for (let i = 0; i < LANG_LIST.length; i++) {
    let count = 0;
    const LANG = LANG_LIST[i];
    repo_langs.forEach((lang) => {
      if (LANG === lang) {
        count++;
      }
    });
    const RATE = Math.ceil((count / repo_langs.length) * 100);
    graph.push({ lang: LANG, rate: RATE });
  }

  return graph;
}

module.exports = { getGithubRepos };
