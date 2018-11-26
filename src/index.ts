import Authenticator from './Authenticator';
import {AuthenticatorOptions, Required, IAuthenticator} from './types';
import createSessionManager from './createSessionManager';

export type CreateAuthenticatorOptions = Required<AuthenticatorOptions, 'providers'>;

const createAuthenticator = (opts: CreateAuthenticatorOptions): IAuthenticator => {
  const options: AuthenticatorOptions = {
    providers: opts.providers,
    session: opts.session || createSessionManager(),
  };
  const authenticator = new Authenticator(options);

  return authenticator;
};

export const passport = createAuthenticator;
