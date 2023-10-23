import Button from "@/components/shared/Button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-[9999]">
      <div
        className="absolute w-full h-full bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-neutral-800 rounded-lg p-20 z-50 py-10 flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold">{message}</h2>
        <div className="flex gap-6 h-auto mt-10">
          <Button
            primary
            className="bg-red-600 text-white rounded-md px-4 py-2"
            onClick={onConfirm}
          >
            Yes
          </Button>
          <Button
            secondary
            className="!bg-gray-300 text-gray-700 rounded-md px-4 py-2"
            onClick={onClose}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
