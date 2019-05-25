import {ProviderLoader, Provider, Manager, User} from '../types';

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

  options.onuser = (partialUser) => {
    manager.user = createSessionUser(manager, partialUser);
    manager.onchange(manager.user);
  };

  return manager;
};

export interface SessionProviderOptions {
  onuser: (partialUser: Partial<User>) => void;
}

const sessionProvider: Provider<SessionProviderOptions> = {
  createManager: async (options) => {
    const manager = createSessionManager(options);
    return manager;
  },
};

export const loader: ProviderLoader = async () => sessionProvider;
