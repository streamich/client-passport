import {ProviderFactory, User, Manager} from './providers/types';

export * from './providers/types';

export interface SessionManager {
  save: (alias: string) => Promise<void>;
  load: () => Promise<string>;
}

export interface AuthenticatorOptions {
  providers: {[alias: string]: (() => Promise<ProviderFactory<any>>) | (() => ProviderFactory<any>)};
  session: SessionManager;
}

export type Listener = (user: User | null) => void;

export interface IAuthenticator {
  subscribe: (listener: Listener) => void;
  load(): Promise<void>;
  signIn: (alias: string) => Promise<User>;
  signOut: () => Promise<void>;
  // Returns active manager, if any.
  manager: Manager | null;
  // Returns active manager or tries to use existing one or create one.
  getManager(alias: string): Promise<Manager>;
  isSignedIn: boolean;
}

export type Required<T, K extends keyof T> = Partial<T> & Pick<T, K>;
