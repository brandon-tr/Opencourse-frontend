export function ErrorMessage(props: {
  error: {
    error: boolean;
    message: string;
  };
}) {
  return (
    <h2 className={"text-xl text-white"}>
      {props.error ? props.error?.message : "Something went wrong"}
    </h2>
  );
}
