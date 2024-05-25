import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import classNames from "classnames";
import React, { ChangeEvent, useState } from "react";

export default function AddRemoveItem({
  state,
  setState,
  label,
  className,
}: any) {
  const [newState, setNewState] = useState<string>("");

  const handleAddRemove = (
    newItem: string,
    state: any[],
    setState: React.Dispatch<React.SetStateAction<any[]>>,
    index: number | null = null,
    label?: string
  ) => {
    if (index !== null) {
      const updatedItems = [...state];
      updatedItems.splice(index, 1);
      setState(updatedItems);
    } else {
      if (newItem.trim() !== "") {
        if (
          state.length > 0 &&
          typeof state[0] === "object" &&
          state[0].hasOwnProperty("id")
        ) {
          const newItemObject = {
            id: state.length + 1,
            name: newItem,
          };
          setState([newItemObject, ...state]);
          setNewState("");
        } else {
          setState([newItem, ...state]);
          setNewState("");
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-auto w-full justify-start items-start">
      <div className="flex gap-2 items-end">
        <Input
          placeholder="Add Item"
          label={label}
          value={newState}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewState(e.target.value)
          }
          containerClassName="w-full text-gray-400"
          className="w-full text-gray-400 px-4 py-1 focus:ring-2 focus:ring-primary-500 rounded-sm placeholder:text-gray-600"
        />
        <Button
          primary
          onClick={() => handleAddRemove(newState, state, setState)}
          className="!py-1.5"
        >
          Add
        </Button>
      </div>
      <div className="overflow-ellipsis line-clamp-1 pb-10 flex mt-3 w-full">
        <ul className={classNames("flex flex-col gap-2 w-full m-0", className)}>
          {state &&
            state.length > 0 &&
            state?.map((item: any, index: number) => (
              <li
                key={item?.id || index}
                className="bg-neutral-800 rounded flex justify-between pl-2 py-1 text-gray-300"
              >
                {typeof item === "object" ? item.name : item}
                <button
                  type="button"
                  onClick={() => handleAddRemove("", state, setState, index)}
                  className="hover:bg-primary-900/80 px-2 rounded hover:text-primary-300"
                >
                  x
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
