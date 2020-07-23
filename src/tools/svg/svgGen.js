// 表示関連
const HEIGHT = 28;
const WIDTH = 27;
const DIGIT = 8; //桁

// 0埋め
function zeroPadding(num) {
  return ('0000000000' + num).slice(-DIGIT);
}

// SVG生成
function generateSvg(viewer) {
  // 表示関連
  const FOMAT_NUM = zeroPadding(viewer).split('');

  const DISPLAY_NUM = FOMAT_NUM.reduce((accum, num, i) => {
    return (accum + `<rect id="Rectangle" fill="#000000" x=\"${ i * WIDTH }\" y="0" width=\"${ WIDTH }\" height=\"${ HEIGHT }\"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="white">
            <tspan x=\"${ i * WIDTH + 6 }\" y="22">${ num }</tspan>
        </text>`
    );
  }, '');

  return `<svg width=\"${ WIDTH * DIGIT }px\" height=\"${ HEIGHT }px\" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Counter</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${ DISPLAY_NUM }
        </g>
    </svg>`;
}

module.exports = { generateSvg }