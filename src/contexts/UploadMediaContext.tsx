import React from "react";

interface ContextProps {
  sourceId: any;
  mediaId: number;
}

interface UploadMediaProviderProps {
  children: React.ReactNode;
  value: any;
}

const UploadMedia = React.createContext<ContextProps | null>(null);

export const UploadMediaProvider: React.FC<UploadMediaProviderProps> = ({
  children,
  value,
}) => {
  return <UploadMedia.Provider value={value}>{children}</UploadMedia.Provider>;
};

export const useUploadMediaInfo = () => {
  return React.useContext(UploadMedia);
};
