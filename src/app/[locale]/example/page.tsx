import React from "react";

export default function page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>Page</div>
      <div>
        <iframe
          id="playerDF"
          className="w-full h-full mt-2"
          src="https://video.sibnet.ru/shell.php?videoid=5263305"
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
          onload="this.onload=null;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen=""
        ></iframe>
        {/* <iframe
          src="https://vk.com/video_ext.php?oid=755747641&id=456240158&hash=e0601ae40c05ed9e"
          width="640"
          height="360"
          frameborder="0"
          allowfullscreen="1"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        ></iframe> */}
      </div>
    </div>
  );
}
