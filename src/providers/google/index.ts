import {ProviderFactory, Provider, Manager, User, ProviderLoader, CreateProviderFactory} from '../types';
import {getGapi, getGapiAuth2} from './gapi';
import {GApiAuth2, GApiAuth2InitOptions, GApiAuth2Instance, GApiAuth2User, GApiAuth2BasicProfile} from './types';

export interface GoogleOptions extends GApiAuth2InitOptions {}

export class GoogleProvider implements Provider<GoogleOptions> {
  auth2: GApiAuth2;

  constructor(auth2: GApiAuth2) {
    this.auth2 = auth2;
  }

  async createManager(options: GoogleOptions) {
    const authInstance: GApiAuth2Instance = await this.auth2.init(options);
    const manager = new GoogleManager(authInstance);
    return manager;
  }
}

const noop = (() => {}) as any;

export class GoogleManager implements Manager {
  private authInstance: GApiAuth2Instance;
  id = 'gapi.auth2';
  isSignedIn: boolean;
  user: User | null = null;
  onchange = noop;

  constructor(authInstance: GApiAuth2Instance) {
    this.authInstance = authInstance;
    this.isSignedIn = authInstance.isSignedIn.get();
    if (this.isSignedIn) {
      this.user = new GoogleUser(this, authInstance.currentUser.get());
    }
    authInstance.isSignedIn.listen(this.onIsSignedIn);
    authInstance.currentUser.listen(this.onUser);
  }

  private onIsSignedIn = (isSignedIn: boolean) => {
    if (isSignedIn) {
      // Don't do anything here, because this case will be handled by
      // this.onCurrentUser method. To prevent double re-render.
    } else {
      this.isSignedIn = false;
      this.user = null;
      this.onchange(null);
    }
  };

  private onUser = (gapiUser: GApiAuth2User) => {
    // Only handle the case when user signs in. The other case should
    // be handled by this.onIsSignedIn. To prevent double re-render.
    if (gapiUser.isSignedIn()) {
      this.isSignedIn = true;
      this.user = new GoogleUser(this, gapiUser);
      this.onchange(this.user);
    }
  };

  signIn = async () => {
    await this.authInstance.signIn();
    return this.user!;
  };

  signOut = async () => {
    await this.authInstance.signOut();
  };
}

export class GoogleUser implements User {
  manager: GoogleManager;
  payload: GApiAuth2User;
  id: string;
  avatar: string;
  email: string;
  name: string;

  constructor(manager: GoogleManager, gapiUser: GApiAuth2User) {
    this.manager = manager;
    this.payload = gapiUser;

    this.id = gapiUser.getId();

    const basicProfile = gapiUser.getBasicProfile();
    this.avatar = basicProfile ? basicProfile.getImageUrl() : '';
    this.email = basicProfile ? basicProfile.getEmail() : '';
    this.name = basicProfile ? basicProfile.getName() : '';
  }

  get token(): string {
    return this.payload.getAuthResponse().id_token;
  }

  get scopes(): string[] {
    return this.payload.getGrantedScopes().split(' ');
  }

  toJSON() {
    const basicProfile = this.payload.getBasicProfile();
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      email: this.email,
      givenName: basicProfile ? basicProfile.getGivenName() : '',
      familyName: basicProfile ? basicProfile.getFamilyName() : '',
      scopes: this.scopes,
    };
  }
}

export const loader: ProviderLoader = async () => {
  await getGapi();
  const auth2 = await getGapiAuth2();
  const provider = new GoogleProvider(auth2);
  return provider;
};
