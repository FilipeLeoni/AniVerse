import Button from "@/components/shared/Button";
import { AdditionalUser } from "@/@types";
import React, { useRef, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import { IoMdCheckmark } from "react-icons/io";
import useUpdateBanner from "@/hooks/useUpdateBanner";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateBannerProps {
  user: AdditionalUser;
}

const UpdateBanner: React.FC<UpdateBannerProps> = ({ user }) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const bannerUrlRef = useRef<string>("");
  const fileRef = useRef<any>(null);
  const fileInputRef: any = useRef(null);

  const queryClient = useQueryClient();

  const { mutate: updateBanner, isLoading: updateBannerLoading } =
    useUpdateBanner();

  const optimisticUpdate: any = (
    updateFn: (oldData: AdditionalUser) => Partial<AdditionalUser>
  ) => {
    queryClient.setQueryData<AdditionalUser>(
      ["user-profile", user.id],

      (old: any) => {
        const newData = updateFn(old);

        return {
          ...old,
          ...newData,
        };
      }
    );
  };

  const handleCancelPreview: any = () => {
    setIsPreviewing(false);

    fileRef.current = null;
    fileInputRef.current.value = null;

    optimisticUpdate(() => {
      return { bannerPicture: bannerUrlRef.current };
    });
  };

  const handleBannerPreview: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("No file selected.");

      return;
    }

    fileRef.current = file;

    setIsPreviewing(true);

    optimisticUpdate((old: any) => {
      bannerUrlRef.current = old?.bannerPicture || null;

      return { bannerPicture: URL.createObjectURL(file) };
    });
  };

  const handleUpdateBanner = async () => {
    updateBanner(fileRef.current, {
      onSuccess: () => {
        setIsPreviewing(false);
        fileRef.current = null;
      },
    });
  };

  return (
    <React.Fragment>
      {isPreviewing ? (
        <div className="flex items-center gap-2 absolute bottom-8 right-4 md:right-12 lg:right-20 xl:right-28 2xl:right-36">
          <Button
            className="bg-background-300 text-white"
            onClick={handleCancelPreview}
          >
            Cancel
          </Button>

          <Button
            isLoading={updateBannerLoading}
            className="text-white"
            primary
            LeftIcon={IoMdCheckmark}
            onClick={handleUpdateBanner}
          >
            Save changes
          </Button>
        </div>
      ) : (
        <label
          htmlFor="banner-upload"
          className="cursor-pointer bg-white text-base flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-opacity-80 font-semibold absolute bottom-8 right-4 md:right-12 lg:right-20 xl:right-28 2xl:right-36 text-black"
        >
          <AiFillCamera className="w-6 h-6" />

          <p>Edit banner</p>
        </label>
      )}

      <input
        accept="image/*"
        ref={fileInputRef}
        id="banner-upload"
        type="file"
        hidden
        onChange={handleBannerPreview}
      />
    </React.Fragment>
  );
};

export default UpdateBanner;
