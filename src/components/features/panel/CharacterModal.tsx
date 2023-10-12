"use client";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { motion } from "framer-motion";

const AddDataModal = ({
  isOpen,
  onClose,
  handleAddCharacter,
  register,
  setSelectedFile,
  selectedFile,
  selectedCharacter,
  editCharacter,
  setValue,
}: any) => {
  useEffect(() => {
    if (selectedCharacter) {
      setSelectedFile(selectedCharacter.node.image?.large);
      setValue("name", selectedCharacter?.node?.name?.full);
      setValue("gender", selectedCharacter?.node?.gender);
      setValue("age", selectedCharacter?.node?.age);
      setValue("role", selectedCharacter?.role);
      setValue("day", selectedCharacter?.node?.dateOfBirth.day);
      setValue("month", selectedCharacter?.node?.dateOfBirth.month);
    } else {
      setSelectedFile(null);
      setValue("name", "");
      setValue("gender", "");
      setValue("age", "");
      setValue("role", "");
      setValue("day", "");
      setValue("month", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg"];

    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setSelectedFile(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };

  const removeImage = (e: any) => {
    setSelectedFile(null);
    e.preventDefault();
  };

  const handleAddOrEdit = () => {
    if (selectedCharacter) {
      editCharacter(selectedCharacter.node.id);
    } else {
      handleAddCharacter();
    }
  };

  const HandleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed -top-10 left-0 w-full h-screen flex items-center justify-center z-[9999]">
      <div
        className="absolute w-full h-full bg-black opacity-50"
        onClick={onClose}
      ></div>

      <motion.div
        className="bg-neutral-800 w-full max-w-5xl rounded-lg p-20 z-50 py-10"
        initial={{
          opacity: 0,
          scale: 0.75,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeOut",
            duration: 0.15,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.75,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
      >
        <h2 className="text-xl font-semibold">Add character</h2>
        <div className="flex gap-6 h-auto mt-10">
          <div className="relative w-full max-w-[205px]">
            <label
              htmlFor="fileInput"
              className=" text-white  rounded-lg w-full h-auto overflow-hidden"
            >
              <div className="w-full h-full">
                {selectedFile ? (
                  <>
                    <div className="w-full h-full ">
                      <Image
                        src={selectedFile}
                        alt="Selected"
                        fill
                        unoptimized
                        className="object-cover overflow-hidden rounded-md"
                      />
                    </div>
                    <Button
                      onClick={removeImage}
                      className="absolute -bottom-12 text-white text-lg transition-all w-full hover:bg-red-600 flex justify-center"
                    >
                      Remove Image
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full cursor-pointer bg-neutral-700 rounded-md flex flex-col justify-center items-center gap-4 hover:text-primary-500 hover:bg-neutral-700/80 transition-all">
                      <AiOutlinePlus size={64} />
                      Character Image
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={(e) => {
                        handleFileChange(e);
                      }}
                    />
                  </>
                )}
              </div>
            </label>
          </div>
          <div className="w-full flex-1 flex flex-col gap-4">
            <Input
              {...register("name", { required: true })}
              containerInputClassName="focus:border border-white/80 w-full"
              label={"Name"}
              containerClassName="w-full text-gray-400 "
              className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
            />
            <Input
              {...register("gender", { required: true })}
              containerInputClassName="focus:border border-white/80 w-full"
              label={"Gender"}
              containerClassName="w-full text-gray-400 "
              className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
            />

            <div className="flex gap-8">
              <Input
                {...register("age", { required: true })}
                containerInputClassName="focus:border border-white/80 w-full"
                label={"Age"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
              />

              <Input
                {...register("role", { required: true })}
                containerInputClassName="focus:border border-white/80 w-full"
                label={"Role"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
              />
            </div>

            <div className="flex gap-8">
              <Input
                {...register("day", { required: true })}
                containerInputClassName="focus:border border-white/80 w-full"
                label={"Day"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
              />
              <Input
                {...register("month", { required: true })}
                containerInputClassName="focus:border border-white/80 w-full"
                label={"Month"}
                containerClassName="w-full text-gray-400 "
                className="px-4 py-1 text-gray-400 focus:ring-2 focus:ring-primary-500 rounded-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 mt-16">
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            onClick={handleAddOrEdit}
          >
            {selectedCharacter ? "Edit Character" : "Add Character"}
          </button>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={HandleClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDataModal;
