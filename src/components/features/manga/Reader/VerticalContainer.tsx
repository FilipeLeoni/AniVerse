import { useReadInfo } from "@/contexts/ReadContext";
import { useReadPanel } from "@/contexts/ReadPanelContext";
import { useReadSettings } from "@/contexts/ReadSettingsContext";
import React, { useEffect, useMemo } from "react";
import ReadImage from "./ReadImage";
import { useRouter } from "next/navigation";

const VerticalContainer: React.FC = () => {
  const { currentChapterIndex, chapters, setChapter, images, currentChapter } =
    useReadInfo();
  const { state, setState } = useReadPanel();
  const { direction } = useReadSettings();

  const router = useRouter();

  const sourceChapters = useMemo(
    () => chapters.filter((chapter: any) => chapter.id === currentChapter.id),
    [chapters, currentChapter]
  );

  const handleImageVisible = (index: number) => () => {
    setState((prev: any) => ({ ...prev, activeImageIndex: index }));
  };

  const handleChangeChapter = (index: number) => () => {
    setChapter(chapters[index]);

    router.push(`/manga/read/${currentChapter.mangaId}/${chapters[index].id}`);
  };

  useEffect(() => {
    const currentImageElement: any = document.querySelector(
      `[data-index="${state.activeImageIndex}"]`
    );

    if (!currentImageElement) return;

    // https://stackoverflow.com/questions/63197942/scrollintoview-not-working-properly-with-lazy-image-load
    currentImageElement.closest("div")?.scrollIntoView();

    setTimeout(() => {
      currentImageElement.closest("div")?.scrollIntoView();
    }, 600);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  return (
    <div className="w-full h-full">
      {images.map((image: any, index: any) => (
        <div className="image-container mx-auto" key={index}>
          <ReadImage
            onVisible={handleImageVisible(index)}
            className="mx-auto"
            image={image}
            data-index={index}
          />
        </div>
      ))}

      {currentChapterIndex < sourceChapters.length && (
        <div className="w-full h-60 p-8">
          <button
            onClick={handleChangeChapter(currentChapterIndex + 1)}
            className="w-full h-full border-2 border-dashed border-gray-600 text-gray-600 hover:border-white hover:text-white transition duration-300 flex items-center justify-center"
          >
            <p className="text-2xl">Next chapter</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(VerticalContainer);
