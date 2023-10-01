import { UAParser } from "ua-parser-js";

export function parseUserAgent(userAgent: string) {
  let parser = new UAParser(userAgent);

  let returnObject: any = {
    browser: parser.getBrowser(),
    device: parser.getDevice(),
    engine: parser.getEngine(),
    os: parser.getOS(),
    ua: parser.getUA(),
    browserImage: null,
  };

  return returnObject;
}
