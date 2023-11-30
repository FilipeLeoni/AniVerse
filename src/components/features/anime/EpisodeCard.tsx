import React, { useMemo } from "react";
import Image from "@/components/shared/Image";
import Example from "../../../../public/login-background.png";
import classNames from "classnames";

interface EpisodeCardProps {
  episode: any;
  isActive?: boolean;
  watchedTime?: any;
  className?: string;
  duration?: number;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  watchedTime,
  duration = 0,
  className,
  ...props
}) => {
  const watchProgressPercent = useMemo(
    () => (duration === 0 ? 0 : (watchedTime / duration) * 100),
    [watchedTime, duration]
  );

  return (
    <div
      className={classNames(
        "relative h-40  hover:bg-white/20 cursor-pointer rounded-lg overflow-hidden group",
        className
      )}
      {...props}
    >
      <div>
        <Image
          src={episode?.thumbnail || Example}
          fill
          alt={episode.name}
          className="group-hover:scale-105 transition duration-300 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

        <div className="w-full absolute bottom-0 p-2 space-y-1">
          <p className="text-lg font-semibold">{episode.name}</p>
        </div>

        <div className="absolute top-3 left-3 px-4 py-1 bg-background-600 rounded-md">
          {episode.number && (
            <p className="text-base line-clamp-1 font-semibold text-gray-300">
              {episode.number}
            </p>
          )}
        </div>

        <div
          className="absolute bottom-0 h-1 bg-primary-500"
          style={{ width: `${watchProgressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(EpisodeCard);
