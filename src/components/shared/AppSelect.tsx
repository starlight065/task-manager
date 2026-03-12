import { useEffect, useRef, useState } from "react";
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

const MENU_ANIMATION_MS = 140;
type MenuPhase = "closed" | "open" | "closing";

function AppSelect<T extends string>({
  options,
  value,
  onChange,
  inputId,
  isDisabled = false,
  className,
  size = "default",
}: AppSelectProps<T>) {
  const closeTimeoutRef = useRef<number | null>(null);
  const [menuPhase, setMenuPhase] = useState<MenuPhase>("closed");
  const selectedOption = options.find((option) => option.value === value) ?? null;
  const selectClassName = ["app-select", size === "compact" ? "app-select--compact" : null, className]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  function handleMenuOpen() {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setMenuPhase("open");
  }

  function handleMenuClose() {
    if (menuPhase !== "open") {
      return;
    }

    setMenuPhase("closing");
    closeTimeoutRef.current = window.setTimeout(() => {
      setMenuPhase("closed");
      closeTimeoutRef.current = null;
    }, MENU_ANIMATION_MS);
  }

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
      classNames={{
        menu: () => (menuPhase === "closing" ? "app-select__menu--closing" : "app-select__menu--open"),
      }}
      isDisabled={isDisabled}
      isSearchable={false}
      menuIsOpen={menuPhase !== "closed"}
      menuPlacement="auto"
      menuPortalTarget={typeof document === "undefined" ? undefined : document.body}
      menuPosition="fixed"
      onChange={handleChange}
      onMenuClose={handleMenuClose}
      onMenuOpen={handleMenuOpen}
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
