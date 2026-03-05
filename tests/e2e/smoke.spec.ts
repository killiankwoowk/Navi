import { test } from '@playwright/test'

test('login and render main shell', async ({ page }) => {
  test.skip(!process.env.E2E_NAVIDROME_USER, 'Set E2E_NAVIDROME_* vars to run live smoke test')
  await page.goto('/login')
  await page.getByLabel('Server URL').fill(process.env.E2E_NAVIDROME_URL ?? '')
  await page.getByLabel('Username').fill(process.env.E2E_NAVIDROME_USER ?? '')
  await page.getByLabel('Password').fill(process.env.E2E_NAVIDROME_PASSWORD ?? '')
  await page.getByRole('button', { name: 'CONNECT' }).click()
  await page.waitForURL('**/library')
})
