// Express Port
type ServerPort = string | number;

// 背景色、文字色など
type Color = string;

// svg表示用の文字列(日付、閲覧数)
type SvgDisplay = string[];

// svg表示用の文字列(github)
type SvgDisplayRepo = {
  display: string;
  color: string;
};

/* github */
type Query = {
  query: string;
};

type RepoNode = {
  name: string;
  color: string;
};

type RepoInfo = {
  node: RepoNode;
  size: number;
};

type RawRepo = RepoInfo[];
