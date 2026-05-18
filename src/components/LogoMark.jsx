import React, { useEffect, useState } from 'react'

/**
 * Renders an OEM corporate logo from /public/<path>.
 *
 * Behaviour:
 *  - Starts on the text fallback (no broken-image flash on first paint).
 *  - Pre-loads the asset asynchronously. On successful decode, swaps to the
 *    <img>; on 404 / decode error, stays on the text fallback.
 *  - No external hot-linking: only loads from this app's /public/ folder.
 *  - Container size is fixed by the parent (.logo-mark-header) so the
 *    layout never shifts whether the image is present or not.
 *
 * Sourcing: the upstream press-kit URL is recorded in tvs.json -> logo.*
 * but never fetched from JS. The PNG must be committed to public/ manually.
 */
export default function LogoMark({ src, fallbackText, fallbackColor, alt }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    if (!src) { setErrored(true); return }
    let cancelled = false
    const img = new window.Image()
    img.onload  = () => { if (!cancelled) setLoaded(true) }
    img.onerror = () => { if (!cancelled) setErrored(true) }
    img.src = src
    return () => { cancelled = true }
  }, [src])

  if (src && loaded && !errored) {
    return (
      <img
        src={src}
        alt={alt || fallbackText}
        className="max-w-full max-h-full object-contain"
        draggable={false}
      />
    )
  }

  return (
    <span
      className="logo-text-full"
      style={{ color: fallbackColor || '#4C1D95' }}
    >
      {fallbackText}
    </span>
  )
}
