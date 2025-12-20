import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Providers } from "./provider";
import { Inter } from "next/font/google";
import { theme } from "./theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Bazim Clothing",
  description: "Premium Shalwar Kameez Collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-right" />
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
