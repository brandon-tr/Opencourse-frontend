export default function ApiErrors({ messages = {}, className = "" }) {
  return (
    <>
      {Object.keys(messages).length > 0 && (
        <>
          {Object.values(messages).map((message: any, index) => (
            <p
              className={`${className} text-sm font-medium text-destructive`}
              key={index}
            >
              {message}
            </p>
          ))}
        </>
      )}
    </>
  );
}
