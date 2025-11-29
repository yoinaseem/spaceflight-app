import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Article } from './types';

type Response = Article;
type Variables = { id: number };

export const useArticle = createQuery<Response, Variables, AxiosError>({
  queryKey: ['articles'],
  fetcher: (variables) => {
    return client
      .get<Article>(`articles/${variables.id}`)
      .then((response) => response.data);
  },
});
