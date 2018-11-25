import {ProviderFactory, User, Manager} from './types-provider';

export * from './types-provider';

export interface SessionManager {
  save: (providerAlias: string) => Promise<void>;
  load: () => Promise<string>;
}

export interface AuthenticatorOptions {
  providers: {[alias: string]: ProviderFactory<any>};
  session: SessionManager;
}

export interface IAuthenticator {
  signIn: (alias: string) => Promise<User>;
  signOut: () => Promise<void>;
  manager: Manager | null;
}
