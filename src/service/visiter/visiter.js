const db = require('../../tools/db/sqlite.js');
const { generateVisiterSvg } = require('../../tools/svg/svgGen.js');

// 閲覧者を計算して返却
async function getVisiterCountsSvg(color) {
  const VIEWER = (await db.read()) + 1; //　閲覧数読み取り
  await db.add(VIEWER); // 更新
  return generateVisiterSvg(VIEWER, color);
}

module.exports = { getVisiterCountsSvg };
