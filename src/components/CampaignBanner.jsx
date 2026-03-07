import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadCampaign } from '../lib/appsStore.js'
import styles from './CampaignBanner.module.css'

export default function CampaignBanner() {
  const [campaign, setCampaign] = useState(null)

  useEffect(() => {
    let mounted = true
    loadCampaign().then(c => { if (mounted) setCampaign(c) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  if (!campaign || !campaign.active || !campaign.headline) return null

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h2 className={styles.headline}>{campaign.headline}</h2>
        {campaign.subtitle && <p className={styles.subtitle}>{campaign.subtitle}</p>}
        {campaign.ctaText && (
          <Link to={campaign.ctaLink || '/store'} className={styles.cta}>
            {campaign.ctaText}
          </Link>
        )}
      </div>
    </div>
  )
}
