interface UserProfileInterface {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  userAgentInfo: {
    ua: string;
    browser: {
      name: string;
      version: string;
      major: string;
    };
    engine: {
      name: string;
      version: string;
    };
    os: {
      name: string;
      version: string;
    };
    device: {
      vendor: string;
      model: string;
      type: string;
    };
    cpu: {
      architecture: string;
    };
    browserImage: null | string;
  }[];
  user_sessions: {
    id: string;
    ip_address: string;
    user_id: number;
    last_activity: number | string;
    user_agent: string;
  }[];
}
