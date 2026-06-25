// Desktop mockup that surfaces the three built websites as buttons on its screen —
// styled like the Zeitpyramide video-switch pills.
const PC_LINKS = [
  { href: 'https://atcweiden.de/',                                                          label: 'ATC Weiden' },
  { href: 'https://sortierzentrum.com/',                                                    label: 'Sortierzentrum' },
  { href: 'https://www.schankfass.de/',                                                     label: 'Schankfass' },
  { href: 'https://wissen.schloesserland-sachsen.de/geschichten-ausstellungen/adventskalender-2024/', label: 'Schlösserland Sachsen' },
]

// Sizing is in container-query units (cqw = 1% of the mockup's own width) so the
// buttons scale with the screen at every render size — fixed px buttons overflowed
// the screen glass and sat on the bezel once the mockup shrank (mobile/popup ~360px).
const BTN =
  'inline-flex w-[78%] items-center justify-center gap-[0.9cqw] rounded-full px-[2.6cqw] py-[1cqw] font-sans text-[2.2cqw] font-bold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_-4px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 hover:shadow-[0_6px_18px_-4px_rgba(93,70,132,0.9)] active:scale-[0.97]'
const BTN_BG = { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' }

/**
 * pc-mockup.png is a 2048² canvas with wide transparent bands top & bottom. The
 * outer box is cropped to the visible monitor + keyboard (via aspect-ratio +
 * translate) so it reads as a landscape media block like the videos. The buttons
 * sit on the screen, vertically centred.
 */
export default function PcWebsites({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden [container-type:inline-size] ${className}`} style={{ aspectRatio: '2048 / 1140' }}>
      <img
        src="/assets/pc-mockup.webp"
        alt="Computer-Mockup mit Website-Links"
        draggable={false}
        className="absolute left-0 top-0 w-full select-none"
        style={{ transform: 'translateY(-24.4%)' }}
      />
      {/* Screen — the link buttons live here, centred on the display */}
      <div
        className="absolute flex flex-col items-center justify-center gap-[1.3cqw]"
        style={{ left: '20.5%', right: '20.5%', top: '4%', bottom: '37%' }}
      >
        {PC_LINKS.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener" className={BTN} style={BTN_BG}>
            {l.label}
            <span aria-hidden className="text-[1.6cqw] opacity-70">↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}
