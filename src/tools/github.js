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
    const LANG = LANG_LIST[i]
    repo_langs.forEach((lang) => {
      if (LANG === lang) {
        count++;
      }
    });
    const RATE = Math.ceil(count / repo_langs.length * 100);
    graph.push({ lang: LANG, rate: RATE });
  }

  return graph;
}

module.exports = { ShapedData }