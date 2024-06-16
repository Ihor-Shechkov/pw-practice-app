import {expect, test} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {NavigationPage} from '../page-objects/navigationPage'
import {FormLayoutsPage} from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage'
// to add datagenerator we need to install faker library
// run command: 'npm i @faker-js/faker --save-dev --force'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
    await page.goto('/') 
})

test('Navigate to form page @smoke @block', async ({page}) => { //--grep "@smoke|@block"
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()  
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('Parametrized methods', async ({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomMail = `${randomFullName.replace(' ', '')}${faker.number.int(100)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'}) //making screenshot after step
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomMail, true)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
    // await pm.navigateTo().datepickerPage()
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(7)
    // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(1, 3) 
})

test('Testing with Argos CI', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
})


// Docker
// To build container: docker build -t pw-pageobject-test . 
// To run container: docker run -it pw-pageobject-test  
// To stop container: ctrl+d
// To run docker-compose file: docker-compose up --build