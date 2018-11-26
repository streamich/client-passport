import {loadFBSdk} from './fb';
import {FBSdk, FBInitOptions, FBLoginStatusResponse} from './types';
import {Provider, ProviderLoader, Manager, User} from '../types';

export interface FacebookOptions extends FBInitOptions {
}

export class FacebookProvider implements Provider<FacebookOptions> {
  private fb: FBSdk;
  constructor (fb: FBSdk) {
    this.fb = fb;
  }
  createManager (options: FacebookOptions) {
    const manager = new FacebookManager(this.fb, options);
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
    }
  }
}

export class FacebookManager implements Manager {
  private fb: FBSdk;
  id = 'fb';
  isSignedIn: boolean = false;
  user: FacebookUser | null = null;
  onchange = noop;

  constructor (fb: FBSdk, options: FacebookOptions) {
    this.fb = fb;
    fb.init(options);

    // fb.Event.subscribe('auth.statusChange', this.onStatusChange);
    // fb.Event.subscribe('auth.authResponseChange', this.onAuthResponseChange);

    const authResponse = fb.getAuthResponse();
    // tslint:disable-next-line
    this.processAuthResponse(authResponse).catch(error => console.error(error));
  }

  private async processAuthResponse (response: FBLoginStatusResponse): Promise<FacebookUser> {
    if (!response || (response.status !== 'connected')) {
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

  onStatusChange = async (authResponse: FBLoginStatusResponse) => {
    await this.processAuthResponse(authResponse);
  };

  onAuthResponseChange = async (authResponse) => {
    await this.processAuthResponse(authResponse);
  };

  signIn = async () => {
    const response = await new Promise<FBLoginStatusResponse>(resolve => {
      this.fb.login(response => resolve(response));
    });
    return await this.processAuthResponse(response);
  };

  signOut = async () => {
    const response = await new Promise<FBLoginStatusResponse>(resolve => this.fb.logout(resolve));
    console.log('sign out', response);
    await this.processAuthResponse(response);
  };
}

export class FacebookUser implements User {
  manager: FacebookManager;
  payload: {
    userData: FacebookUserData,
    authResponse: FBLoginStatusResponse,
  };
  id: string;
  token: string;
  name: string;
  email: string | undefined;
  avatar: string;
  scopes: string[] = [];
  
  constructor (manager: FacebookManager, userData: FacebookUserData, authResponse: FBLoginStatusResponse) {
    this.manager = manager;
    this.payload = {
      userData,
      authResponse,
    };
    this.id = authResponse.authResponse.userID;
    this.token = authResponse.authResponse.accessToken;
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.picture.data.url;  
  }

  toJSON () {
    return {} as any;
  }
}

export const loader: ProviderLoader = async () => {
  const fb = await loadFBSdk();
  const provider = new FacebookProvider(fb);
  return provider;
};
