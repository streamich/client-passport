import {FBSdk} from './types';

const wnd = window as any;

export const loadFBSdk = async (): Promise<FBSdk> => {
  if (wnd.FB) return wnd.FB;
  await new Promise(resolve => {
    wnd.fbAsyncInit = resolve;
    ((d, s, id) => {
      /* tslint:disable */
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
      /* tslint:enable */
    })(document, 'script', 'facebook-jssdk');
  });
  return wnd.FB;
};
