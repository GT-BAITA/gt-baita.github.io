import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import { CustomLabel } from "./custom-label";

type ComboboxOption = {
  label: string;
  value: string;
};

export function CustomComboboxInput({
  label,
  error,
  options,
  onChange,
  onClick,
  onFocus,
  ...props
}: {
  label: string;
  error: string | undefined;
  options: ComboboxOption[];
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className="space-y-1">
      <CustomLabel>{label}</CustomLabel>
      <div className="relative">
        <input
          {...props}
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onClick={(event) => {
            setIsOpen(true);
            onClick?.(event);
          }}
          onFocus={(event) => {
            setIsOpen(true);
            onFocus?.(event);
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          className="w-full px-3 py-2 pr-11 bg-neutral-800 text-neutral-100 rounded-lg border-0 shadow-sm placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 transition-all duration-300 ease-in-out hover:bg-neutral-700"
        />
        <button
          type="button"
          aria-label="Abrir opções"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-100"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 py-1 shadow-xl"
          >
            {options.map((option) => (
              <button
                key={option.label}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option.value)}
                className="flex w-full items-center px-3 py-2 text-left text-sm text-neutral-100 transition-colors hover:bg-neutral-700"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="h-5">
        {error && (
          <p className="text-red-600 text-sm  font-light font-geist">{error}</p>
        )}
      </div>
    </div>
  );
}
