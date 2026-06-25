// Desktop mockup that surfaces the three built websites as buttons on its screen —
// styled like the Zeitpyramide video-switch pills.
const PC_LINKS = [
  { href: 'https://atcweiden.de/',       label: 'ATC Weiden' },
  { href: 'https://sortierzentrum.com/', label: 'Sortierzentrum' },
  { href: 'https://www.schankfass.de/',  label: 'Schankfass' },
]

const BTN =
  'inline-flex w-[78%] items-center justify-center gap-1.5 rounded-full px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_-4px_rgba(93,70,132,0.7)] transition-all hover:brightness-110 hover:shadow-[0_6px_18px_-4px_rgba(93,70,132,0.9)] active:scale-[0.97]'
const BTN_BG = { background: 'linear-gradient(135deg, #b29bd0 0%, #5d4684 100%)' }

/**
 * pc-mockup.png is a 2048² canvas with wide transparent bands top & bottom. The
 * outer box is cropped to the visible monitor + keyboard (via aspect-ratio +
 * translate) so it reads as a landscape media block like the videos. The buttons
 * sit on the screen, vertically centred.
 */
export default function PcWebsites({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: '2048 / 1140' }}>
      <img
        src="/assets/pc-mockup.png"
        alt="Computer-Mockup mit Website-Links"
        draggable={false}
        className="absolute left-0 top-0 w-full select-none"
        style={{ transform: 'translateY(-24.4%)' }}
      />
      {/* Screen — the link buttons live here, centred on the display */}
      <div
        className="absolute flex flex-col items-center justify-center gap-2"
        style={{ left: '20.5%', right: '20.5%', top: '4%', bottom: '37%' }}
      >
        {PC_LINKS.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener" className={BTN} style={BTN_BG}>
            {l.label}
            <span aria-hidden className="text-[8px] opacity-70">↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}
