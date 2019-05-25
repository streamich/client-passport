// Shim async iterator symbol, necessary for TypeScript so that
// iterators it returns from async generator functions have this
// symbol. `try-catch` is for tests, otherwise they throw.
try {
  (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
} catch {}

import {ProviderLoader, Provider, Manager, User} from '../types';

export interface SessionProviderOptions {
  user$: {
    subscribe: (listener: (user: Partial<User> | null) => void) => void;
  };
}

const createSessionUser = (manager: Manager, partialUser: Partial<User>): User => {
  const {avatar = '', email = '', id = '', name = '', payload = {}, scopes = [], token = ''} = partialUser;

  return {
    id,
    avatar,
    email,
    manager,
    name,
    payload,
    scopes,
    token,
    toJSON: () => ({
      id,
      name,
      age: 0,
      avatar,
      email,
      familyName: '',
      givenName: '',
      scopes,
    }),
  };
};

const createSessionManager = (options: SessionProviderOptions): Manager => {
  const signIn = async () => {
    throw new Error('Not implemented.');
  };

  const signOut = async () => {
    manager.user = null;
    manager.onchange();
  };

  const manager: Manager = {
    id: 'session',
    isSignedIn: false,
    user: null,
    onchange: () => {},
    signIn,
    signOut,
  };

  options.user$.subscribe((partialUser) => {
    if (partialUser) {
      manager.user = createSessionUser(manager, partialUser);
      manager.onchange(manager.user);
    } else {
      signOut();
    }
  });

  return manager;
};

const sessionProvider: Provider<SessionProviderOptions> = {
  createManager: async (options) => {
    const manager = createSessionManager(options);
    return manager;
  },
};

export const loader: ProviderLoader = async () => sessionProvider;
