import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { colors } from '../theme'
import EventImage from './EventImage'

// A decisive ease-out that settles rather than bounces.
const EASE = [0.22, 1, 0.36, 1]
const DURATION = 0.45

export default function EventCarousel({ images = [], alt = '' }) {
  const [index, setIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const [canDrag, setCanDrag] = useState(false)
  const viewportRef = useRef(null)
  const reduced = useReducedMotion()

  const count = images.length

  // Track the viewport width so the slide offset and drag both work in pixels.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [count])

  // Drag-to-swipe is for touch input only.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const sync = () => setCanDrag(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (count === 0) return null

  // A single image needs no controls, dots, or track.
  if (count === 1) {
    return <EventImage src={images[0]} alt={alt} alwaysFrame={false} />
  }

  const go = (next) => setIndex(((next % count) + count) % count)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    }
  }

  // Release lands on the nearest slide, not the next one along.
  const onDragEnd = (_, info) => {
    if (!width) return
    const slidesMoved = -info.offset.x / width
    const nearest = Math.round(index + slidesMoved)
    setIndex(Math.min(count - 1, Math.max(0, nearest)))
  }

  const slideTransition = reduced ? { duration: 0 } : { duration: DURATION, ease: EASE }

  const arrowBase =
    'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center ' +
    'rounded-full border-none opacity-0 transition-all duration-200 ' +
    'group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer'

  return (
    <div
      className="group relative"
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt ? `${alt} — image gallery` : 'Image gallery'}
    >
      <div ref={viewportRef} className="relative overflow-hidden" style={{ background: colors.card }}>
        <motion.div
          className="flex"
          style={{ touchAction: 'pan-y' }}
          animate={{ x: -index * width }}
          transition={slideTransition}
          drag={canDrag ? 'x' : false}
          dragMomentum={false}
          dragElastic={0.15}
          dragConstraints={{ left: -(count - 1) * width, right: 0 }}
          onDragEnd={onDragEnd}
        >
          {images.map((src, i) => {
            const isActive = i === index
            return (
              <motion.div
                key={src}
                className="w-full shrink-0"
                aria-hidden={!isActive}
                // Incoming settles from 1.02; outgoing dims and eases back to 0.97.
                animate={
                  reduced
                    ? { scale: 1, opacity: 1 }
                    : { scale: isActive ? [1.02, 1] : 0.97, opacity: isActive ? 1 : 0.8 }
                }
                transition={slideTransition}
              >
                <EventImage
                  src={src}
                  alt={alt}
                  alwaysFrame={false}
                  draggable={false}
                  className="pointer-events-none select-none"
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Hairline progress along the bottom edge of the image.
            scaleX rather than width: motion applies transforms reliably,
            where a percentage width never commits on mount. */}
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: colors.line }}>
          <motion.div
            className="h-full w-full"
            style={{ background: colors.ink, transformOrigin: 'left' }}
            initial={{ scaleX: (index + 1) / count }}
            animate={{ scaleX: (index + 1) / count }}
            transition={slideTransition}
          />
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous image"
          className={`${arrowBase} left-3 hover:-translate-x-[2px]`}
          style={{ background: colors.cream, color: colors.ink, boxShadow: `0 1px 6px ${colors.line}` }}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next image"
          className={`${arrowBase} right-3 hover:translate-x-[2px]`}
          style={{ background: colors.cream, color: colors.ink, boxShadow: `0 1px 6px ${colors.line}` }}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Dots — the active one widens from a circle into a short bar */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {images.map((src, i) => {
          const isActive = i === index
          return (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to image ${i + 1} of ${count}`}
              aria-current={isActive ? 'true' : undefined}
              className="h-1.5 cursor-pointer rounded-full border-none p-0 transition-all duration-300"
              style={{
                width: isActive ? '18px' : '6px',
                background: isActive ? colors.ink : colors.line,
                transitionDuration: reduced ? '0ms' : '300ms',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
