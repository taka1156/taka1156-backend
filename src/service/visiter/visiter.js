const db = require('../../tools/db/sqlite.js');
const { generateVisiterSvg } = require('../../tools/svg/generate-svg.js');

// 閲覧者を計算して返却
async function getVisiterCountsSvg(color) {
  const VIEWER = (await db.read()) + 1; //　閲覧数読み取り
  await db.add(VIEWER); // 閲覧数更新
  const SHAPED_VIEWER = shapedVisiterCounts(VIEWER);
  return generateVisiterSvg(SHAPED_VIEWER, color);
}

// 閲覧者数の整形
function shapedVisiterCounts(viewer) {
  const ZERO_PADDING_VIEWER = zeroPadding(viewer);
  return ZERO_PADDING_VIEWER.split('');
}

// 0埋め
function zeroPadding(str, digit = 8) {
  const PADDING_CHAR = Array(10).fill(0).join('');
  return `${PADDING_CHAR + str}`.slice(-digit);
}

module.exports = { getVisiterCountsSvg };
