import {GApi, GApiAuth2, GApiAuth2InitOptions} from "./types";

let gapiCache: GApi;

export const getGapi = async (): Promise<GApi> => {
  if (gapiCache) {
    return gapiCache;
  }

  await new Promise(resolve => {
    const gapicallback = `__gapicb${Date.now().toString(36)}`;
    (window as any)[gapicallback] = () => {
      delete (window as any)[gapicallback];
      gapiCache = (window as any).gapi;
      resolve();
    };

    const script = document.createElement('script');

    script.src = 'https://apis.google.com/js/platform.js?onload=' + gapicallback;
    document.head!.appendChild(script);
  });

  return gapiCache;
};

let gapiAuth2Cache;

export const getGapiAuth2 = async (): Promise<GApiAuth2> => {
  if (gapiAuth2Cache) {
    return gapiAuth2Cache;
  }

  const gapi = await getGapi();

  await new Promise(resolve => {
    gapi.load('auth2', () => {
      gapiAuth2Cache = gapi.auth2;
      resolve();
    });
  });

  return gapiAuth2Cache;
};

export const getGapiAuthInstance = async (options: GApiAuth2InitOptions) => {
  const gapiAuth2 = await getGapiAuth2();
  return await gapiAuth2.init(options);
};
