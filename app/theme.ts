"use client";

import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "bazim-navy",
  colors: {
    "bazim-navy": [
      "#ecf2f8",
      "#dce4ed",
      "#b8c9db",
      "#94adc9",
      "#7091b7",
      "#4c75a5",
      "#132d46", // Base color at index 6
      "#10263b",
      "#0d1f30",
      "#0a1825",
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
