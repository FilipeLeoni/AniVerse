import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Modal, { ModalRef } from "@/components/shared/Modal";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

interface GuestRegisterProps {
  onRegister?: (name: string) => void;
}

const GuestRegister: React.FC<GuestRegisterProps> = ({ onRegister }) => {
  const modalRef = useRef<ModalRef>(null);
  const [name, setName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRegister = () => {
    if (!name) {
      toast.error("Please enter a name");

      return;
    }

    onRegister?.(name);
  };

  return (
    <Modal
      className="md:w-1/3 w-11/12"
      defaultValue={true}
      closeOnClickOutside={false}
      ref={modalRef}
    >
      <h1 className="text-2xl font-semibold mb-1">Basic register</h1>

      <p className="text-lg mb-4">
        Because you haven&apos;t logged in, you can use any name.
      </p>

      <Input
        onChange={handleInputChange}
        placeholder="Peter Parker"
        containerClassName="mb-8"
        className="px-2 py-3"
      />

      <Button onClick={handleRegister} primary>
        Start watching
      </Button>
    </Modal>
  );
};

export default GuestRegister;
