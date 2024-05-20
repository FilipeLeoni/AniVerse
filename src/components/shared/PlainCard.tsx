"use client";

import Image from "@/components/shared/Image";
import { ImageProps } from "next/image";
import React from "react";

const PlainCard: React.FC<any> = (props) => {
  const { src, alt } = props;
  return (
    <div className="relative aspect-w-2 aspect-h-3 w-auto h-auto rounded-md overflow-hidden">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      {src && (
        <Image fill style={{ objectFit: "cover" }} alt={alt} {...props} />
      )}
    </div>
  );
};

export default React.memo(PlainCard);
