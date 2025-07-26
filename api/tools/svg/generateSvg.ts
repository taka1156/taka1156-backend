// 表示関連
const HEIGHT = 28;
const WIDTH = 27;
const DIGIT = 9; //桁
const COLOR = 'cornflowerblue';

// SVG生成(閲覧者数)
const generateVisiterSvg = (viewer: SvgDisplay, color: Color = COLOR): string => {
  const DISPLAY_NUM = viewer.reduce((accum, num, i) => {
    return (
      accum +
      `<rect id="Rectangle" fill="#000000" x=\"${
        i * WIDTH
      }\" y="0" width=\"${WIDTH}\" height=\"${HEIGHT}\"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill=\"${color}\">
            <tspan x=\"${i * WIDTH + 6}\" y="22">${num}</tspan>
        </text>`
    );
  }, '');

  return `<svg width=\"${
    WIDTH * DIGIT
  }px\" height=\"${HEIGHT}px\" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Visiter</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${DISPLAY_NUM}
        </g>
    </svg>`;
};

// SVG生成(日付)
const generateDateSvg = (date: SvgDisplay, color: Color = COLOR): string => {
  const DISPLAY_DATE = date.reduce((accum, char, i) => {
    return (
      accum +
      `<rect id="Rectangle" fill="#000000" x=\"${
        i * WIDTH
      }\" y="0" width=\"${WIDTH}\" height=\"${HEIGHT}\"></rect>
        <text id="0" font-family="Courier" font-size="25" font-weight="normal" fill=\"${color}\">
            <tspan x=\"${i * WIDTH + 6}\" y="22">${char}</tspan>
        </text>`
    );
  }, '');

  return `<svg width=\"${
    WIDTH * DIGIT
  }px\" height=\"${HEIGHT}px\" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Date</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${DISPLAY_DATE}
        </g>
    </svg>`;
};

// SVG生成(Github)
const generateGithubSvg = (
  repos: SvgDisplayRepo[],
  bgcolor: Color = 'white'
): string => {
  const DISPLAY_LANGS = repos.reduce((accum, lang, i) => {
    return (
      accum +
      `<rect id="Rectangle" fill=\"${bgcolor}\" x="0" y=\"${
        HEIGHT * i
      }\" width="400" height=\"${HEIGHT}\"></rect>
        <circle cx="8" cy=\"${HEIGHT * i + 15}\" r="6" fill=\"${lang.color}\" />
        <text id="20" font-family="Courier" font-size="24" font-weight="normal" fill=\"${
          lang.color
        }\">
          <tspan x="20" y=\"${HEIGHT * i + 20}\">${lang.display}</tspan>
        </text>`
    );
  }, '');

  return `<svg width=\"${WIDTH * 9}px\" height=\"${
    HEIGHT * repos.length - 2
  }px\" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Most Used Languages</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        ${DISPLAY_LANGS}
        </g>
    </svg>`;
};

export default { generateVisiterSvg, generateDateSvg, generateGithubSvg };
