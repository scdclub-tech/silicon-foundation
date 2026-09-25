// src/components/story/motionStyles.js
//
// The fin-line background and the floating photo, shared by the story hero and
// the homepage "SCD's First Triumph" panel. Keyframes and media queries cannot
// be written inline, and both surfaces need the identical motion, so the rules
// live here once and each surface renders them in its own <style> tag. The two
// never mount together, so there is only ever one copy in the document.

import { colors, withAlpha } from '../../theme'

export const STORY_MOTION_CSS = `
.story-fins {
  background-image: linear-gradient(90deg, ${withAlpha(colors.cream, 0.07)} 0 1px, transparent 1px);
  background-size: 108px 100%;
  animation: story-squeeze 9s ease-in-out infinite alternate;
}
@keyframes story-squeeze {
  from { background-size: 108px 100%; }
  to   { background-size: 72px 100%; }
}

/* the story hero photo: a straight rise and fall */
.story-float { animation: story-float 8s ease-in-out infinite; }
@keyframes story-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}

/* the homepage panel photo: the same drift, held at a slight tilt */
.story-float-tilt { animation: story-float-tilt 7s ease-in-out infinite; }
@keyframes story-float-tilt {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-16px) rotate(-1deg); }
}

@media (max-width: 767px) {
  .story-fins { background-size: 54px 100%; }
  @keyframes story-squeeze {
    from { background-size: 54px 100%; }
    to   { background-size: 36px 100%; }
  }
  @keyframes story-float-tilt {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50%      { transform: translateY(-10px) rotate(-1deg); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .story-fins, .story-float, .story-float-tilt { animation: none; }
}
`
