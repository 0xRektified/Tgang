// src/treemaker.d.ts

declare module "@roumi/treemaker" {
  interface TreeParams {
    [key: string]: {
      trad?: string;
      styles?: Record<string, string>;
    };
  }

  interface TreeMakerOptions {
    id: string;
    card_click?: (element: HTMLElement) => void;
    treeParams: TreeParams;
    link_width?: string;
    link_color?: string;
  }

  const treeMaker: (
    tree: Record<string, any>,
    options: TreeMakerOptions
  ) => void;

  export default treeMaker;
}
