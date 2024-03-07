"use client";

import Loading from "@/components/shared/Loading";
// import TransLink from "@/components/shared/TransLink";
import CommentReplyContextProvider, {
  useCommentReply,
} from "@/contexts/CommentReplyContext";
import { getMentionedUserIds } from "@/utils/editor";
import { useUser } from "@/contexts/AuthContext";
import { Editor as EditorType } from "@tiptap/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CommentComponent from "./Comment";
import Editor from "./Editor";
import useComments from "@/hooks/useComments";
import useCreateComment from "@/hooks/useCreateComment";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CommentsProps {
  parentId?: string;
  animeId: string;
}

const Comments: React.FC<CommentsProps> = ({ parentId = null, animeId }) => {
  const { data, isLoading } = useComments({ parentId, animeId });
  const [commentState, setCommentState] = useState<any>({});
  const commentReply = useCommentReply();
  const { data: session } = useSession();
  const user = useUser();
  const editorRef = useRef<EditorType>(null);

  const { mutate: createComment, isLoading: createCommentLoading } =
    useCreateComment();

  useEffect(() => {
    if (!commentReply?.replyingTo) {
      setCommentState({ defaultContent: null });
    } else {
      setCommentState({
        defaultContent: `<span data-type="mention" data-id="${commentReply.replyingTo.user.id}" data-label="${commentReply.replyingTo.user.name}" contenteditable="false"></span><span>&nbsp</span>`,
      });
    }
  }, [commentReply?.replyingTo]);

  const handleEditorSubmit: any = (content: string) => {
    console.log(content);
    createComment({
      animeId,
      parentId,
      text: content,
    });

    setCommentState({ defaultContent: null });

    editorRef.current?.commands?.clearContent();
    commentReply?.setReplyingTo(null);
  };

  return (
    <div>
      <h1 className="font-semibold text-3xl mb-8">Comments</h1>
      <div>
        {session?.user ? (
          <Editor
            ref={editorRef}
            placeholder={"Add a comment"}
            defaultContent={commentState.defaultContent}
            autofocus={!!commentReply?.replyingTo}
            onSubmit={handleEditorSubmit}
            isLoading={createCommentLoading}
          />
        ) : (
          <div className="bg-neutral-900 p-3 text-neutral-300">
            You need to
            <Link href={"/login"}>
              <span className="text-primary-300 mx-1 hover:text-primary-500">
                login
              </span>
            </Link>
            to comment
          </div>
        )}
      </div>
      <div className="flex w-full gap-3 justify-end mt-4 mb-6">
        <p className="hover:text-primary-400 cursor-pointer">Most recent</p>
        <p className="hover:text-primary-400 cursor-pointer">Oldest</p>
      </div>
      <div>
        {data &&
          data.map((comment: any) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
      </div>
    </div>
  );
};

export default Comments;
