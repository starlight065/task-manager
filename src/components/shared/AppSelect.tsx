import Select, { type SingleValue } from "react-select";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface AppSelectProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  inputId?: string;
  isDisabled?: boolean;
  className?: string;
  size?: "default" | "compact";
}

function AppSelect<T extends string>({
  options,
  value,
  onChange,
  inputId,
  isDisabled = false,
  className,
  size = "default",
}: AppSelectProps<T>) {
  const selectedOption = options.find((option) => option.value === value) ?? null;
  const selectClassName = ["app-select", size === "compact" ? "app-select--compact" : null, className]
    .filter(Boolean)
    .join(" ");

  function handleChange(option: SingleValue<SelectOption<T>>) {
    if (option) {
      onChange(option.value);
    }
  }

  return (
    <Select<SelectOption<T>, false>
      instanceId={inputId}
      inputId={inputId}
      className={selectClassName}
      classNamePrefix="app-select"
      isDisabled={isDisabled}
      isSearchable={false}
      menuPlacement="auto"
      menuPortalTarget={typeof document === "undefined" ? undefined : document.body}
      menuPosition="fixed"
      onChange={handleChange}
      options={options}
      styles={{
        menuPortal: (baseStyles) => ({
          ...baseStyles,
          zIndex: 1100,
        }),
      }}
      unstyled
      value={selectedOption}
    />
  );
}

export default AppSelect;
