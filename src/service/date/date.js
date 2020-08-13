const { generateDateSvg } = require('../../tools/svg/svgGen.js');

// 日付をSVG変換して返却
function getDate(color) {
  const FORMAT_DATE = shapedDate(new Date());
  return generateDateSvg(FORMAT_DATE, color);
}

function shapedDate(date){
  const DATE = new Date(date).toLocaleDateString();
  return [ ...DATE ].map((c) => c === '-' ?  '/' : c );
}

module.exports = { getDate };
