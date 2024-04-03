import ArrowSwiper, { SwiperSlide } from "@/components/shared/ArrowSwiper";
import CircleButton from "@/components/shared/CircleButton";
import Select from "@/components/shared/Select";
// import { Chapter } from "@/@types";
import { groupBy, sortObjectByValue } from "@/utils";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export interface ChapterSelectorProps {
  chapters: any[];
  mediaId: any;
}

const sourcesToOptions = (sources: string[]) =>
  sources.map((source) => ({ value: source, label: source }));

const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  chapters,
  mediaId,
}) => {
  console.log("CHAPTERS HERE", chapters);
  const [isChapterExpanded, setIsChapterExpanded] = useState(false);
  console.log(mediaId);
  const [activeSource, setActiveSource] = useState(chapters[0].title);
  const [activeChapter, setActiveChapter] = useState(chapters[0]);

  useEffect(() => {
    const storedHistory: any = localStorage.getItem("aniverse_history");
    let related: any = [];

    if (storedHistory) {
      related = JSON.parse(storedHistory).readChapters || [];
    }

    const chapter = related.find(
      (item: any) => item.mangaId === Number(mediaId)
    );

    if (chapter) {
      const chapterInfo = chapters.find(
        (item: any) => item.id === Number(chapter.ChapterId)
      );

      console.log("chapterInfo", chapterInfo);
      if (chapterInfo) {
        setActiveChapter(chapter);
      }
    }
    // if (chapter) {
    //   activeId = idToFind;
    // }
    console.log("Relacionado", related);
    console.log("mediaId ==> ", mediaId);
    console.log("Verification ==>", chapter);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 24;

  // Função para calcular o intervalo de episódios para a página atual
  const calculateEpisodeRange = (pageIndex: any) => {
    const startIndex = pageIndex * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, chapters?.length);

    return `${startIndex} - ${endIndex}`;
  };

  // Função para mudar a página
  const changePage = (pageIndex: any) => {
    setCurrentPage(pageIndex);
  };

  const startIndex = currentPage * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, chapters?.length);
  const currentAnimes = chapters?.slice(startIndex - 1, endIndex);

  console.log(activeChapter);
  return (
    <React.Fragment>
      <Tabs selectedTabClassName="bg-red-600" className=" -ml-2">
        <TabList className="flex items-center justify-start gap-x-2 list-none mb-4">
          {chapters &&
            Array.from(
              { length: Math.ceil(chapters?.length / itemsPerPage) },
              (_, index) => (
                <Tab
                  key={index}
                  className="bg-background-700 px-3 py-2 rounded-[6px] w-fit cursor-pointer"
                >
                  {calculateEpisodeRange(index)}
                </Tab>
              )
            )}
        </TabList>

        {chapters && (
          <>
            <div className="flex gap-2 items-center w-full ml-3 mb-4">
              <span>Continue reading:</span>
              <Link
                href={`/manga/read/${activeChapter.mangaId}/${activeChapter.id}`}
                className="border-l-2 border-red-500 line-clamp-1 bg-background-800 pl-4 p-2 text-sm font-semibold hover:bg-white/20 duration-300 transition w-full flex-1"
              >
                <p>
                  {activeChapter.number} - {activeChapter.title}
                </p>{" "}
              </Link>
            </div>
            {Array.from(
              { length: Math.ceil(chapters?.length / itemsPerPage) },
              (_, index) => (
                <TabPanel key={index}>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full"
                    variants={{
                      animate: {
                        height: "100%",
                      },
                      initial: {
                        height: chapters.length <= 7 ? "100%" : 300,
                      },
                    }}
                    transition={{ ease: "linear" }}
                    animate={isChapterExpanded ? "animate" : "initial"}
                  >
                    {chapters.map((chapter) => (
                      <Link
                        href={`/manga/read/${chapter.mangaId}/${chapter.id}`}
                        key={chapter.id}
                      >
                        <p className="line-clamp-1 bg-background-800 pl-6 p-2 text-sm font-semibold hover:bg-white/20 duration-300 transition">
                          {chapter.number}{" "}
                          {chapter.title && `- ${chapter.title}`}
                        </p>
                      </Link>
                    ))}
                  </motion.div>
                </TabPanel>
              )
            )}
          </>
        )}
      </Tabs>

      {chapters.length > 7 && (
        <CircleButton
          onClick={() => setIsChapterExpanded(!isChapterExpanded)}
          outline
          className="absolute top-full mt-4 left-1/2 -translate-x-1/2"
          LeftIcon={isChapterExpanded ? BsChevronUp : BsChevronDown}
        />
      )}
    </React.Fragment>
  );
};

export default ChapterSelector;
