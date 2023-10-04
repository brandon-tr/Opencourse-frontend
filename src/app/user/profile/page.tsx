import { serverSideFetch } from "@/utils/serverFetch";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import UserSettingsForm from "@/components/forms/UserSettingsForm";
import { Metadata } from "next";
import { parseUserAgent } from "@/utils/parseUserAgent";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "Personal profile page to change your account information",
};

export default async function ProfilePage() {
  const data = await serverSideFetch("/user/me");
  const userAgentInfo = [];
  if (data?.error) {
    return ErrorMessage(data.error);
  }
  for (let i = 0; i < data.user_sessions.length; i++) {
    if (data.user_sessions[i].user_agent === null) continue;
    userAgentInfo.push(parseUserAgent(data.user_sessions[i].user_agent));
  }

  const browserImageMap: { [key: string]: string } = {
    chrome: "/browserImages/chrome.svg",
    firefox: "/browserImages/firefox.svg",
    safari: "/browserImages/safari.svg",
    edge: "/browserImages/edge.svg",
    opera: "/browserImages/opera.svg",
    brave: "/browserImages/brave.svg",
    default: "/browserImages/browser.svg",
  };

  userAgentInfo.forEach((info) => {
    let browserName = info?.browser?.name?.toLowerCase() || null;
    let imageSource =
      browserImageMap[browserName] ||
      Object.entries(browserImageMap).find(
        ([key]) => browserName && browserName.includes(key),
      )?.[1] ||
      browserImageMap.default;
    info.browserImage = (
      <Image src={imageSource} alt={browserName || "browser"} fill={true} />
    );
  });

  data.userAgentInfo = userAgentInfo;

  return <UserSettingsForm {...data} {...userAgentInfo} />;
}
