import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const componentPath = resolve(dirname(fileURLToPath(import.meta.url)), '../AuthLayout.vue')
const componentSource = readFileSync(componentPath, 'utf8')

describe('AuthLayout visual shell', () => {
  it('uses the /home-style auth shell instead of the legacy glass card layout', () => {
    expect(componentSource).toContain('auth-shell')
    expect(componentSource).toContain('auth-panel')
    expect(componentSource).toContain('--auth-brand: #3e55e9')

    expect(componentSource).not.toContain('card-glass')
    expect(componentSource).not.toContain('shadow-glass')
    expect(componentSource).not.toContain('blur-3xl')
    expect(componentSource).not.toContain('rounded-2xl')
    expect(componentSource).not.toContain('text-gradient')
    expect(componentSource).not.toContain('bg-gradient-to-br')
  })
})
