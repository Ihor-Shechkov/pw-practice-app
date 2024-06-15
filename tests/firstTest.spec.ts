import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('/') 
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('User facing locators', async ({page}) => {
    await page.getByRole('button', {name: 'Submit'}).first().click()
    await page.getByRole('textbox', {name: 'Email'}).first().click()
    await page.getByLabel('Password').first().click()
    await page.getByPlaceholder('Password').first().fill('Pass1')
    await page.getByText('Basic form').click()
    await page.getByTitle('IoT Dashboard').click()
    //await page.getByTestId('MyLoc').click() -- custom locator
})

test('Regular locators', async({page}) => {
    await page.locator('#inputEmail3').fill('test text')
    await page.locator('.custom-checkbox').first().click() 
    await page.locator('[placeholder="Email"][id="exampleInputEmail1"]').click()
})

test('Locating child elements', async({page}) => {
    await page.locator('nb-card-body nb-radio-group nb-radio :text-is("Option 1")').click() // filtering text (:text - contains)
    await page.locator('nb-card nb-card-body').getByRole('textbox', {name: 'Email'}).first().click() // mixed locator
    await page.locator('nb-card').nth(0).getByRole('button', {name: 'Submit'}).click() // get by index
})

test('Locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"})
        .getByPlaceholder('Email').fill('test mail')

    await page.locator('nb-card', {has: page.locator('#inputPassword2')})
        .getByRole('textbox', {name: "Password"}).fill('test pass')
        
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'})
        .getByRole('textbox', {name: 'Email'}).fill('test email 1')
})

test('Reusing the locators', async ({page}) => {
    const basicForm = page.locator('nb-card', {hasText: 'Basic form'})
    const emailForm = basicForm.getByPlaceholder('Email')
    const passForm = basicForm.getByPlaceholder('Password')

    await emailForm.fill('test@gmail.com')
    await passForm.fill('testPass')
    await basicForm.locator('nb-checkbox').click()

    await expect(emailForm).toHaveValue('test@gmail.com')
})

test('Extracting values', async ({page}) => {
    // Single text value
    const basicForm = page.locator('nb-card', {hasText: 'Basic form'})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // All text values
    const radioButtonsValues = await page.locator('nb-radio').allTextContents()
    expect(radioButtonsValues).toContain('Disabled Option')

    // Input values
    const emailForm = page.locator('nb-card', {hasText: 'Basic form'}).getByPlaceholder('Email')
    await emailForm.fill('test@email.com') 
    const emailValue = await emailForm.inputValue()
    expect(emailValue).toEqual('test@email.com')

    // Attribute value
    const placeholderValue = await emailForm.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email') 
})

test('Assertions', async ({page}) => {
    const basicFormButton = page.locator('nb-card', {hasText: 'Basic form'}).locator('button')

    // General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    // Locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit') //skips the step if it fails
    await basicFormButton.click()
})