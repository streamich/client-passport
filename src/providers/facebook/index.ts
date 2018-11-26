import {loadFBSdk} from './fb';
import {FBSdk, FBInitOptions} from './types';
import {Provider, ProviderLoader, Manager} from '../types';
import {noop} from 'rxjs';

export interface FacebookOptions extends FBInitOptions {
}

export class FacebookProvider implements Provider<FacebookOptions> {
  private fb: FBSdk;

  constructor (fb: FBSdk) {
    this.fb = fb;
  }

  createManager (options: FacebookOptions) {
    const manager = new FacebookManager(this.fb);
    return manager;
  }
}

const noop = (() => {}) as any;

export class FacebookManager implements Manager {
  private fb: FBSdk;
  id = 'fb';
  onchange = noop;
  isSignedIn: boolean = false;

  constructor (fb: FBSdk) {
    this.fb = fb;
  }

  signIn = async () => {
    await new Promise(resolve => {
      this.fb.login(response => {
        console.log('login', response);
      });
    });
  };

  signOut = () =>
    new Promise<void>(resolve => {
      this.fb.logout(((logout) => {
        console.log('logout', logout);
        resolve();
      }) as any);
    });
}

export const loader: ProviderLoader = async () => {
  const fb = await loadFBSdk();
  const provider = new FacebookProvider(fb);
  return provider;
};
