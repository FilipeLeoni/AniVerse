import Input from "@/components/shared/Input";
import React, { useState } from "react";

const AddDataModal = ({ isOpen, onClose, onSave }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave({ title, description });
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-neutral-800 w-full max-w-5xl rounded-lg p-36 z-50 py-10">
        <h2 className="text-xl font-semibold">Add character</h2>
        <Input
          containerInputClassName="focus:border border-white/80 w-full"
          label={"Name"}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          containerClassName="w-full text-gray-400 "
          className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
        />
        <Input
          containerInputClassName="focus:border border-white/80 w-full"
          label={"Gender"}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          containerClassName="w-full text-gray-400 "
          className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
        />
        <Input
          containerInputClassName="focus:border border-white/80 w-full"
          label={"Age"}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          containerClassName="w-full text-gray-400 "
          className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
        />
        <Input
          containerInputClassName="focus:border border-white/80 w-full mb-8"
          label={"Date of birthday"}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          containerClassName="w-full text-gray-400 "
          className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
        />
        <input type="file" />

        <div className="flex gap-8 mt-2">
          <button
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            onClick={handleSave}
          >
            Add Character
          </button>
          <button
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDataModal;
