import { DataTable } from "@/components/data-display/data-table";
import { userColumns } from "@/app/admin/user_list/UserColumns";
import { serverSideFetch } from "@/utils/serverFetch";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User List Page | Admin",
  description: "User List Page",
};

export default async function AdminUserList() {
  const data = await serverSideFetch("/admin/get_user_list");
  if (data.error) {
    return <ErrorMessage error={data} />;
  }
  return (
    <>
      <DataTable columns={userColumns} data={data.users} />
    </>
  );
}
