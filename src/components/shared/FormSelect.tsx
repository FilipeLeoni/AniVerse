import React from "react";
import { Controller, ControllerProps } from "react-hook-form";
import { Props } from "react-select";
import Select from "@/components/shared/Select";

interface FormSelectProps extends Omit<ControllerProps, "render"> {
  selectProps?: Props;
  label?: string;
}

const FormSelect: any = ({ selectProps, label, ...props }: any) => {
  const { options, isMulti = false } = selectProps;

  return (
    <Controller
      {...props}
      render={({ field: { onChange, value } }) => {
        const selectValue = isMulti
          ? options.filter((c: any) => value.includes(c.value))
          : options.find((c: any) => value === c.value);

        return (
          <div className="space-y-2">
            {label && <p className="font-semibold">{label}</p>}

            <Select
              value={selectValue}
              onChange={(val: any) => {
                const onChangeValue = isMulti
                  ? val.map((c: any) => c?.value)
                  : val?.value;

                onChange(onChangeValue);
              }}
              {...selectProps}
            />
          </div>
        );
      }}
    />
  );
};

export default React.memo(FormSelect);
