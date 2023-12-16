import { ControlButton, useVideoProps } from "netplayer";
import React from "react";
import NextIcon from "./NextIcon";
import ControlsIcon, { ControlsIconProps } from "./ControlsIcon";

const NextEpisodeButton: React.FC<Partial<ControlsIconProps>> = (props) => {
  return (
    <ControlButton>
      <ControlsIcon Icon={NextIcon} {...props} />
    </ControlButton>
  );
};

export default React.memo(NextEpisodeButton);
