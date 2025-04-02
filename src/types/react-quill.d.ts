declare module "react-quill" {
    import { ComponentType } from "react";
    interface ReactQuillProps {
      theme?: string;
      value?: string;
      onChange?: (content: string, delta: any, source: any, editor: any) => void;
      [key: string]: any;
    }
    const ReactQuill: ComponentType<ReactQuillProps>;
    export default ReactQuill;
  }