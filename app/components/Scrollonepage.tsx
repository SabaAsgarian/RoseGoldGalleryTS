"use client";

import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const MediaBox: React.FC = () => {
  const [gifErrored, setGifErrored] = useState<boolean>(false);

  const handleGifError = useCallback(() => {
    setGifErrored(true);
  }, []);

  const handleVideoError = useCallback(() => {
    console.warn("Video failed");
  }, []);

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <Link
        href="../pages/all"
        style={{ color: "black", textDecoration: "none" }}
      >
        <Box sx={{ width: "100%", height: "auto" }}>
          {!gifErrored ? (
            <Image
              src="/Vid/vid.gif"
              alt="GIF"
              width={1920}
              height={1080}
              priority
              onError={handleGifError}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <video
              src="/Vid/vidd.mp4"
              autoPlay
              loop
              muted
              playsInline
              onError={handleVideoError}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              preload="auto"
            />
          )}
        </Box>
      </Link>
    </Box>
  );
};

export default MediaBox;
