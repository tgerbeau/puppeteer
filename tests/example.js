const pupperteer = require ('puppeteer')
const expect = require ('chai').expect

const config = require ('../lib/config')
const click = require ('../lib/helpers').click
const typeText = require ('../lib/helpers').typeText

describe ('My first puppeteer', () => {
    let browser
    let page

    before (async function () {
        browser = await pupperteer.launch({
            headless: config.isHeadless,
            slowMo: config.slowMo,
            devtools : config.isDevtools,
            timeout: config.launchTimeout,
        })
        page = await browser.newPage()
        await page.setDefaultTimeout(config.waitingTimeout)
        await page.setViewport({
            width : config.viewportWidth,
            height: config.viewportHeight,
        }) 
    }) 

    after (async function () {
        await browser.close()
     })

    it('My first test step', async () => {
        await page.goto(config.baseUrl)
        await page.waitForSelector('#nav-search')

        const url = await page.url()
        const title = await page.title()

        expect(url).to.contain("dev")
        expect(title).to.contain("Community")
    })
    it('click method',async () => {
        await page.goto(config.baseUrl)
        await click (page, '#write-link') 
        await page.waitForSelector('.registration-rainbow')                 
    })

    it('type_something_in_search_bar', async () => {
        await page.goto(config.baseUrl)
        await typeText (page,"something great here", '#nav-search')
        await page.keyboard.press('Enter')
        await page.waitForSelector('#articles-list')
    })  
})