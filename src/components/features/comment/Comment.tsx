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
import { getMentionedUserIds } from "@/utils/editor";
import { useUser } from "@/contexts/AuthContext";
import classNames from "classnames";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsArrowReturnRight, BsReplyFill } from "react-icons/bs";
import Comments from "./Comments";
import Editor from "./Editor";
import ReactionSelector from "./ReactionSelector";
import Link from "next/link";
import useComment from "@/hooks/useComment";
import useCreateReaction from "@/hooks/useCreateReaction";
import useDeleteComment from "@/hooks/useDeleteComment";
import useRemoveReaction from "@/hooks/useRemoveReaction";
import useUpdateComment from "@/hooks/useUpdateComment";
import CommentReactions from "./CommentReactions";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import Replies from "./Replies";

interface CommentContainerProps {
  commentId: string;
}

interface CommentProps {
  comment: Comment;
}

const CommentContainer: React.FC<any> = ({ comment }) => {
  // const { data: comment, isLoading } = useComment(commentId);
  console.log(comment);

  const isLoading = false;
  return (
    <div className="relative">
      {!comment.parentId && (
        <CommentReplyContextProvider>
          <CommentComponent comment={comment} />
        </CommentReplyContextProvider>
      )}
      {comment.replies.map((comment: any) => (
        <div className="ml-8" key={comment.id}>
          <CommentComponent comment={comment} />
        </div>
      ))}
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
  console.log(session);
  // const { mutate: createReaction } = useCreateReaction();
  // const { mutate: removeReaction } = useRemoveReaction();
  const { mutate: updateComment } = useUpdateComment();
  // const { mutate: deleteComment } = useDeleteComment({
  //   topic: comment.topic,
  //   parentId: comment.parent_id,
  // });

  // const activeReactions = comment.reactions_metadata.reduce(
  //   (set: any, reactionMetadata: any) => {
  //     if (reactionMetadata.active_for_user) {
  //       set.add(reactionMetadata.reaction_type);
  //     }
  //     return set;
  //   },
  //   new Set<string>()
  // );

  const handleUpdate = (content: string) => {
    updateComment({
      text: content,
      id: comment.id,
    });

    setIsEditing(false);
  };

  // const handleDelete = () => {
  //   deleteComment(comment.id);
  // };

  const handleToggleActionMenu: (
    isShow: boolean
  ) => React.MouseEventHandler<HTMLDivElement> = (isShow) => () => {
    setShowActionMenu(isShow);
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

  // const toggleReaction = (reactionType: string) => {
  //   if (!activeReactions.has(reactionType)) {
  //     createReaction({
  //       commentId: comment.id,
  //       reactionType,
  //     });
  //   } else {
  //     removeReaction({
  //       commentId: comment.id,
  //       reactionType,
  //     });
  //   }
  // };

  console.log(comment);

  return (
    <div
      className="relative flex gap-2 md:gap-4 mt-2"
      onMouseEnter={handleToggleActionMenu(true)}
      onMouseLeave={handleToggleActionMenu(false)}
    >
      <Avatar src={comment?.user?.profilePicture as string} />

      <div className="grow">
        <DotList className="mb-1">
          <span className="font-semibold">{comment?.user?.name}</span>

          <span className="capitalize font-medium text-gray-200 text-sm">
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

        {showReplies && !comment?.parentId && (
          <div className="mt-6">
            <Replies animeId={comment.animeId} parentId={comment.id} />
          </div>
        )}
      </div>

      <div
        className={classNames(
          "bg-background-800 items-center gap absolute -top-2 right-0",
          showActionMenu ? "flex" : "hidden"
        )}
      >
        {/* <ReactionSelector toggleReaction={toggleReaction} /> */}

        {comment.userId === session?.user?.id && (
          <Button
            iconClassName="w-5 h-5"
            secondary
            LeftIcon={AiFillEdit}
            onClick={handleEdit}
          />
        )}

        <Button
          iconClassName="w-5 h-5"
          secondary
          LeftIcon={BsReplyFill}
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
            // onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CommentContainer;
