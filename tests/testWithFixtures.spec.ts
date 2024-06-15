import {test} from '../test-options' // importing custom fixtures
import {faker} from '@faker-js/faker'

test('Parametrized methods', async ({pageManager}) => { //using fixtures
    const randomFullName = faker.person.fullName()
    const randomMail = `${randomFullName.replace(' ', '')}${faker.number.int(100)}@test.com`

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomMail, true)
})
