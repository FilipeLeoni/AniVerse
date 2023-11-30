import React, { useId } from "react";

export default function Checkbox({ label, ...rest }: any) {
  const id = useId();
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="w-5 h-5 text-primary-500 cursor-pointer accent-primary-500  border-gray-300 rounded focus:ring-primary-500 bg-primary-600"
        {...rest}
      />
      <label
        htmlFor={id}
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  );
}
