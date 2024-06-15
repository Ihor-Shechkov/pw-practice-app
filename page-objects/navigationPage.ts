import { Locator, Page } from "@playwright/test";  // import Page fixture
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{    // create a class that can be imported by tests

    //readonly page: Page  // creating a field -- no need if we call Helper

    constructor(page: Page){  // defining type Page for parameter page
        super(page)
        //this.page = page // assigning this parameter to local field that related with this class -- no need if we call Helper
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        await this.waitForNumberOfSeconds(2) // using method from Helper
    }

    async datepickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){   // internal method that checks if menu is expanded or collapsed 
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false')
            await groupMenuItem.click()
    }

}

// Recommendation to keep locators inside the functional methods insead of moving them to the constructor