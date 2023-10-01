const StackedList: React.FC<StackedListProps> = ({ items }) => {
  return (
    <ul role="list" className="divide-y divide-white/5">
      {items.map((item) => (
        <li key={item.id} className="py-4">
          <div className="flex items-center gap-x-3">
            <div className="h-12 w-12 flex-none text-accent relative">
              {item.image}
            </div>

            <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">
              {item.name}
            </h3>
            <time dateTime={item.date} className="flex-none text-gray-500">
              {item.date}
            </time>
          </div>
          <p className="mt-3 truncate text-sm text-gray-500">
            {item.description}
          </p>
          <p className="mt-3 truncate text-sm text-gray-500">
            {item?.alternateText}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default StackedList;
