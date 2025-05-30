import React, { useState } from 'react';
import NextImage from 'next/image';

// Usage: <ImageWithFallback src="..." ... />
// If you want to force native <img>, pass nextImage={false}
// Otherwise, defaults to Next.js Image

export default function ImageWithFallback({ src, alt, nextImage = true, width, height, fill, style, className, ...props }) {
  const [error, setError] = useState(false);

  // Compose style for fallback div
  const fallbackStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffd6db', // light pastel red
    color: '#a01d46', // deep red for text
    fontWeight: 500,
    fontSize: '1rem',
    borderRadius: 8,
    width: fill ? '100%' : (width || 100),
    height: fill ? '100%' : (height || 100),
    position: fill ? 'absolute' : undefined,
    top: fill ? 0 : undefined,
    left: fill ? 0 : undefined,
    ...style,
  };

  if (error) {
    return (
      <div
        className={className}
        style={fallbackStyle}
        role="img"
        aria-label={alt || 'Image not found'}
      >
        {alt || 'Image not found'}
      </div>
    );
  }

  const handleError = () => setError(true);

  if (nextImage) {
    const imageProps = {
      ...props,
      src,
      alt,
      onError: handleError,
      className,
      style,
    };
    if (fill) {
      imageProps.fill = true;
    } else {
      imageProps.width = width;
      imageProps.height = height;
    }
    return <NextImage {...imageProps} />;
  }
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      className={className}
      style={style}
    />
  );
} 