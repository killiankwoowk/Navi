import { expect, test } from '@playwright/test'

test('album cover navigation + queue + quality flow', async ({ page }) => {
  test.skip(
    !process.env.E2E_NAVIDROME_USER || !process.env.E2E_NAVIDROME_PASSWORD || !process.env.E2E_NAVIDROME_URL,
    'Set E2E_NAVIDROME_URL, E2E_NAVIDROME_USER, E2E_NAVIDROME_PASSWORD',
  )

  let lastStreamUrl = ''
  page.on('request', (request) => {
    if (request.url().includes('/rest/stream.view')) {
      lastStreamUrl = request.url()
    }
  })

  await page.goto('/login')
  await page.getByLabel('Server URL').fill(process.env.E2E_NAVIDROME_URL ?? '')
  await page.getByLabel('Username').fill(process.env.E2E_NAVIDROME_USER ?? '')
  await page.getByLabel('Password').fill(process.env.E2E_NAVIDROME_PASSWORD ?? '')
  await page.getByRole('button', { name: 'CONNECT' }).click()
  await page.waitForURL('**/library')

  await page.getByRole('link', { name: /^Open album / }).first().click()
  await expect(page).toHaveURL(/\/album\/.+/)

  await page.getByRole('button', { name: 'play album' }).click()

  await page.goto('/settings')
  await page.getByRole('radio', { name: /Low/i }).check()

  await page.goto('/library')
  await page.getByRole('link', { name: /^Open album / }).first().click()
  await page.getByRole('button', { name: 'play album' }).click()

  await expect.poll(() => lastStreamUrl).toContain('maxBitRate=128')
})
