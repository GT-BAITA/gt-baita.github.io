import { CustomLabel } from './custom-label';

export function CustomTextarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      <CustomLabel>{label}</CustomLabel>
      <textarea
        {...props}
        className="w-full px-3 py-2 bg-neutral-800 text-neutral-100 rounded-lg border-0 shadow-sm placeholder:text-neutral-500 resize-none focus:ring-2 focus:ring-white/20 transition-all duration-300 ease-in-out hover:bg-neutral-700"
      />
    </div>
  );
}
