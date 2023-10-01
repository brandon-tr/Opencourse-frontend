interface StatsItemInterface {
  id: number;
  name: string;
  stat: string;
  icon: React.ElementType;
  change: string;
  changeType: "increase" | "decrease" | "no-change";
  showLink?: boolean;
}

interface StatsPropsInterface {
  [key: string]: {
    stat: string;
    change: number;
    changeType: StatsItemInterface["changeType"];
    start?: string;
    end?: string;
    label?: string;
  };
}
