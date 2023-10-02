import { serverSideFetch } from "@/utils/serverFetch";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Metadata } from "next";
import AddCourseForm from "@/components/forms/AddCourseForm";

export const metadata: Metadata = {
  title: "Add Course | Admin",
  description: "Add a new course to the database",
};

export default async function AdminDashboard() {
  const check = serverSideFetch("/admin/view_course_create");
  const peopleReq = serverSideFetch("/admin/get_user_select_options");

  const [data, people] = await Promise.all([check, peopleReq]);

  if (data.error) {
    return <ErrorMessage error={data} />;
  }
  return (
    <>
      <AddCourseForm selectOptions={people} />
    </>
  );
}
