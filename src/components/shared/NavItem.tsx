"use client";
import Link, { LinkProps } from "next/link";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";

interface NavItemProps extends LinkProps {
  children({ isActive }: any): React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ onClick, ...props }) => {
  const pathname = usePathname();
  const isActive = useMemo(
    () => pathname === props.href,
    [props.href, pathname]
  );

  return (
    <Link {...props} className={props.className} onClick={onClick}>
      {props.children({ isActive })}
    </Link>
  );
};

export default React.memo(NavItem);
