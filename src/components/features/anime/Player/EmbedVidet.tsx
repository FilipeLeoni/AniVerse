import React from "react";

export default function EmbedVidet() {
  return (
    <div className="w-full h-full">
      <iframe
        // src="https://video.sibnet.ru/shell.php?videoid=4826268"
        src="https://video.sibnet.ru/shell.php?videoid=4826156"
        width="100%"
        height="100%"
        allowFullScreen
      />
    </div>
  );
}
