"use client";

import useDevice from "@/hooks/useDevice";
import { Editor } from "@tiptap/react";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef } from "react";
import Description, { DescriptionProps } from "./Description";

interface MediaDescriptionProps extends DescriptionProps {
  containerClassName?: string;
}

const noop = () => {};

const MediaDescription: React.FC<MediaDescriptionProps> = ({
  description,
  className,
  containerClassName,
  ...props
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);
  const ref = useRef<Editor>(null);
  const { isMobile } = useDevice();

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current?.options?.element;

    if (!element) return;

    const isClamped = element.scrollHeight > element.clientHeight;

    if (!isClamped) {
      setIsDescriptionExpanded(true);
    }
  }, []);

  const handleClick = useCallback(() => {
    setIsDescriptionExpanded(true);
  }, []);

  return (
    <div
      className={classNames("group relative", containerClassName)}
      onClick={isMobile ? handleClick : noop}
    >
      <Description
        ref={ref}
        description={description || "..."}
        className={classNames(
          isDescriptionExpanded ? "line-clamp-none" : "line-clamp-6",
          className
        )}
        {...props}
      />

      {!isDescriptionExpanded &&
        !isMobile &&
        description?.split("\n").length > 6 && (
          <button
            onClick={handleClick}
            className="bg-gradient-to-t from-background-900 via-background-900/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 absolute bottom-0 w-full h-12 text-center"
          >
            Read More
          </button>
        )}
    </div>
  );
};

export default MediaDescription;
