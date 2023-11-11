import classNames from "classnames";
import Image from "next/image";
import React from "react";

const Logo: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={classNames("relative flex mx-auto h-24 w-24 mb-8", className)}
      {...props}
    >
      <Image src="/logo.png" fill alt="Aniverse" className="object-contain" />
    </div>
  );
};

export default React.memo(Logo);
