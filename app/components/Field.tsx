type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

export default function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
