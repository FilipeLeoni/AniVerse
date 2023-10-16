import React from "react";
import Icon from "../../../public/book-icon.svg";
import Image from "next/image";

export default function BookIcon() {
  return (
    <Image
      src={Icon}
      alt="Icon"
      width={72}
      height={72}
      className="rounded-full hover:invert transition-all duration-500"
    />
  );
}
