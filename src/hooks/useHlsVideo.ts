import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Attach an adaptive HLS (`master.m3u8`) source to a <video> element.
 *
 * Loading strategy — tuned for "effective video loading":
 *  - Prefer hls.js (MSE) wherever it runs — Chrome, Firefox, Edge, modern Safari.
 *    hls.js is dynamic-imported so it stays out of the main bundle, and unplayable
 *    codec variants (HEVC on Chrome, …) are dropped automatically while AVC stays
 *    as the universal fallback.
 *  - Only browsers without MSE (legacy iOS Safari) fall back to the element's
 *    native HLS support. We do NOT branch on `canPlayType('…mpegurl')` first
 *    because some Chromium builds report a misleading "maybe" there yet cannot
 *    actually play HLS natively.
 *  - `capLevelToPlayerSize` means a 230px phone-mock never fetches the 1080p rung.
 *  - `preload: false` (default) downloads *nothing* until the first `play()` — the
 *    right behaviour for the 45-min click-to-play films. Autoplay loops pass
 *    `preload: true` so the first frames are ready immediately.
 *
 * If neither hls.js nor native HLS is available the hook leaves the element alone,
 * so any <source> children (e.g. an .mp4) still act as the ultimate fallback.
 */

type Options = {
  /** Start buffering immediately instead of waiting for the first play. */
  preload?: boolean
  /** Max forward buffer in seconds — keeps long VODs from pre-loading far ahead. */
  maxBufferLength?: number
}

const NATIVE_HLS = 'application/vnd.apple.mpegurl'

export function useHlsVideo(
  ref: RefObject<HTMLVideoElement | null>,
  src: string | null,
  opts: Options = {},
) {
  const { preload = false, maxBufferLength = 30 } = opts

  useEffect(() => {
    const video = ref.current
    if (!video || !src) return

    let destroyed = false
    let hls: import('hls.js').default | null = null
    let onPlay: (() => void) | null = null
    let usedNative = false

    // Tear down hls.js and let the <video>'s <source> children (mp4) take over.
    const fallbackToMp4 = () => {
      if (hls) {
        hls.destroy()
        hls = null
      }
      video.removeAttribute('src')
      video.load()
    }

    import('hls.js').then(({ default: Hls }) => {
      if (destroyed) return

      // 1) MSE path (preferred everywhere it works).
      if (Hls.isSupported()) {
        hls = new Hls({
          capLevelToPlayerSize: true,
          startLevel: -1,
          maxBufferLength,
          maxMaxBufferLength: Math.max(maxBufferLength, 60),
          // Don't touch the network until we actually want to play.
          autoStartLoad: preload,
        })

        hls.loadSource(src)
        hls.attachMedia(video)

        if (!preload) {
          // Begin fetching segments on the first play intent, then detach.
          onPlay = () => {
            hls?.startLoad()
            if (onPlay) video.removeEventListener('play', onPlay)
            onPlay = null
          }
          video.addEventListener('play', onPlay)
        }

        let netRetries = 0
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal || !hls) return
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // A couple of reconnect attempts, then give up to the mp4 fallback.
              if (netRetries++ < 2) hls.startLoad()
              else fallbackToMp4()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              // Unrecoverable (e.g. a corrupt/missing manifest) → use <source> mp4.
              fallbackToMp4()
          }
        })
        return
      }

      // 2) Native HLS (legacy iOS Safari without MSE).
      if (video.canPlayType(NATIVE_HLS)) {
        usedNative = true
        video.src = src
        if (!preload) video.preload = 'none'
      }
      // 3) else: leave <source> mp4 fallback intact.
    })

    return () => {
      destroyed = true
      if (onPlay) video.removeEventListener('play', onPlay)
      if (hls) {
        hls.destroy()
        hls = null
      }
      if (usedNative) {
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [ref, src, preload, maxBufferLength])
}
