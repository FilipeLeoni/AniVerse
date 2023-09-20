import React from "react";
import Editor, { EditorProps } from "../features/comment/Editor";
import { Editor as EditorType } from "@tiptap/react";
import classNames from "classnames";

export interface DescriptionProps extends EditorProps {
  description: string;
  editorClassname?: string;
}

const Description = React.forwardRef<EditorType, DescriptionProps>(
  ({ description, editorClassname, ...props }, ref) => {
    return (
      <Editor
        ref={ref}
        readOnly
        defaultContent={description}
        editorClassName={classNames(
          "text-base text-gray-300 hover:text-gray-100",
          editorClassname
        )}
        {...props}
      />
    );
  }
);

Description.displayName = "Description";

export default Description;
