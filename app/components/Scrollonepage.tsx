"use client";

import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

/**
 * MediaBox
 * - self-contained: no props required
 * - tries to play video from /Vid/vidd.mp4 (public folder)
 * - falls back to GIF /Vid/vid.gif on video error
 */

const MediaBox: React.FC = () => {
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [gifErrored, setGifErrored] = useState<boolean>(false);

  const handleVideoError = useCallback(() => {
    // If video fails, show the gif instead
    setShowVideo(false);
  }, []);

  const handleGifError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // GIF failed to load — mark as errored so you could show a placeholder if needed
      setGifErrored(true);
      // optional: fallback to a static placeholder or keep showVideo false
      console.warn("GIF failed to load", e);
    },
    []
  );

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <Link href="../pages/all" style={{ color: "black", textDecoration: "none" }}>
        <Box
          sx={{
            width: "100%",
          
            // use aspectRatio to keep consistent height (1:1 or 16:9 - adjust as needed)
           
          
           
          }}
        >
          {showVideo && !gifErrored ? (
            <video
              src="/Vid/vidd.mp4" // served from public/Vid/vidd.mp4
              autoPlay
              loop
              muted
              playsInline
              onError={handleVideoError}
              style={{
                width: "100%",
                height: "auto",
                
               
              }}
              preload="auto"
            />
          ) : (
            // Next/Image using public path
            <Box sx={{  width: "100%", height: "auto" }}>
              <Image
                src="/Vid/vid.gif"
                alt="GIF"
                fill
                
                onError={handleGifError}
                priority
                sizes="100vw"
              />
            </Box>
          )}
        </Box>
      </Link>
    </Box>
  );
};

export default MediaBox;
