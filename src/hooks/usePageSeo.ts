import { useEffect } from 'react'

interface PageSeoProps {
  title: string
  description: string
  canonical: string
}

export function usePageSeo({ title, description, canonical }: PageSeoProps) {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

    const prevDesc = metaDesc?.content ?? ''
    const prevOgTitle = ogTitle?.content ?? ''
    const prevOgDesc = ogDesc?.content ?? ''
    const prevOgUrl = ogUrl?.content ?? ''
    const prevCanonical = canonicalLink?.href ?? ''

    document.title = title
    if (metaDesc) metaDesc.content = description
    if (ogTitle) ogTitle.content = title
    if (ogDesc) ogDesc.content = description
    if (ogUrl) ogUrl.content = canonical
    if (canonicalLink) canonicalLink.href = canonical

    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.content = prevDesc
      if (ogTitle) ogTitle.content = prevOgTitle
      if (ogDesc) ogDesc.content = prevOgDesc
      if (ogUrl) ogUrl.content = prevOgUrl
      if (canonicalLink) canonicalLink.href = prevCanonical
    }
  }, [title, description, canonical])
}
