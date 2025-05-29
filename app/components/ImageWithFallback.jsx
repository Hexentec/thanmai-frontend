import React, { useState } from 'react';
import NextImage from 'next/image';

// Usage: <ImageWithFallback src="..." ... />
// If you want to force native <img>, pass nextImage={false}
// Otherwise, defaults to Next.js Image

const PLACEHOLDER = '/assets/placeholder.png';

export default function ImageWithFallback({ src, alt, nextImage = true, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const handleError = () => {
    if (imgSrc !== PLACEHOLDER) setImgSrc(PLACEHOLDER);
  };

  if (nextImage) {
    // For Next.js Image, use onError and key to force reload
    return (
      <NextImage
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        key={imgSrc} // force re-render on src change
      />
    );
  }
  // For native <img>
  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
} 