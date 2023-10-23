"use client";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import AnimeCard from "./AnimeCard";

export default function SearchInDatabase({
  label,
  handleAnimeSelect,
  state,
}: any) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [`search${label}`, debouncedQuery],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/anime/search?query=${debouncedQuery}`
      );
      return res.json();
    },
  });

  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleInputChange = (event: any) => {
    setQuery(event.target.value);
  };

  const handleSuggestionSubmit = (query: any) => {
    const queryString = encodeURIComponent(query);
    router.push(`/anime/search?q=${queryString}`);
    setQuery("");
  };

  const handleSuggestionClick = (suggestion: any) => {
    handleAnimeSelect(suggestion);
    clearText();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSuggestionSubmit(query);
      setIsInputFocused(false);
    }
  };

  const clearText = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const filteredData = data?.filter(
    (suggestion: any) =>
      !state.some((selectedAnime: any) => selectedAnime.id === suggestion.id)
  );

  return (
    <div className="w-full">
      <div className="flex w-full gap-4">
        <Input
          containerClassName="w-full"
          className="p-2 placeholder:text-neutral-500 w-full"
          placeholder="Search..."
          label={label}
          onChange={handleInputChange}
          value={query}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <div className=" justify-end items-end mt-8 w-full">
          <Button primary className="p-3">
            Search
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isInputFocused && (
          <motion.ul
            className="absolute z-10 bg-neutral-800 shadow rounded mt-2 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            exit={{ opacity: 0 }}
          >
            {isLoading && isFetching ? (
              <div className="w-full h-full flex justify-center ">
                <Loading />
              </div>
            ) : debouncedQuery !== "" && filteredData.length === 0 ? (
              <div className="text-center text-gray-500 p-4">Not found...</div>
            ) : (
              filteredData?.slice(0, 6).map((suggestion: any) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 cursor-pointer bg-neutral-800 w-full hover:bg-neutral-700"
                >
                  <AnimeCard
                    title={suggestion?.title?.romaji}
                    image={suggestion.coverImage.extraLarge}
                    genres={suggestion.coverImage}
                    format={suggestion.format}
                    season={suggestion.season}
                    status={suggestion.status}
                  />
                </motion.div>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
