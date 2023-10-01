import Stats from "@/components/data-display/stats";
import { serverSideFetch } from "@/utils/serverFetch";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Admin",
  description: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const data = await serverSideFetch("/admin/stats");

  if (data.error) {
    return <ErrorMessage error={data} />;
  }
  return (
    <>
      <Stats data={data} />
    </>
  );
}
