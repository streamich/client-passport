import {ProviderLoader, Provider, Manager, User} from '../types';

const createSessionUser = (manager: Manager, token: string): User => ({
  avatar: '',
  email: '',
  id: '',
  manager,
  name: '',
  payload: {},
  scopes: [],
  token,
  toJSON: () => ({
    age: 0,
    avatar: '',
    email: '',
    familyName: '',
    givenName: '',
    id: '',
    name: '',
    scopes: [],
  }),
});

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

  options.onToken = (token) => {
    manager.user = createSessionUser(manager, token);
    manager.onchange(manager.user);
  };

  return manager;
};

export interface SessionProviderOptions {
  onToken: (token: string) => void;
}

const sessionProvider: Provider<SessionProviderOptions> = {
  createManager: async (options) => {
    const manager = createSessionManager(options);
    return manager;
  },
};

export const loader: ProviderLoader = async () => sessionProvider;
