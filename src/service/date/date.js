const { generateDateSvg } = require('../../tools/svg/svgGen.js');

// 日付をSVG変換して返却
function getDateSvg(color) {
  const FORMAT_DATE = shapedDate(new Date());
  return generateDateSvg(FORMAT_DATE, color);
}

// 日付の整形
function shapedDate(date){
  const DATE = new Date(date).toLocaleDateString();
  return [ ...DATE ].map((c) => c === '-' ?  '/' : c );
}

module.exports = { getDateSvg };
