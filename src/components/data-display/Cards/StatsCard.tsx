import classNames from "@/utils/classNames";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PauseIcon,
} from "@heroicons/react/20/solid";

export function StatsCard(props: { item: StatsItemInterface }) {
  const { icon: IconComponent } = props.item;
  return (
    <div
      className={classNames(
        props.item.showLink ? "pb-12" : "md:mb-12",
        "relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-800/20 to-indigo-800/30 px-4 pt-5 shadow sm:px-6 sm:pt-6",
      )}
    >
      <dt>
        <div className="absolute rounded-md bg-indigo-500 p-3">
          {/*<item.icon className="h-6 w-6 text-white" aria-hidden="true" />*/}
          <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-300/80">
          {props.item.name}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-white">{props.item.stat}</p>
        <p
          className={classNames(
            props.item.changeType === "increase"
              ? "text-green-600"
              : props.item.changeType === "no-change"
              ? "text-yellow-500"
              : "text-red-600",
            "ml-2 flex items-baseline text-sm font-semibold",
          )}
        >
          {props.item.changeType === "increase" ? (
            <ArrowUpIcon
              className="h-5 w-5 flex-shrink-0 self-center text-green-500"
              aria-hidden="true"
            />
          ) : props.item.changeType === "no-change" ? (
            <PauseIcon
              className="h-5 w-5 flex-shrink-0 self-center text-yellow-500"
              aria-hidden="true"
            />
          ) : (
            <ArrowDownIcon
              className="h-5 w-5 flex-shrink-0 self-center text-red-500"
              aria-hidden="true"
            />
          )}

          <span className="sr-only">
            {" "}
            {props.item.changeType === "increase"
              ? "Increased"
              : props.item.changeType === "no-change"
              ? "No Change"
              : "Decreased"}{" "}
            by{" "}
          </span>
          {props.item.change}
        </p>
        {props.item.showLink && (
          <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
                <span className="sr-only"> {props.item.name} stats</span>
              </a>
            </div>
          </div>
        )}
      </dd>
    </div>
  );
}
