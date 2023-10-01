import SiteSettingsForm from "@/components/forms/SiteSettingsForm";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { serverSideFetch } from "@/utils/serverFetch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Settings | Admin",
  description: "Site Settings",
};

export default async function AdminDashboard() {
  const data = await serverSideFetch("/admin/site_settings");
  if (process.env.NODE_ENV === "development") console.log(data);

  if (data.error) {
    return <ErrorMessage error={data} />;
  }

  return (
    <>
      <SiteSettingsForm {...data} />
    </>
  );
}
