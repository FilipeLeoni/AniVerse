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

interface CommentState {
  defaultContent?: string;
}

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

  console.log(session);

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
    createComment({
      animeId,
      parentId,
      comment: content,
    });

    setCommentState({ defaultContent: null });

    editorRef.current?.commands?.clearContent();
    commentReply?.setReplyingTo(null);
  };

  return (
    <div>
      <div className="mb-10">
        {session?.user && (
          <Editor
            ref={editorRef}
            placeholder={"placeholder"}
            defaultContent={commentState.defaultContent}
            autofocus={!!commentReply?.replyingTo}
            onSubmit={handleEditorSubmit}
            isLoading={createCommentLoading}
          />
        )}
      </div>
      <div>
        {data &&
          data.map((comment: any) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
      </div>
    </div>
    // <div className="space-y-4 mb-4">
    //   {isLoading ? (
    //     <div className="relative w-full h-20">
    //       <Loading className="w-8 h-8" />
    //     </div>
    //   ) : (
    //     comments &&
    //     comments.map((comment: any) => (
    //       <CommentComponent key={comment.id} commentId={comment.id} />
    //     ))
    //   )}

    //   ) : (
    //     <p className="p-2 bg-background-800 text-gray-300">
    //       dwdwdw
    //       {/* <Trans i18nKey="comment:need_login_msg">
    //         Bạn phải{" "}
    //         <TransLink
    //           href={`/login?redirectedFrom=${asPath}`}
    //           className="text-primary-300 hover:underline"
    //         >
    //           đăng nhập
    //         </TransLink>{" "}
    //         dể bình luận.
    //       </Trans> */}
    //     </p>
    //   )}
    // </div>
  );
};

export default Comments;
