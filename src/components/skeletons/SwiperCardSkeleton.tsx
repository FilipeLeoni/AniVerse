import React from "react";

function SwiperCardSkeleton() {
  return (
    <div className="flex gap-4 w-full">
      {new Array(15).fill(null).map((_, index) => (
        <div className="col-span-1" key={index}>
          <div className="aspect-w-2 aspect-h-3 bg-gray-400 w-full h-full" />
        </div>
      ))}
    </div>
  );
}

export default React.memo(SwiperCardSkeleton);
