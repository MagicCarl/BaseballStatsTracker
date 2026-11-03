"use client";

import { useAuth } from "@/providers/AuthProvider";
import { SUPPORTED_LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from "@/i18n/config";

export default function LanguageSwitcher({
  className,
  wrapperClassName = "relative inline-flex items-center",
  placeholder,
}: {
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
}) {
  const { language, setLanguage, languagePending } = useAuth();

  return (
    <div className={wrapperClassName}>
      <select
        aria-label={placeholder ?? "Language"}
        aria-busy={languagePending}
        disabled={languagePending}
        value={placeholder ? "" : language}
        onChange={(e) => {
          if (e.target.value) setLanguage(e.target.value);
        }}
        className={
          (className ??
            "rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300") +
          (languagePending ? " pr-8 opacity-60 cursor-wait" : "")
        }
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {SUPPORTED_LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_FLAGS[loc]} {LOCALE_NAMES[loc]}
          </option>
        ))}
      </select>
      {languagePending && (
        <svg
          className="pointer-events-none absolute right-2 h-4 w-4 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
    </div>
  );
}
