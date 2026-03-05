import { expect, test } from '@playwright/test'

test('playlist grid, lyrics, sleep timer, and quality flow', async ({ page }) => {
  test.skip(!process.env.E2E_NAVIDROME_USER, 'Set E2E_NAVIDROME_* vars to run live playback flow')
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

  await page.goto('/playlists')
  await page.getByLabel('Show playlist in grid view').click()
  await expect(page.getByLabel('Show playlist in grid view')).toBeVisible()

  const playButton = page.getByRole('button', { name: /^Play / }).first()
  await playButton.click()

  const lyricsButton = page.getByRole('button', { name: /^Open lyrics for / }).first()
  await lyricsButton.click()
  await expect(page.getByText(/lyrics \|/i)).toBeVisible()

  await page.getByRole('button', { name: '15' }).first().click()
  await page.locator('select[aria-label="Audio quality"]').first().selectOption('low')

  await expect.poll(() => lastStreamUrl).toContain('maxBitRate=128')
})
