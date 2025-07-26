import { fetcher } from '@/tools/fetch/githubFetcher';

interface LangInfo {
  name: string;
  color: string;
  size: number;
}

interface ShapedRepo {
  name: string;
  color: string;
  rate: number;
}

type RepoEdges = RepoEdge[];

// リポジトリデータを、Github APIから取得して整形して返却
const getGithubRepos = async (account = 'taka1156'): Promise<SvgDisplayRepo[]> => {
  const GITHUB_URL = `https://api.github.com/graphql`;
  const QUERY = graphQLQuery(account);
  const { isSuccess, data }: AxiosResult = await fetcher(GITHUB_URL, QUERY);

  if (isSuccess && data.length !== 0) {
    const SHAPED_REPOS = shapedGithubRepos(data);
    const RESULT = calRepo(SHAPED_REPOS);
    return RESULT;
  } else {
    // アカウントが存在しない
    const ErrorSvg: SvgDisplayRepo[] = [
      {
        display: 'E: No data',
        color: '#FF2400',
      },
    ];
    return ErrorSvg;
  }
};

// リポジトリデータを整形
const shapedGithubRepos = (repos: RepoLang[]): LangInfo[] => {
  // 各リポジトリをlanguagesから切り離す
  const REPOS: RepoEdges[] = repos.map(repo => repo.languages.edges);

  // 各リポジトリの情報を{言語、イメージカラー、サイズ}オブジェクトの配列にする
  const langs: LangInfo[] = [];
  REPOS.forEach((repo: RepoEdges) => {
    repo.forEach((lang: RepoEdge) => {
      const { size, node } = lang;
      langs.push({
        name: node.name,
        color: node.color,
        size: size,
      });
    });
  });

  // それぞれを単一の配列に整形
  const LANGS_NAME: string[] = [...new Set([...langs.map(lang => lang.name)])];
  const LANGS_COLOR: string[] = [...new Set([...langs.map(lang => lang.color)])];
  // 言語ごとの合計ファイルサイズを格納する配列を作り初期化
  const LANGS_TOTAL_SIZE: number[] = new Array(LANGS_NAME.length).fill(0);

  // 言語ごとの合計データ数を算出
  LANGS_NAME.forEach((lang: string, index: number) => {
    for (let i = 0, max = langs.length; i < max; i++) {
      if (langs[i].name === lang) {
        LANGS_TOTAL_SIZE[index] += langs[i].size;
      }
    }
  });

  // 整形した各データを結合(sortした際に崩れるため、この時点で、colorも結合する)
  const REPOS_DATA: LangInfo[] = LANGS_NAME.map((lang, index) => {
    return {
      name: lang,
      color: LANGS_COLOR[index],
      size: LANGS_TOTAL_SIZE[index],
    };
  });

  return REPOS_DATA;
};

// リポジトリをsizeの降順にし、トップ五件に絞る
const calRepo = (repos: LangInfo[]): SvgDisplayRepo[] => {
  const REPOS_DATA: LangInfo[] = repos;
  // サイズの大きい順にソート
  REPOS_DATA.sort((a: LangInfo, b: LangInfo) => b.size - a.size);

  // トップ5件のみ切り出し
  const TOP_USED_LANGS: LangInfo[] = REPOS_DATA.slice(0, 5);

  // トップ5件の合計サイズ
  const TOTAL_SIZE: number = TOP_USED_LANGS.reduce(
    (accum, repo) => (accum += repo.size),
    0
  );

  // トップ5件の総データサイズを母数とした割合を出す
  const TOP_FIVE_DATA: ShapedRepo[] = TOP_USED_LANGS.map(lang => {
    return {
      name: lang.name,
      color: lang.color,
      rate: Math.round((lang.size / TOTAL_SIZE) * 100),
    };
  });

  const result = TOP_FIVE_DATA.map((repo: ShapedRepo) => {
    // 黄色は見にくいので金色に変更
    if (repo.color === '#f1e05a') {
      repo.color = 'gold';
    }

    return {
      display: `${repo.name}: ${repo.rate}%`,
      color: repo.color,
    };
  });

  return result;
};

const graphQLQuery = (account: string): Query => {
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
};

export { getGithubRepos };
