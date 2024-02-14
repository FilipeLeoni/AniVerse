import React from "react";

// interface ContextProps {
//   manga: any;
//   chapters: Chapter[];
//   currentChapter: Chapter;
//   currentChapterIndex: number;
//   setChapter: (chapter: Chapter) => void;
//   sourceId: string;
//   images: ImageSource[];
// }

interface ReactContextProviderProps {
  value: any;
  children: React.ReactNode;
}

const ReadContext = React.createContext<any>(null);

export const ReadContextProvider: React.FC<ReactContextProviderProps> = ({
  children,
  value,
}) => {
  return <ReadContext.Provider value={value}>{children}</ReadContext.Provider>;
};

export const useReadInfo = () => {
  return React.useContext(ReadContext);
};
