import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Article, ArticlesResponse } from './types';

type Response = Article[];
type Variables = {
  search: string;
  limit?: number;
  offset?: number;
};

export const useSearchArticles = createQuery<Response, Variables, AxiosError>({
  queryKey: ['articles', 'search'],
  fetcher: (variables) => {
    const params = new URLSearchParams();
    params.append('search', variables.search);
    if (variables.limit) params.append('limit', variables.limit.toString());
    if (variables.offset) params.append('offset', variables.offset.toString());

    return client
      .get<ArticlesResponse>(`articles?${params.toString()}`)
      .then((response) => response.data.results);
  },
});
