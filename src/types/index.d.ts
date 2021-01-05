// Expressのポート番号
type ServerPort = string | number;

// 背景色、文字色など
type Color = string;

// svg表示用の文字列(日付、閲覧数)
type SvgDisplay = string[];

// svg表示用の文字列(github)
interface SvgDisplayRepo {
  display: string;
  color: string;
}

// axios
interface AxiosResult {
  isSuccess: boolean;
  data: RepoLang[];
}

/* github */
interface Query {
  query: string;
}

interface RepoNode {
  name: string;
  color: string;
}

interface RepoEdge {
  node: RepoNode;
  size: number;
}

interface RepoLang {
  languages: {
    edges: RepoEdge[];
  };
}
