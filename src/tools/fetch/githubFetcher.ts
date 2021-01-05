import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

type AxiosRaw = RawRepo[];

type RepoNodes = {
  languages: {
    edges: RepoInfo[];
  };
};

const fetcher = async (url: string, query: Query): Promise<AxiosRaw> => {
  return await axios({
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` },
    url: url,
    method: 'post',
    data: query,
  })
    .then(
      ({ data }): AxiosRaw => {
        let result: RepoNodes[] = Array.from(data.data.user.repositories.nodes);
        result = result.filter(repo => repo.languages.edges.length !== 0);
        return result.map(repo => repo.languages.edges);
      }
    )
    .catch(
      (e): AxiosRaw => {
        console.log(e.message);
        return [];
      }
    );
};

export { fetcher };
