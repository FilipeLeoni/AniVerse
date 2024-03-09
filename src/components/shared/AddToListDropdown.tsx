"use client";

import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { BsPlusCircleFill } from "react-icons/bs";
import useUpdateWatchlist from "@/hooks/useUpdateWatchList";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { AiFillCheckCircle } from "react-icons/ai";
import { formatStatusText } from "@/utils";

export default function AddToListDropdown(props: any) {
  const { mediaId, type } = props;
  const [selected, setSelected] = useState("");
  const { data: session } = useSession();

  const options = [
    type === "MANGA" ? "READING" : "WATCHING",
    "PLANNING",
    "COMPLETED",
  ];

  const userId: any = session?.user?.id;

  const api = useApi();
  const { data: status } = useQuery({
    queryKey: ["watchlistButton", mediaId, userId],
    queryFn: async () => {
      const res = await api.getStatusById(userId, mediaId, type);
      setSelected(res.status);
      return res;
    },
  });

  const { mutate: updateWatchList } = useUpdateWatchlist();

  const handleUpdate = (status: string) => {
    if (selected === status) {
      return;
    }

    updateWatchList({
      status,
      mediaId: mediaId,
      type: type,
      hasToAdd: selected,
    });
  };

  return (
    <div>
      <Dropdown
        text={status ? formatStatusText(status.status) : "Add to list"}
        icon={status ? AiFillCheckCircle : BsPlusCircleFill}
        options={options}
        selected={selected}
        setSelected={setSelected}
        onChange={handleUpdate}
      />
    </div>
  );
}
