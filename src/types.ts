export interface Authenticator {
  providers: {[alias: string]: ProviderFactory};
  // manager: Manager;
  session: SessionManager;
}

export interface SessionManager {
  save: (providerAlias: string) => Promise<void>;
  load: () => Promise<string>;
}

export interface ProviderFactory {
  /**
   * Loads all the provider dependencies, like gapi SDK
   * and auth2 module in Google Sign-in for Websites case.
   */
  load: () => Promise<Provider>;
}

export interface Provider {
  createManager(options: object): Promise<Manager>;
}

export interface Manager {
  id: string; // e.g. 'gapi.auth2'
  isSignedIn: boolean;
  user: User;
  onstatus: (isSignedIn: boolean) => void;
  onuser: (user: User) => void;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
}

export interface User {
  id: string;
  name: string;
  token: string; // JWT token.
  email: string; // getter
  avatar: string; // getter
  scopes: string[]; // getter
  /**
   * Full response payload, specific per provider,
   * should contain user data as well as response data.
   */
  payload: object;
  manager: Manager;
  toJSON(): UserData;
}

export interface UserData {
  id: string;
  name: string;
  avatar: string;
  email: string;
  givenName?: string;
  familyName?: string;
  age?: number;
  scopes: string[];
}
