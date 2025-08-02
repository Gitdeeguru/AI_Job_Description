'use client';
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface RichTextEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
}

export function RichTextEditor({
  placeholder,
  value,
  onChange,
}: RichTextEditorProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="bg-background">
      <ReactQuill
        theme="snow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        forwardedRef={null}
      />
    </div>
  );
}
