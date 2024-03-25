import Card from "@/components/shared/Card";
import List from "@/components/shared/List";
import React from "react";

export default function MangaSchedule({ defaultQuery }: any) {
  return (
    <div>
      <div className="cursor-pointer">
        <List data={defaultQuery}>
          {(data: any) => (
            <Card
              data={data}
              redirectUrl={`/panel/schedule/manga/${data.id}`}
            />
          )}
        </List>
      </div>
    </div>
  );
}
