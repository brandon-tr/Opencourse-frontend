import { serverSideFetch } from "@/utils/serverFetch";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Metadata } from "next";
import AddCourseForm from "@/components/forms/AddCourseForm";

export const metadata: Metadata = {
  title: "Add Course | Admin",
  description: "Add a new course to the database",
};

export default async function AdminDashboard() {
  const data = await serverSideFetch("/admin/view_course_create");

  if (data.error) {
    return <ErrorMessage error={data} />;
  }
  return (
    <>
      <AddCourseForm />
    </>
  );
}
