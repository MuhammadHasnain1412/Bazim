"use client";

import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "bazim-navy",
  colors: {
    "bazim-navy": [
      "#eef1f6",
      "#d8e0ea",
      "#afbfd2",
      "#829db9",
      "#5d80a3",
      "#466a91",
      "#395f89",
      "#2c5078",
      "#24476c",
      "#0d2137", // Base navy from logo at index 9
    ],
  },

  fontFamily: "var(--font-inter)",
  headings: {
    fontFamily: "var(--font-inter)",
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },

  components: {
    Button: {
      defaultProps: {
        size: "md",
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },
    Input: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme: any) => ({
        input: {
          backgroundColor: "transparent",
          borderColor: theme.colors.gray[3],
          "&:focus": {
            borderColor: theme.colors.dark[9],
          },
        },
      }),
    },
    Container: {
      defaultProps: {
        size: "xl",
      },
    },
  },
});
