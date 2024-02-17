import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import React, { ChangeEvent, useState } from "react";
import SearchInDatabase from "./SearchInDatabase";
import AnimeCard from "./AnimeCard";
import { AiOutlineClose } from "react-icons/ai";
import List from "@/components/shared/List";
import Card from "./Card";

export default function AddRemoveCard({ label, state, setState }: any) {
  // const [state, setState] = useState<any[]>([]);

  console.log(state);

  function handleAnimeSelect(anime: any) {
    if (!state?.some((selectedAnime: any) => selectedAnime.id === anime.id)) {
      setState((prevSelectedAnimes: any) => [...prevSelectedAnimes, anime]);
    } else {
      console.log("Este anime já foi adicionado à lista.");
    }
  }

  function handleRemoveAnime(animeToRemove: any) {
    setState((prevSelectedAnimes: any) =>
      prevSelectedAnimes.filter((anime: any) => anime !== animeToRemove)
    );
  }

  return (
    <div className="flex flex-col h-auto w-full">
      <div className="flex gap-2 items-end w-full">
        <SearchInDatabase
          label={label}
          handleAnimeSelect={handleAnimeSelect}
          state={state || []}
        />
      </div>
      <div className="overflow-ellipsis line-clamp-1 pb-10 flex mt-3">
        <div className="flex flex-col gap-2 w-full">
          <List data={state}>
            {(node: any) => (
              <Card
                data={node}
                handleRemoveAnime={handleRemoveAnime}
                className="relations"
              />
            )}
          </List>
        </div>
      </div>
    </div>
  );
}
