import { useState } from 'react'
import { colors } from '../theme'

/**
 * Event artwork that crops photos but never crops posters.
 *
 * Portrait images — posters, mostly — lose their text to object-cover in a
 * landscape frame, so anything taller than it is wide is letterboxed against the
 * card colour instead. Landscape photos keep the existing crop untouched, which
 * is why the test is orientation rather than "narrower than 16:9": the latter
 * would also catch 4:3 photos that are fine cropped.
 *
 * `alwaysFrame` is how cards and the carousel differ. Cards reserve their aspect
 * box for every image so the grid stays even. The carousel only imposes a frame
 * on portrait slides, leaving landscape ones at their natural height as before.
 */
export default function EventImage({
  src,
  alt,
  alwaysFrame = true,
  frameClass = 'aspect-video',
  className = '',
  style,
  ...rest
}) {
  const [portrait, setPortrait] = useState(false)

  const measure = (img) => {
    if (!img || !img.naturalWidth) return
    setPortrait(img.naturalHeight > img.naturalWidth)
  }

  // React can miss onLoad for images already in cache when the handler attaches,
  // so re-check on mount. Setting the same value bails out of the re-render.
  const captureRef = (img) => {
    if (img && img.complete) measure(img)
  }

  const framed = alwaysFrame || portrait

  return (
    <img
      src={src}
      alt={alt}
      ref={captureRef}
      onLoad={(e) => measure(e.currentTarget)}
      className={[
        'block w-full',
        framed ? frameClass : '',
        framed ? (portrait ? 'object-contain' : 'object-cover') : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: colors.card, ...style }}
      {...rest}
    />
  )
}
