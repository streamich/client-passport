import {ProviderFactory} from './types-provider';

export * from './types-provider';

export interface Authenticator {
  providers: {[alias: string]: ProviderFactory<any>};
  // manager: Manager;
  session: SessionManager;
}

export interface SessionManager {
  save: (providerAlias: string) => Promise<void>;
  load: () => Promise<string>;
}
