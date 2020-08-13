const { getVisiterCounts } = require('./visiter/visiter.js');
const { getDate } = require('./date/date.js');
const { getGithubRepos } = require('./github/github.js');

module.exports = {
  getVisiterCounts,
  getDate,
  getGithubRepos,
};
