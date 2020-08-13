const axios = require('axios');
require('dotenv').config();

async function fetcher(url, query) {
  return await axios({
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` },
    url: url,
    method: 'post',
    data: query,
  })
    .then(({ data }) => {
      let result = Array.from(data.data.user.repositories.nodes);
      result = result.filter((repo) => repo.languages.edges.length !== 0);
      return result.map((repo) => repo.languages.edges);
    })
    .catch((e) => {
      console.log(e.message);
    });
}

module.exports = { fetcher };
