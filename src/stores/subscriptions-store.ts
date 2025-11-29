import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import type { IStore } from './types';

export class SubscriptionsStore implements IStore {
  followedSites: string[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate = async () => {
    await makePersistable(this, {
      name: 'SubscriptionsStore',
      properties: ['followedSites'],
      storage: undefined,
    });
  };

  followSite = (siteName: string) => {
    if (!this.followedSites.includes(siteName)) {
      this.followedSites = [...this.followedSites, siteName];
      console.log('Subscriptions:', this.followedSites);
    }
  };

  unfollowSite = (siteName: string) => {
    this.followedSites = this.followedSites.filter(name => name !== siteName);
    console.log('Subscriptions:', this.followedSites);
  };

  toggleFollow = (siteName: string) => {
    if (this.isFollowing(siteName)) {
      this.unfollowSite(siteName);
    } else {
      this.followSite(siteName);
    }
  };

  isFollowing = (siteName: string): boolean => {
    return this.followedSites.includes(siteName);
  };
}
