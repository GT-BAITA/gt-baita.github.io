import { CustomLabel } from './custom-label';

export function CustomInput({
  label,
  error,
  ...props
}: { label: string; error: string | undefined } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <CustomLabel>{label}</CustomLabel>
      <input
        {...props}
        className="w-full px-3 py-2 bg-neutral-800 text-neutral-100 rounded-lg border-0 shadow-sm placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 transition-all duration-300 ease-in-out hover:bg-neutral-700"
      />
      <div className="h-5">
        {error && <p className="text-red-600 text-sm  font-light font-geist">{error}</p>}
      </div>
    </div>
  );
}
