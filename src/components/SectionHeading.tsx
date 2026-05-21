type Props = {
  eyebrow?: string
  title: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ eyebrow, title, align = 'left' }: Props) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.42em] text-lavender">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-sans text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.08] tracking-tight text-ink">
        {title}
      </h2>
      <div
        className={`mt-6 h-px bg-gradient-to-r from-ink/35 via-ink/10 to-transparent ${
          align === 'center' ? 'mx-auto w-2/3' : 'w-full'
        }`}
      />
    </div>
  )
}
