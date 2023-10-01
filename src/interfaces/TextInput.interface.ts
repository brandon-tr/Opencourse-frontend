interface TextInputProps {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  label?: string;
  className?: string; // Additional class name prop
  [key: string]: any; // Allow any other additional props
}
