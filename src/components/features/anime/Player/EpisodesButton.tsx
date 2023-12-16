import ControlsIcon from "@/components/features/anime/Player/ControlsIcon";
import { ControlButton, Popover } from "netplayer";
import React from "react";
import EpisodesIcon from "./EpisodesIcon";

interface EpisodesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const EpisodesButton: React.FC<EpisodesButtonProps> = ({
  children,
  className,
}) => {
  return (
    // @ts-ignore
    <Popover
      portalSelector=".netplayer-container"
      reference={
        <ControlButton className={className}>
          <ControlsIcon Icon={EpisodesIcon} />
        </ControlButton>
      }
      position="top"
      overflowElement=".netplayer-container"
    >
      {children}
    </Popover>
  );
};

export default EpisodesButton;
