"use client";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { InboxArrowDownIcon } from "@heroicons/react/24/solid";
import { StatsCard } from "@/components/data-display/Cards/StatsCard";

const stats: StatsItemInterface[] = [
  {
    id: 1,
    name: "Total Users",
    stat: "71,897",
    icon: UsersIcon,
    change: "122",
    changeType: "increase",
    showLink: false,
  },
  {
    id: 2,
    name: "Total Courses",
    stat: "58.16%",
    icon: EnvelopeOpenIcon,
    change: "0%",
    changeType: "no-change",
    showLink: false,
  },
  {
    id: 3,
    name: "Total Lessons",
    stat: "24.57%",
    icon: CursorArrowRaysIcon,
    change: "3.2%",
    changeType: "decrease",
    showLink: false,
  },
  {
    id: 4,
    name: "Total Email Subscribers",
    stat: "24.57%",
    icon: InboxArrowDownIcon,
    change: "3.2%",
    changeType: "decrease",
    showLink: false,
  },
];

const Stats: React.FC<{
  data: StatsPropsInterface;
}> = ({ data }) => {
  const statsMapping = [
    { dataPath: "users", statsIndex: 0 },
    { dataPath: "totalCourses", statsIndex: 1 },
  ];
  for (let i = 0; i < Object.keys(statsMapping).length; i++) {
    const { dataPath, statsIndex } = statsMapping[i];
    stats[statsIndex].stat = data[dataPath].stat;
    stats[statsIndex].change = String(data[dataPath].change);
    stats[statsIndex].changeType = data[dataPath].changeType;
  }

  console.log(data);
  return (
    <div>
      <h3 className="font-semibold leading-6 text-white text-xl">
        {data["timeFrame"]?.label}
      </h3>
      <p className={"text-gray-400 text-sm"}>
        From: {data["timeFrame"]?.start} To: {data["timeFrame"]?.end}
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item: StatsItemInterface) => (
          <StatsCard key={item.id} item={item} />
        ))}
      </dl>
    </div>
  );
};
export default Stats;
