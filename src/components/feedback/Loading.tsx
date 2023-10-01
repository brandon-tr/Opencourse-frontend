export default function Loading() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-accent rounded-full animate-bounce"></div>
        <div className="w-8 h-8 bg-accent rounded-full animate-bounce delay-100"></div>
        <div className="w-8 h-8 bg-accent rounded-full animate-bounce delay-200"></div>
      </div>
      <p className="mt-2 text-lg font-medium text-indigo-300 dark:text-gray-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
}
