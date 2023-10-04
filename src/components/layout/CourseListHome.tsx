import Image from "next/image";

const CourseListHome: React.FC<{
  response: any[];
}> = ({ response }) => {
  return (
    <ul
      role="list"
      className="lg:container grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-1 md:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 xs:pb-5"
    >
      {response.map((course) => (
        <li
          key={course.id}
          className="
          relative col-span-1 flex flex-col rounded-lg
          border-accent border-2 shadow drop-shadow pb-24
          bg-gradient-to-r from-indigo-800/20 to-indigo-500/30
          hover:transition hover:ease-in-out hover:duration-900
          hover:border-blue-200 hover:border-4 hover:transform hover:scale-110
          h-full
          "
        >
          <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg">
            <div className={"h-52 w-full relative"}>
              <Image
                priority={course.id < 3}
                src={course.image}
                alt=""
                className="pointer-events-none object-cover w-full"
                fill={true}
              />
            </div>

            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {course.title}</span>
            </button>
          </div>
          <div className={"p-4"}>
            <p className="pointer-events-none mt-2 block text-xl font-bold text-gray-100">
              {course.title}
            </p>
            <p className="pointer-events-none block text-lg font-medium text-gray-400">
              {course.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CourseListHome;
