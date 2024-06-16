import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({
  timeout: 40000,
  //globalTimeout: 60000,
  expect:{
    timeout: 2000,
    toHaveScreenshot: {maxDiffPixels: 50}
  },

  retries: 1,
  reporter: [
    ['html'],
    //['json', {outputFile: 'test-results/jsonReport.json'}],
    //['junit', {outputFile: 'test-results/junitReport.xml'}],
    //["allure-playwright"],
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

        // Set your Argos token (required if not using GitHub Actions).
        // token: "<YOUR-ARGOS-TOKEN>",
      },
    ]
  ],
  use: {
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
     baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
           : process.env.STAGING === '1' ? 'http://localhost:4202/'
           : 'http://localhost:4200/',

    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    video: {
      mode: 'off', 
      size: {width: 1920, height: 1080}
    }
  },

  projects: [
    {
      name: 'dev',
      use: { 
      browserName: 'chromium', 
      baseURL: 'http://localhost:4200/'
      },
    },
    
    {
      name: 'chromium', // Chrome is default browser
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        video: {
          mode: 'on', 
          size: {width: 1920, height: 1080}
        }
      },
        
    },

    {
      name: 'webkit',
      use: {
         browserName: 'webkit' },
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: {width: 1920, height: 1080}
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 14 Pro']
      }
    }
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200'
  }
});
