import {IAuthenticator, AuthenticatorOptions} from './types';
import {Manager} from './providers/types';

class Authenticator implements IAuthenticator {
  private options: AuthenticatorOptions;
  // Active provider alias.
  private alias = '';
  private managers: {[alias: string]: Manager} = {};

  constructor (options: AuthenticatorOptions) {
    this.options = options;
  }

  private async setAlias (alias: string) {
    this.alias = alias;
    await this.options.session.save(alias);
  }

  async load () {
    const alias = await this.options.session.load();
    if (!alias) return;
    this.alias = alias;
    await this.getManager(alias);
  }

  signIn = async (alias: string = this.alias) => {
    let manager: Manager | null = this.manager;

    // Check if user is logged in, if yes, throw.
    if (manager) {
      if (manager.isSignedIn) {
        throw new Error('User is signed in, signOut before calling signIn.');
      }
    } else {
      manager = await this.getManager(alias);
    }

    const user = await manager.signIn();
    await this.setAlias(alias);

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

  get isSignedIn (): boolean {
    const manager = this.manager;
    return manager ? manager.isSignedIn : false;
  }

  async getManager (alias: string = this.alias): Promise<Manager> {
    let manager: Manager = this.managers[alias];
    if (manager) return manager;

    const providerFactory = this.options.providers[alias];
    if (!providerFactory) {
      throw new Error(`ProviderFactory "${alias}" not specified.`);
    }
    const {loader, options} = providerFactory;
    const provider = await loader();
    manager = await provider.createManager(options);

    this.managers[alias] = manager;
    
    return manager;
  }
}

export default Authenticator;
