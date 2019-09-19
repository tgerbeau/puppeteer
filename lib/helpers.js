module.exports = {
    click: async function (page,selector){
        try {
            await page.waitForSelector(selector)
            await page.click(selector)
        }   catch (error){
            throw new Error (`Could not find selector: ${selector}`)
        }
    },

    typeText: async function(page,text,selector){
        try {
            await page.waitForSelector(selector)
            await page.type(selector,text)
        }   catch (error) {
            throw new Error (`Could not type text into selector: ${selector}`)
        }
    },
    
    loadUrl: async function(page,url){
        await page.goto(url, {waitUntil: 'networkidle0'})
    },

    getText: async function(page,selector){
        try {
            await page.waitForSelector(selector)
            return page.$eval(selector,e => e.innerHTML)
        }   catch (error) {
            throw new Error (`Cannot get text from selector: ${selector}`)
        }
    }
    
}