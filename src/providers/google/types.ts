export interface GApi {
  load(what: 'auth2', callback: () => void);
  auth2: GApiAuth2;
}

export interface GApiAuth2InitOptions {
  client_id: string;
  scope?: string;
}

export interface GApiAuth2 {
  init(options: GApiAuth2InitOptions): Promise<GApiAuth2Instance>;
}

export type GApiAuth2InstanceIsSignedInListener = (isSignedIn: boolean) => void;
export type GApiAuth2InstanceCurrentUserListener = (isSignedIn: GApiAuth2User) => void;
export interface GApiAuth2Instance {
  signIn(): Promise<GApiAuth2User>;
  signOut(): Promise<void>;
  isSignedIn: {
    get(): boolean;
    listen(listener: GApiAuth2InstanceIsSignedInListener);
  };
  currentUser: {
    get(): GApiAuth2User;
    listen(listener: GApiAuth2InstanceCurrentUserListener);
  };
}

export interface GApiAuth2User {
  getId(): string;
  isSignedIn(): boolean;
  getHostedDomain(): string;
  getGrantedScopes(): string;
  getBasicProfile(): GApiAuth2BasicProfile | undefined;
  getAuthResponse(): GApiAuth2AuthResponse;
  reloadAuthResponse(): Promise<GApiAuth2AuthResponse>;
  hasGrantedScopes(scopes: string): boolean;
}

export interface GApiAuth2BasicProfile {
  getId(): string;
  getName(): string;
  getGivenName(): string;
  getFamilyName(): string;
  getImageUrl(): string;
  getEmail(): string;
}

export interface GApiAuth2AuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  expires_in: string;
  first_issued_at: string;
  expires_at: string;
}
