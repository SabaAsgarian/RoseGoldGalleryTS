"use client";

import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const MediaBox: React.FC = () => {
  const [gifFailed, setGifFailed] = useState(false);

  const handleGifError = useCallback(() => {
    setGifFailed(true);
  }, []);

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <Link href="../pages/all" style={{ color: "black", textDecoration: "none" }}>
        <Box sx={{ width: "100%", position: "relative" }}>
          {!gifFailed ? (
            <Image
              src="/Vid/vid.gif"
              alt="GIF"
              fill
              priority
              sizes="100vw"
              onError={handleGifError}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <video
              src="/Vid/vidd.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          )}
        </Box>
      </Link>
    </Box>
  );
};

export default MediaBox;
