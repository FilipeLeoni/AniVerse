import React, { useCallback, useMemo } from "react";
import Select from "./Select";
import TAGS from "@/tags.json";
import { Props } from "react-select";
import classNames from "classnames";
import useConstantTranslation from "@/hooks/useConstantTranslation";

const styles = {
  groupHeading: (provided: any) => {
    return {
      ...provided,
      fontSize: "90%",
      color: "#ccc",
      fontWeight: 600,
    };
  },
};

type OnChangeValue = {
  type: "TAGS" | "GENRES";
  value: string[];
};

interface GenresFormSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string[];
  onChange?: (values: OnChangeValue[]) => void;
  selectProps?: Omit<Props, "onChange">;
}

const tags = TAGS.map((tag: any) => ({
  value: tag,
  label: tag,
}));

const GenresFormSelect: React.FC<GenresFormSelectProps> = ({
  value = [],
  onChange = () => {},
  selectProps,
  className,
  ...props
}) => {
  const { GENRES } = useConstantTranslation();

  const groups = useMemo(() => {
    const genres = GENRES.map((genre: any) => ({
      value: genre.value as string,
      label: genre.label,
    }));

    return [
      { label: "Genres", options: genres },
      { label: "Tags", options: tags },
    ] as const;
  }, [GENRES]);

  const selectValue = useMemo(
    () =>
      groups
        .map((group) => group.options)
        .flat()
        .filter((option) => value.includes(option.value)),
    [groups, value]
  );

  const handleSelectChange = useCallback(
    (values: any) => {
      const tags: any = [];
      const genres: any = [];

      values.forEach(({ value }: any) => {
        const group: any = groups.find((group) =>
          group.options.find((option: any) => option.value === value)
        );

        if (group.label === "Tags") {
          tags.push(value);
        } else {
          genres.push(value);
        }
      });

      onChange([
        { type: "TAGS", value: tags },
        { type: "GENRES", value: genres },
      ]);
    },
    [groups, onChange]
  );

  return (
    <div className={classNames("space-y-2", className)} {...props}>
      <p className="font-semibold">Genre</p>

      <Select
        value={selectValue}
        onChange={handleSelectChange}
        isMulti
        options={groups}
        placeholder="Genre"
        styles={styles}
        {...selectProps}
      />
    </div>
  );
};

export default React.memo(GenresFormSelect);
