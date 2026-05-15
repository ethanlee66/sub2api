import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '../../..')
const readSource = (path: string) => readFileSync(resolve(root, path), 'utf8')

describe('user visual style structure', () => {
  it('keeps shared user table pages out of the legacy card shell', () => {
    const source = readSource('components/layout/TablePageLayout.vue')

    expect(source).toContain('class="table-scroll-container"')
    expect(source).not.toContain('card table-scroll-container')
  })

  it('uses flat usage page sections instead of metric cards', () => {
    const source = readSource('views/user/UsageView.vue')

    expect(source).toContain('usage-summary')
    expect(source).toContain('usage-filters')
    expect(source).not.toContain('class="card p-4"')
    expect(source).not.toContain('class="card"')
  })

  it('uses a flat redeem workflow without the legacy balance gradient card', () => {
    const source = readSource('views/user/RedeemView.vue')

    expect(source).toContain('redeem-page')
    expect(source).toContain('redeem-hero')
    expect(source).not.toContain('class="card')
    expect(source).not.toContain('bg-gradient-to-br')
    expect(source).not.toContain('rounded-2xl')
    expect(source).not.toContain('backdrop-blur-sm')
  })

  it('keeps the redeem form controls aligned with restrained input typography', () => {
    const source = readSource('views/user/RedeemView.vue')

    expect(source).toContain('redeem-control-row')
    expect(source).toContain('redeem-code-input')
    expect(source).toContain('font-size: 14px')
    expect(source).toContain('font-size: 30px')
    expect(source).not.toContain('class="input py-3 pl-12 text-lg"')
    expect(source).not.toContain('align-items: end')
  })

  it('renders subscriptions as flat rows instead of isolated cards', () => {
    const source = readSource('views/user/SubscriptionsView.vue')

    expect(source).toContain('subscriptions-page')
    expect(source).toContain('subscription-row')
    expect(source).not.toContain('class="card')
    expect(source).not.toContain('rounded-2xl')
    expect(source).not.toContain('grid gap-6 lg:grid-cols-2')
  })

  it('keeps monitor tiles restrained and non-floating', () => {
    const source = readSource('components/user/monitor/MonitorCard.vue')

    expect(source).toContain('monitor-card')
    expect(source).not.toContain('rounded-2xl')
    expect(source).not.toContain('shadow-card')
    expect(source).not.toContain('backdrop-blur-xl')
    expect(source).not.toContain('hover:-translate-y')
  })

  it('keeps the profile overview in the same flat user style', () => {
    const source = readSource('components/user/profile/ProfileInfoCard.vue')

    expect(source).toContain('profile-overview-panel')
    expect(source).toContain('profile-flat-panel')
    expect(source).not.toContain('class="card')
    expect(source).not.toContain('bg-gradient-to-br')
    expect(source).not.toContain('rounded-3xl')
    expect(source).not.toContain('shadow-lg')
  })
})
