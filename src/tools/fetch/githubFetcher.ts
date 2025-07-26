import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const fetcher = async (url: string, query: Query): Promise<AxiosResult> => {
  return await axios({
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` },
    url: url,
    method: 'post',
    data: query,
  })
    .then(
      ({ data }): AxiosResult => {
        const user = data.data.user;
        if (user != null) {
          let result: RepoLang[] = Array.from(user.repositories.nodes);
          result = result.filter(repo => repo.languages.edges.length !== 0);
          return { isSuccess: true, data: result };
        } else {
          return { isSuccess: true, data: [] };
        }
      }
    )
    .catch(
      (e): AxiosResult => {
        console.log(e.message);
        return { isSuccess: false, data: [] };
      }
    );
};

export { fetcher };
