import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Article, ArticlesResponse } from './types';

type Response = Article[];
type Variables = {
  limit?: number;
  offset?: number;
  news_site?: string;
};

export const useArticles = createQuery<Response, Variables, AxiosError>({
  queryKey: ['articles'],
  fetcher: (variables) => {
    const params = new URLSearchParams();
    if (variables.limit) params.append('limit', variables.limit.toString());
    if (variables.offset) params.append('offset', variables.offset.toString());
    if (variables.news_site) params.append('news_site', variables.news_site);

    const queryString = params.toString();
    const url = queryString ? `articles?${queryString}` : 'articles';

    return client
      .get<ArticlesResponse>(url)
      .then((response) => response.data.results);
  },
});
