import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import DotList from "@/components/shared/DotList";
import Loading from "@/components/shared/Loading";
import TextIcon from "@/components/shared/TextIcon";
import CommentReplyContextProvider, {
  useCommentReply,
} from "@/contexts/CommentReplyContext";

import { Comment } from "@/@types";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { useState } from "react";
import { AiFillDelete, AiFillEdit, AiOutlineClose } from "react-icons/ai";
import { BsArrowReturnRight, BsReplyFill } from "react-icons/bs";
import Editor from "./Editor";

import useDeleteComment from "@/hooks/useDeleteComment";
import useUpdateComment from "@/hooks/useUpdateComment";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import Replies from "./Replies";
import { Comments } from "@/@types/Comment";

interface CommentProps {
  comment: Comments;
}

const CommentContainer: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="relative">
      <CommentReplyContextProvider>
        {!comment.parentId && (
          <div>
            <CommentComponent comment={comment} />
          </div>
        )}
        {comment?.replies?.map((comment: any) => (
          <div className="ml-8" key={comment.id}>
            <CommentComponent comment={comment} />
          </div>
        ))}
      </CommentReplyContextProvider>
    </div>
  );
};

const CommentComponent: React.FC<CommentProps> = ({ comment }: any) => {
  const locale = useLocale();
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const commentReply = useCommentReply();
  const { data: session } = useSession();

  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment({
    animeId: comment.animeId,
    parentId: comment.parentId,
  });

  const handleUpdate = (content: string) => {
    updateComment({
      text: content,
      id: comment.id,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteComment(comment.id);
  };

  const handleToggleActionMenu: (
    isShow: boolean
  ) => React.MouseEventHandler<HTMLDivElement> = (isShow) => () => {
    if (session) {
      setShowActionMenu(isShow);
    }
  };

  const handleReply = () => {
    commentReply?.setReplyingTo(comment);

    setShowReplies(!showReplies);
  };

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const parentId = comment.parentId ? comment.parentId : comment.id;

  return (
    <div
      className="relative flex gap-2 md:gap-4 hover:bg-neutral-950 p-4"
      onMouseEnter={handleToggleActionMenu(true)}
      onMouseLeave={handleToggleActionMenu(false)}
    >
      <Avatar src={comment?.user?.profilePicture as string} />

      <div className="grow">
        <DotList className="mb-1">
          <span className="font-semibold">{comment?.user?.name}</span>

          <span
            className={classNames(
              "capitalize font-medium text-sm",
              comment?.user?.role === "Admin"
                ? "text-red-400"
                : comment?.user?.role === "Moderator"
                ? "text-yellow-400"
                : "text-gray-200"
            )}
          >
            {comment?.user?.role}
          </span>

          <span className="text-gray-400 text-sm">
            {dayjs(comment.createdAt, { locale }).fromNow()}
          </span>
        </DotList>

        <div className="mb-4">
          <Editor
            readOnly={!isEditing}
            defaultContent={comment.text}
            onSubmit={handleUpdate}
            className="max-w-[30rem]"
          />
        </div>

        {!showReplies && !comment?.parentId && comment.replies > 0 && (
          <TextIcon
            className="mt-4 hover:underline cursor-pointer"
            onClick={handleShowReplies}
            LeftIcon={BsArrowReturnRight}
          >
            {comment.replies.length} replies
          </TextIcon>
        )}

        {showReplies && (
          <div className="mt-6">
            <Replies
              animeId={comment.animeId}
              parentId={parentId}
              handleShowReplies={handleShowReplies}
            />
          </div>
        )}
      </div>

      <div
        className={classNames(
          "bg-background-800 items-center gap absolute -top-2 right-0",
          showActionMenu ? "flex" : "hidden"
        )}
      >
        {comment.user.id === session?.user?.id && (
          <Button
            iconClassName="w-5 h-5"
            secondary
            LeftIcon={!isEditing ? AiFillEdit : AiOutlineClose}
            onClick={handleEdit}
          />
        )}

        <Button
          iconClassName="w-5 h-5"
          secondary
          LeftIcon={!showReplies ? BsReplyFill : AiOutlineClose}
          onClick={handleReply}
        />

        {comment.user.id === session?.user?.id && (
          <DeleteConfirmation
            reference={
              <Button
                iconClassName="w-5 h-5"
                className="hover:bg-red-500"
                secondary
                LeftIcon={AiFillDelete}
              />
            }
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CommentContainer;
