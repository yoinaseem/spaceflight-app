import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Article, ArticlesResponse } from './types';

type Response = Article[];
type Variables = {
  limit?: number;
  offset?: number;
};

export const useArticles = createQuery<Response, Variables, AxiosError>({
  queryKey: ['articles'],
  fetcher: (variables) => {
    const params = new URLSearchParams();
    if (variables.limit) params.append('limit', variables.limit.toString());
    if (variables.offset) params.append('offset', variables.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `articles?${queryString}` : 'articles';

    return client
      .get<ArticlesResponse>(url)
      .then((response) => response.data.results);
  },
});
