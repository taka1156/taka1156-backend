const { generateGithubSvg } = require('../../tools/svg/generate-svg.js');
const { fetcher } = require('../../tools/fetch/github-fetcher.js');

// リポジトリデータを、Github APIから取得してSVGに変換して返却
async function getGithubReposSvg(account = 'taka1156', bgcolor) {
  const GITHUB_URL = `https://api.github.com/graphql`;
  const QUERY = graphQLQuery(account);
  const REPOS = await fetcher(GITHUB_URL, QUERY);

  const SHAPED_REPOS = shapedGithubRepos(REPOS);
  return generateGithubSvg(SHAPED_REPOS, bgcolor);
}

// リポジトリデータを整形
function shapedGithubRepos(repos) {
  // 各リポジトリの情報を{言語、イメージカラー、サイズ}オブジェクトの配列にする
  let langs = [];
  repos.forEach((repo) => {
    repo.forEach((lang) => {
      const { size, node } = lang;
      langs.push({
        name: node.name,
        color: node.color,
        size: size,
      });
    });
  });

  // それぞれを単一の配列に整形
  const LANGS_NAME = [...new Set([...langs.map((lang) => lang.name)])];
  const LANGS_COLOR = [...new Set([...langs.map((lang) => lang.color)])];
  // 言語ごとの合計ファイルサイズの配列を作り初期化
  const LANGS_TOTAL_SIZE = new Array(LANGS_NAME.length).fill(0);

  // 言語ごとの合計データ数を算出
  LANGS_NAME.forEach((lang, index) => {
    for (let i = 0, max = langs.length; i < max; i++) {
      if (langs[i].name === lang) {
        LANGS_TOTAL_SIZE[index] += langs[i].size;
      }
    }
  });

  // 整形した各データを結合(sortした際に崩れるため、この時点で、colorも結合する)
  const REPOS_DATA = LANGS_NAME.map((lang, index) => {
    return {
      name: lang,
      color: LANGS_COLOR[index],
      size: LANGS_TOTAL_SIZE[index],
    };
  });

  // サイズの大きい順にソート
  REPOS_DATA.sort((a, b) => b.size - a.size);

  // トップ5件のみ切り出し
  const TOP_USED_LANGS = REPOS_DATA.slice(0, 5);
  // トップ5件の合計サイズ
  const TOTAL_SIZE = TOP_USED_LANGS.reduce(
    (accum, repo) => (accum += repo.size),
    0
  );

  // トップ5件の総データサイズを母数とした割合を出す
  const RESULT = TOP_USED_LANGS.map((lang) => {
    return {
      name: lang.name,
      color: lang.color,
      rate: Math.round((lang.size / TOTAL_SIZE) * 100),
    };
  });

  return RESULT;
}

function graphQLQuery(account) {
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
  }`,
  };
}

module.exports = { getGithubReposSvg };
