import React from "react";

export default function page({ params }: { params: { animeId: string } }) {
  console.log(params);
  return (
    <>
      <div className="pb-8">Details page</div>
    </>
  );
}
