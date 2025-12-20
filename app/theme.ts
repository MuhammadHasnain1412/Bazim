"use client";

import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "dark",
  colors: {
    // We can define a custom 'dark' or 'neutral' scale if needed,
    // but standard grays often work well for minimal designs.
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
