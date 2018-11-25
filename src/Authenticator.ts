import {IAuthenticator, AuthenticatorOptions} from './types';
import {Manager} from './types-provider';

class Authenticator implements IAuthenticator {
  private options: AuthenticatorOptions;
  // Active provider alias.
  private alias: string;
  private managers: {[alias: string]: Manager} = {};

  constructor (options: AuthenticatorOptions) {
    this.options = options;
  }

  signIn = async (alias: string = this.alias) => {
    let manager: Manager = this.manager;

    // Check if user is logged in, if yes, throw.
    if (manager) {
      if (manager.isSignedIn) {
        throw new Error('User is signed in, signOut before calling signIn.');
      }
    }

    const providerFactory = this.options.providers[alias];
    if (!providerFactory) {
      throw new Error(`ProviderFactory "${alias}" not specified.`);
    }

    const {loader, options} = providerFactory;
    
    if (!manager) {
      const provider = await loader();
      manager = await provider.createManager(options);
    }

    const user = await manager.signIn();

    this.alias = alias;
    this.managers[alias] = manager;

    return user;
  };

  signOut = async () => {
    if (!this.alias) return;
    const manager = this.managers[this.alias];
    await manager.signOut();
  };

  get manager (): Manager | null {
    if (!this.alias) return null;
    return this.managers[this.alias];
  }
}

export default Authenticator;
