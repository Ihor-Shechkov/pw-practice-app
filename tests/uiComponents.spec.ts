import {expect, test} from '@playwright/test'

// test.describe.configure({mode: 'parallel'}) // it's possible to set running mode for test

test.beforeEach(async ({page}) => {
    await page.goto('/') 
})

test.describe('Form layouts page', () => {
    //test.describe.configure({retries: 2}) // it's also possible to configure retry locally for test

    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async ({page}, testinfo) => {
        if(testinfo.retry){  // add some action in case of test retry
            //do something
        }

        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 300})

        // Generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        // Locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') // note that we search for value in input field
    })

    test('Radio buttons', async ({page}) => {
        const usingTheGrid = page.locator('nb-card', {hasText: "Using the Grid"})

        //await usingTheGrid.getByLabel('Option 1').check({force: true})
        await usingTheGrid.getByRole('radio', {name: 'Option 1'}).check({force: true})
        const radioStatus = await usingTheGrid.getByRole('radio', {name: 'Option 1'}).isChecked()
        
        // Visual testing, screenshots comparison
        // To update all screenshots use command: npx playwright test --update-snapshots
        await expect(usingTheGrid).toHaveScreenshot({maxDiffPixels: 100}) //not precise comparison

        // expect(radioStatus).toBeTruthy() // generic assertion
        // await expect(usingTheGrid.getByRole('radio', {name: 'Option 1'})).toBeChecked() // locator assertion

        // await usingTheGrid.getByRole('radio', {name: 'Option 2'}).check({force: true})
        // expect(await usingTheGrid.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        // expect(await usingTheGrid.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })
})

test('Checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    // check command is better than click, it verifies an actual checkbox status
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})
    
    // Check all
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('Lists and dropdowns', async ({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') // when the list has UL tag
    page.getByRole('listitem') // when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({hasText: 'Cosmic'}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropdownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate")
            await dropdownMenu.click()
    }
})

test('Tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    // 'cmd + \' to freeze browser (debug mode) in order to find a tooltip

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCard.getByRole('button', {name: 'Top'}).hover()

    page.getByRole('tooltip') // if you have a role tooltip created

    const toolTip = await page.locator('nb-tooltip').textContent()
    expect(toolTip).toEqual('This is a tooltip')
})

test('Dialog box', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // Accepting action in dialog box (by default it just closes)
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Web tables ', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1. get the row by any text in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})  // works for most cases
    await targetRow.locator('.nb-edit').click()
    // Used when text in the row is represented as input value
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('34')
    await page.locator('.nb-checkmark').click()
    
    // 2. get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').click()
    // using filter when text value is not unique
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')}) 
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // 3. test filter of the data
    const ages = ['20', '30', '40', '200']

    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        
        const ageRows = page.locator('tbody tr')
        for (let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()
            
            if(age == '200'){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            } 
        }
    }
})

test('Datepicker', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    // hardcoded values
    //await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()
    //await expect(calendarInputField).toHaveValue('Jun 1, 2024')

    // dynamic values with using Date methods
    let date = new Date() // using JS object Date that contains numerous methods to work with dates
    date.setDate(date.getDate() + 90)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('EN-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('EN-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('Sliders', async ({page}) => {
    // Update attribute
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '229.051')
    //     node.setAttribute('cy', '229.051')
    // })
    // await tempGauge.click()

    // Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    
    const box = await tempBox.boundingBox() // always starts at the left-top corner of the box
    const x = box.x + box.width / 2  // creating starting coordinates in the center of bounding box
    const y = box.y + box.height / 2 // now we can start moving the mouse from the center of the box (instead of left-top corner)
    await page.mouse.move(x, y)
    await page.mouse.down() // left click mouse
    await page.mouse.move(x+100, y) 
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')




})

