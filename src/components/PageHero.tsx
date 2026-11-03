import type { ReactNode } from 'react'

type PageHeroProps = {
  module: string
  tag: string
  title: ReactNode
  subtitle: string
  pills?: ReactNode
}

export function PageHero({ module, tag, title, subtitle, pills }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" />
      <div className="wrap">
        <p className="ph-number">{module}</p>
        <p className="ph-tag">{tag}</p>
        <h1 className="ph-title">{title}</h1>
        <p className="ph-sub">{subtitle}</p>
        {pills && <div className="ph-who">{pills}</div>}
      </div>
    </section>
  )
}
