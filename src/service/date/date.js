const { generateDateSvg } = require('../../tools/svg/svgGen.js');

// 日付をSVG変換して返却
function getDate(color) {
  const FORMAT_DATE = new Date(new Date()).toLocaleDateString();
  return generateDateSvg(FORMAT_DATE, color);
}

module.exports = { getDate };
