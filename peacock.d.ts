import * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wc-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          color?: "primary" | "secondary" | "danger" | "success" | "warning";
          variant?: "outlined" | "flat" | "text" | "filled";
          disabled?: boolean;
          href?: string;
        },
        HTMLElement
      >;
      "wc-link": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          color?: "primary" | "secondary" | "danger" | "success" | "warning";
          href?: string;
          target?: string;
        },
        HTMLElement
      >;
      "wc-card": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          outlined?: boolean;
        },
        HTMLElement
      >;
      "wc-accordion": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          single?: boolean;
        },
        HTMLElement
      >;
      "wc-accordion-item": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          header: string;
          open?: boolean;
        },
        HTMLElement
      >;
      "wc-avatar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          icon?: string;
          label?: string;
          src?: string;
          size?: "small" | "medium" | "large";
        },
        HTMLElement
      >;
      "wc-badge": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          count?: string | number;
          color?: "primary" | "secondary" | "danger" | "success" | "warning";
        },
        HTMLElement
      >;
      "wc-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name: string;
          size?: string;
        },
        HTMLElement
      >;
      "wc-tooltip": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          content: string;
          position?: "top" | "bottom" | "left" | "right";
        },
        HTMLElement
      >;
    }
  }
}
