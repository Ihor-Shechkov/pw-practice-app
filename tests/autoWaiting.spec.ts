import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto(process.env.URL) 
    await page.getByText('Button Triggering AJAX Request').click()
})

test('Auto waiting', async ({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()
    
    //const text = await successButton.textContent()
    //await successButton.waitFor({state: 'attached'})
    //const text = await successButton.allTextContents()

    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 16000})
})

test('Alternative waiting', async ({page}) => {
    const successButton = page.locator('.bg-success')
    // Wait for element
    await page.waitForSelector('.bg-success')

    // Wait for particular response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // Wait for network calls to be completes (NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('Timeouts', async ({page}) => {
    test.slow()  //increases timeout for test in three times
    //test.setTimeout(10000)
    const successButton = page.locator('.bg-success')
    await successButton.click()
})