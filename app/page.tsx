'use client'
import dynamic from 'next/dynamic'

const EvoQuestApp = dynamic(() => import('./EvoQuestApp'), { ssr: false })

export default function Page() {
  return <EvoQuestApp />
}
