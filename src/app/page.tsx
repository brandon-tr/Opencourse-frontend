import CourseListHome from "@/components/layout/CourseListHome";
import { serverSideFetch } from "@/utils/serverFetch";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";

export default async function Home() {
  const data = await serverSideFetch("/user/get_courses");

  if (data.error) {
    return <ErrorMessage error={data} />;
  } else if (!data || data.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className={"text-3xl text-gray-100 font-bold"}>
          A little empty here
        </h3>
        <p className="text-gray-300 text-xl font-semibold mt-10">
          Because No Courses Were Found.
        </p>
      </div>
    );
  }
  return (
    <>
      <h3 className={"text-center text-4xl font-extrabold text-gray-100 pb-10"}>
        Course List
      </h3>
      <CourseListHome response={data} />
    </>
  );
}
