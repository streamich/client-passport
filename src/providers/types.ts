export type CreateProviderFactory<Options> = (options: Options | any) => ProviderFactory<Options>;
export type ProviderLoader = () => Promise<Provider<any>>;

export interface ProviderFactory<Options extends {}> {
  /**
   * Loads all the provider dependencies, like gapi SDK
   * and auth2 module in Google Sign-in for Websites case.
   */
  loader: ProviderLoader;
  options: Options;
}

export interface Provider<Options> {
  createManager(options: Options): Promise<Manager>;
}

export interface Manager {
  id: string; // e.g. 'gapi.auth2'
  isSignedIn: boolean;
  user: User | null;
  onchange: (user?: User) => void;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
}

export interface User {
  id: string;
  name: string;
  token: string; // JWT token (or some other token).
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
