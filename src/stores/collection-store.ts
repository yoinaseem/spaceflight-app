import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import type { Article } from '@/api/articles';
import type { IStore } from './types';

export type Collection = {
  id: string;
  name: string;
  articles: Article[];
  createdAt: number;
};

export class CollectionStore implements IStore {
  collections: Collection[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate = async () => {
    await makePersistable(this, {
      name: 'CollectionStore',
      properties: ['collections'],
      storage: undefined, // Uses the globally configured storage from _hydration.ts
    });

    // Create default "Favourites" collection if no collections exist
    if (this.collections.length === 0) {
      this.createCollection('Favourites');
    }
  };

  createCollection = (name: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      articles: [],
      createdAt: Date.now(),
    };
    this.collections = [...this.collections, newCollection];
    return newCollection;
  };

  deleteCollection = (collectionId: string) => {
    // Prevent deleting the Favourites collection
    const collection = this.collections.find((c) => c.id === collectionId);
    if (collection?.name === 'Favourites') {
      return;
    }
    this.collections = this.collections.filter((c) => c.id !== collectionId);
  };

  addArticleToCollection = (collectionId: string, article: Article) => {
    const collectionIndex = this.collections.findIndex((c) => c.id === collectionId);
    if (collectionIndex === -1) return;

    // Check if article already exists in collection
    const exists = this.collections[collectionIndex].articles.some((a) => a.id === article.id);
    if (!exists) {
      this.collections = this.collections.map((c, i) =>
        i === collectionIndex
          ? { ...c, articles: [article, ...c.articles] }
          : c
      );
    }
  };

  removeArticleFromCollection = (collectionId: string, articleId: number) => {
    const collectionIndex = this.collections.findIndex((c) => c.id === collectionId);
    if (collectionIndex === -1) return;

    this.collections = this.collections.map((c, i) =>
      i === collectionIndex
        ? { ...c, articles: c.articles.filter((a) => a.id !== articleId) }
        : c
    );
  };

  isArticleInCollection = (collectionId: string, articleId: number): boolean => {
    const collection = this.collections.find((c) => c.id === collectionId);
    if (!collection) return false;

    return collection.articles.some((a) => a.id === articleId);
  };

  getCollectionsForArticle = (articleId: number): Collection[] => {
    return this.collections.filter((collection) =>
      collection.articles.some((a) => a.id === articleId)
    );
  };

  renameCollection = (collectionId: string, newName: string) => {
    const collectionIndex = this.collections.findIndex((c) => c.id === collectionId);
    if (collectionIndex === -1) return;

    // Prevent renaming the Favourites collection
    if (this.collections[collectionIndex].name === 'Favourites') {
      return;
    }

    this.collections = this.collections.map((c, i) =>
      i === collectionIndex ? { ...c, name: newName } : c
    );
  };
}
