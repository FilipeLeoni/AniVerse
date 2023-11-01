"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { BsPlusCircleFill } from "react-icons/bs";
import classNames from "classnames";
import { formatStatusText } from "@/utils";

const Dropdown = ({ text, options, icon: Icon, onChange, selected }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <Button
        primary
        className="gap-4 w-full justify-center md:flex hidden btn-dropdown z-50"
        onClick={toggleDropdown}
      >
        {Icon && <Icon className="text-2xl" />}
        {text}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="dropdown absolute bg-neutral-800 w-full flex flex-col justify-center items-center z-0"
          >
            {options.map((option: string) => (
              <motion.p
                key={option}
                className={classNames(
                  "p-3 hover:bg-neutral-700 w-full pl-5 cursor-pointer hover:text-primary-400",
                  selected === option ? "text-primary-400 " : "text-white"
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={() => {
                  onChange(option), closeDropdown();
                }}
              >
                {formatStatusText(option)}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
