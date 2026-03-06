import { expect, test, type Page } from '@playwright/test'

const loginIfNeeded = async (page: Page) => {
  test.skip(
    !process.env.E2E_NAVIDROME_USER || !process.env.E2E_NAVIDROME_PASSWORD || !process.env.E2E_NAVIDROME_URL,
    'Set E2E_NAVIDROME_URL, E2E_NAVIDROME_USER, E2E_NAVIDROME_PASSWORD',
  )

  await page.goto('/login')
  await page.getByLabel('Server URL').fill(process.env.E2E_NAVIDROME_URL ?? '')
  await page.getByLabel('Username').fill(process.env.E2E_NAVIDROME_USER ?? '')
  await page.getByLabel('Password').fill(process.env.E2E_NAVIDROME_PASSWORD ?? '')
  await page.getByRole('button', { name: 'CONNECT' }).click()
  await page.waitForURL('**/library')
}

test('mobile layout shows bottom nav and expandable player', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await loginIfNeeded(page)

  await expect(page.getByLabel('Home')).toBeVisible()
  await page.getByLabel('Expand player').first().click()
  await expect(page.getByLabel('Minimize player')).toBeVisible()
  await page.getByRole('button', { name: /queue/i }).first().click()
  await expect(page.getByRole('dialog', { name: 'Queue drawer' })).toBeVisible()
})

test('tablet layout opens queue drawer', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 })
  await loginIfNeeded(page)
  await page.getByRole('button', { name: 'Open queue drawer' }).click()
  await expect(page.getByRole('dialog', { name: 'Queue drawer' })).toBeVisible()
})

test('desktop layout shows queue dock and 3-column shell', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await loginIfNeeded(page)
  await expect(page.getByText('| Queue')).toBeVisible()
})
