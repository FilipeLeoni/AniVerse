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
  console.log(duration);
  console.log(watchedTime);
  // const watchedPercentage = (watchedTime / duration) * 100;
  const watchProgressPercent = useMemo(
    () => (duration === 0 ? 0 : (watchedTime / duration) * 100),
    [watchedTime, duration]
  );
  // console.log("Porcentagem assistida:", watchedPercentage.toFixed(2) + "%");
  // const watchProgressPercent = useMemo(
  //   () => (duration === 0 ? 0 : (watchedTime / duration) * 100),
  //   [watchedTime, duration]
  // );

  // const watchProgressPercent = useMemo(() => {
  //   if (duration <= 0) return 0; // Evita divisão por zero

  //   let progress = (watchedTime / duration) * 100;
  //   progress = Math.min(progress, 100); // Limita a porcentagem a 100%

  //   return progress;
  // }, [watchedTime, duration]);

  // const watchProgressPercent = useMemo(() => {
  //   let watchedSeconds = watchedTime;
  //   let durationSeconds = duration;

  //   // Verifica se a duração está em um intervalo aceitável para ser considerada em minutos
  //   if (durationSeconds > 0 && durationSeconds < 10000) {
  //     // Se a duração estiver em minutos, converte para segundos
  //     durationSeconds *= 60;
  //     console.log("chamado");
  //   }

  //   // Verifica se o tempo assistido está em um intervalo aceitável para ser considerado em minutos
  //   if (watchedSeconds > 0 && watchedSeconds < 10000) {
  //     // Se o tempo assistido estiver em minutos, converte para segundos
  //     watchedSeconds *= 60;
  //     console.log("chamado");
  //   }

  //   if (durationSeconds <= 0) return 0; // Evita divisão por zero

  //   let progress = (watchedSeconds / durationSeconds) * 100;
  //   progress = Math.min(progress, 100); // Limita a porcentagem a 100%

  //   return progress;
  // }, [watchedTime, duration]);

  console.log(watchProgressPercent);
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

        <div className="w-full absolute bottom-0 px-2 py-4">
          <p className="text-lg font-medium leading-4 text-gray-100">
            {episode.title}
          </p>
          <p className="text-sm text-gray-300 -mt-1 line-clamp-1 overflow-ellipsis">
            {episode.description}
          </p>
        </div>

        <div className="absolute top-3 left-3 px-4 py-1 bg-background-600 rounded-m cursor-pointer rounded">
          {episode.number && (
            <p className="text-base line-clamp-1 font-semibold text-gray-300">
              {episode.number}
            </p>
          )}
        </div>

        <div
          className="absolute bottom-0 h-1 bg-primary-500 w-full"
          style={{ width: `${watchProgressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(EpisodeCard);
