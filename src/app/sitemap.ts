import { MetadataRoute } from 'next'

// Required for static export
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://affimate.axiamasi.com'

    return [
        {
            url: baseUrl,
            lastModified: '2026-01-17',
            changeFrequency: 'daily',
            priority: 1,
        }
    ]
}
