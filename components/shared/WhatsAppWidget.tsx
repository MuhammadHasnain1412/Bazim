"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { COMPANY_CONTACT } from "@/lib/constants";

export function WhatsAppWidget() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 1000,
      }}
    >
      <Tooltip label="Chat with us" position="left" withArrow>
        <ActionIcon
          component="a"
          href={`https://wa.me/${COMPANY_CONTACT.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          size={60}
          radius="xl"
          color="green"
          variant="filled"
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <IconBrandWhatsapp size={32} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
