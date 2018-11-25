import Authenticator from './Authenticator';
import {AuthenticatorOptions, Required} from './types';

export type CreateAuthenticatorOptions = Required<AuthenticatorOptions, 'providers'>;

const createAuthenticator = (opts: CreateAuthenticatorOptions): Authenticator => {
  const options: AuthenticatorOptions = {
    providers: opts.providers,
    session: null as any,
  };
  const authenticator = new Authenticator(options);

  return authenticator;
};

export const passport = createAuthenticator;
