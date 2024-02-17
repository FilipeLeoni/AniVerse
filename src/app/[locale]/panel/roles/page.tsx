import UploadContainer from "@/components/features/upload/UploadContainer";
import React from "react";

export default function page() {
  return (
    <div>
      <UploadContainer isVerified={true} className="relative">
        <h1 className="font-semibold text-2xl">ROLES PERMISSION</h1>
      </UploadContainer>
    </div>
  );
}
