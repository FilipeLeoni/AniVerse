import React from "react";
import { Controller } from "react-hook-form";
import Checkbox from "./Checkbox";

function ControlledCheckbox({
  control,
  name,
  label,
  rules,
  ...InputProps
}: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Checkbox
          label={label}
          value={field.value}
          onChange={field.onChange}
          {...InputProps}
        />
      )}
    />
  );
}

export default React.memo(ControlledCheckbox);
