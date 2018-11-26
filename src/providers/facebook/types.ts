export interface FBInitOptions {
  appId: string;
  autoLogAppEvents?: boolean;
  xfbml?: boolean;
  version?: string;
}

export type SubscribeEvent = 'auth.authResponseChange' | 'auth.statusChange';

export interface FBSdk {
  init: (options: FBInitOptions) => void;
  getLoginStatus: (callback: (response: FBLoginStatusResponse) => void) => void;
  login: (callback: (response: FBLoginStatusResponse) => void) => void;
  logout: (callback: () => void) => void;
  getAuthResponse: () => FBLoginStatusResponse | undefined;
  Event: {
    subscribe<T>(event: SubscribeEvent, callback: (data: T) => void);
  };
}

export interface FBAuthResponse {
  accessToken: string;
  expiresIn: number;
  reauthorize_required_in: number;
  data_access_expiration_time: number;
  signedRequest: string;
  userID: string;
}

export interface FBLoginStatusResponse {
  authResponse: FBAuthResponse | undefined;
  status: 'connected' | 'authorization_expired' | 'not_authorized' | 'unknown';
}
