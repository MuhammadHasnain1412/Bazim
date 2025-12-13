"use client";

import { useState } from "react";
import { Button, Group, Text, Image, Stack, Progress } from "@mantine/core";
import { IconUpload, IconX } from "@tabler/icons-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ value, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedIds: string[] = [];

      for (let i = 0; i < Math.min(files.length, maxImages - value.length); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        uploadedIds.push(result.imageId || result.url);

        // Update progress (simple percentage)
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      onChange([...value, ...uploadedIds]);
    } catch (err) {
      console.error("Error uploading images:", err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    // Optional: DELETE from server
  };

  return (
    <Stack gap="md">
      <Group>
        <Button
          component="label"
          leftSection={<IconUpload size={16} />}
          disabled={uploading || value.length >= maxImages}
        >
          {uploading ? "Uploading..." : "Upload Images"}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </Button>
        <Text size="sm" c="dimmed">
          {value.length}/{maxImages} images
        </Text>
      </Group>

      {uploading && <Progress value={uploadProgress} color="blue" size="sm" />}

      {value.length > 0 && (
        <Group gap="sm">
          {value.map((imageId, index) => (
            <div key={imageId} style={{ position: "relative" }}>
              <Image
                src={`/api/upload?id=${imageId}`}
                alt={`Product image ${index + 1}`}
                width={100}
                height={100}
                fit="cover"
                radius="md"
              />
              <Button
                size="xs"
                color="red"
                variant="filled"
                style={{ position: "absolute", top: 5, right: 5 }}
                onClick={() => removeImage(index)}
              >
                <IconX size={12} />
              </Button>
            </div>
          ))}
        </Group>
      )}
    </Stack>
  );
}
