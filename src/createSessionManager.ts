import {SessionManager} from "./types";

const createSessionManager = (key: string = '__client_passport'): SessionManager => {
  return {
    save: async (str: string) => {
      window.localStorage.setItem(key, str);
    },
    load: async () => window.localStorage.getItem(key) || '',
  };
};

export default createSessionManager;
