import {loadFBSdk} from './fb';
import {FBSdk, FBInitOptions, FBLoginStatusResponse, FBSdkSubscribeEvent} from './types';
import {Provider, ProviderLoader, Manager, User, UserData} from '../types';

export interface FacebookOptions extends FBInitOptions {}

export class FacebookProvider implements Provider<FacebookOptions> {
  private fb: FBSdk;
  constructor(fb: FBSdk) {
    this.fb = fb;
  }
  async createManager(options: FacebookOptions) {
    const manager = new FacebookManager(this.fb, options);
    await manager.checkStatus();
    return manager;
  }
}

const noop = (() => {}) as any;

export interface FacebookUserData {
  name: string;
  first_name: string;
  last_name: string;
  email?: string;
  gender?: string;
  birthday?: string;
  picture: {
    data: {
      width: number;
      height: number;
      is_silhouette: boolean;
      url: string;
    };
  };
}

export class FacebookManager implements Manager {
  private fb: FBSdk;
  id = 'fb';
  isSignedIn: boolean = false;
  user: FacebookUser | null = null;
  onchange = noop;

  constructor(fb: FBSdk, options: FacebookOptions) {
    this.fb = fb;
    fb.init(options);
    const authResponse = fb.getAuthResponse();
    // tslint:disable-next-line
    this.processAuthResponse(authResponse).catch((error) => console.error(error));
  }

  private async processAuthResponse(response?: FBLoginStatusResponse): Promise<FacebookUser | null> {
    if (!response || response.status !== 'connected') {
      this.isSignedIn = false;
      this.user = null;
      this.onchange(null);
      return null;
    }

    const userData = await new Promise<FacebookUserData>((resolve, reject) => {
      this.fb.api('/me', {fields: 'name,first_name,last_name,email,gender,birthday,picture'}, (response) => {
        if (response.error) reject(response.error);
        else resolve(response);
      });
    });
    const user = new FacebookUser(this, userData, response);

    this.isSignedIn = true;
    this.user = user;
    this.onchange(user);

    return user;
  }

  async checkStatus(): Promise<void> {
    const response = await new Promise<FBLoginStatusResponse>((resolve) => {
      this.fb.getLoginStatus(resolve);
    });
    await this.processAuthResponse(response);
  }

  signIn = async () => {
    const response = await new Promise<FBLoginStatusResponse>((resolve) => {
      this.fb.login((response) => resolve(response));
    });
    return (await this.processAuthResponse(response)) as FacebookUser;
  };

  signOut = async () => {
    try {
      this.fb.logout(noop);
    } catch {}
    await this.processAuthResponse();
  };
}

export class FacebookUser implements User {
  manager: FacebookManager;
  payload: {
    userData: FacebookUserData;
    authResponse: FBLoginStatusResponse;
  };
  id: string;
  token: string;
  name: string;
  email: string;
  avatar: string;
  scopes: string[] = [];

  constructor(manager: FacebookManager, userData: FacebookUserData, status: FBLoginStatusResponse) {
    this.manager = manager;
    this.payload = {
      userData,
      authResponse: status,
    };
    this.id = status.authResponse!.userID;
    this.token = status.authResponse!.accessToken;
    this.name = userData.name;
    this.email = userData.email || '';
    this.avatar = userData.picture.data.url;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      email: this.email,
      givenName: this.payload.userData.first_name,
      familyName: this.payload.userData.last_name,
      scopes: [],
    } as UserData;
  }
}

export const loader: ProviderLoader = async () => {
  const fb = await loadFBSdk();
  const provider = new FacebookProvider(fb);
  return provider;
};
