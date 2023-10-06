import Input from "@/components/shared/Input";
import classNames from "classnames";
import React from "react";

interface InfoItemProps {
  title: string;
  value?: string | number | React.ReactNode;
  className?: string;
}

const InfoItemEdit: React.FC<InfoItemProps> = ({ title, value, className }) => {
  return value ? (
    <div className={classNames("text-gray-400", className)}>
      <p className="font-semibold">{title}</p>
      <div className="whitespace-pre-line flex flex-row md:flex-col gap-2 -mb-2">
        <Input
          label={"Title"}
          value={title}
          // onChange={(e) => setQuery(e.target)}
          containerClassName="w-full md:w-1/3 mb-8"
          className="px-4 py-1 text-white text-3xl"
        />
      </div>
    </div>
  ) : null;
};

export default InfoItemEdit;
