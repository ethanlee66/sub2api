import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import AppLayout from '../AppLayout.vue'

const routeMeta = ref<Record<string, unknown>>({})
const routePath = ref('/dashboard')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    get meta() {
      return routeMeta.value
    },
    get path() {
      return routePath.value
    }
  })
}))

vi.mock('@/stores', () => ({
  useAppStore: () => ({
    sidebarCollapsed: false,
  }),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: { role: 'user' },
  }),
}))

vi.mock('@/stores/onboarding', () => ({
  useOnboardingStore: () => ({
    setReplayCallback: vi.fn(),
  }),
}))

vi.mock('@/composables/useOnboardingTour', () => ({
  useOnboardingTour: () => ({
    replayTour: vi.fn(),
  }),
}))

afterEach(() => {
  document.body.classList.remove('app-shell-user', 'app-shell-admin')
})

describe('AppLayout shell variant', () => {
  it('marks non-admin routes as user shell', () => {
    routeMeta.value = { requiresAdmin: false }
    routePath.value = '/dashboard'

    const wrapper = mount(AppLayout, {
      global: {
        stubs: {
          AppSidebar: true,
          AppHeader: true,
        },
      },
    })

    expect(wrapper.classes()).toContain('app-shell-user')
    expect(wrapper.classes()).not.toContain('app-shell-admin')
  })

  it('marks admin routes as admin shell', () => {
    routeMeta.value = { requiresAdmin: true }
    routePath.value = '/admin/dashboard'

    const wrapper = mount(AppLayout, {
      global: {
        stubs: {
          AppSidebar: true,
          AppHeader: true,
        },
      },
    })

    expect(wrapper.classes()).toContain('app-shell-admin')
    expect(wrapper.classes()).not.toContain('app-shell-user')
  })

  it('mirrors the active shell class onto body for teleported user interface', async () => {
    routeMeta.value = { requiresAdmin: false }
    routePath.value = '/keys'

    const wrapper = mount(AppLayout, {
      global: {
        stubs: {
          AppSidebar: true,
          AppHeader: true,
        },
      },
    })

    expect(document.body.classList.contains('app-shell-user')).toBe(true)
    expect(document.body.classList.contains('app-shell-admin')).toBe(false)

    routeMeta.value = { requiresAdmin: true }
    routePath.value = '/admin/dashboard'
    await nextTick()

    expect(document.body.classList.contains('app-shell-user')).toBe(false)
    expect(document.body.classList.contains('app-shell-admin')).toBe(true)

    wrapper.unmount()

    expect(document.body.classList.contains('app-shell-user')).toBe(false)
    expect(document.body.classList.contains('app-shell-admin')).toBe(false)
  })
})
