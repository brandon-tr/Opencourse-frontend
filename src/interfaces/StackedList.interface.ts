interface StackedListInterface {
  id: string | number;
  name: string;
  description: string;
  image: React.ReactNode;
  date: string;
  alternateText?: string;
}

interface StackedListProps {
  items: StackedListInterface[];
}
