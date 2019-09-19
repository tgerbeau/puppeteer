const pupperteer = require ('puppeteer')
const expect = require ('chai').expect
const config = require ('../lib/config')
const click = require ('../lib/helpers').click
const typeText = require ('../lib/helpers').typeText
const loadUrl = require ('../lib/helpers').loadUrl
const assert = require('assert')
const request = require ('request')


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

    function APItesting (requestToPlay, timeoutThreshold, expectedData) {
        
        return new Promise((resolve, reject) => {
            request (requestToPlay, function (error,response,body){
                if (! error) {
                    data = JSON.parse(body)
                    let obj = { codePostal: data[0].codePostal, 
                        codeCommune: data[0].codeCommune,
                        nomCommune: data[0].nomCommune,
                        libelleAcheminement: data[0].libelleAcheminement};
                            
                    if (obj.codePostal === expectedData.codePostal
                    && obj.codeCommune === expectedData.codeCommune
                    && obj.nomCommune === expectedData.nomCommune
                    && obj.libelleAcheminement === expectedData.libelleAcheminement
                    ) {
                        resolve("Success");
                    }
                    else {
                        reject("Échec dans les valeurs retournées par la requete.");
                    }    
                } else {
                        reject("request fail");
                }
                
            });
            setTimeout (function() {
                reject('Request Timeout');
            },timeoutThreshold);
        });
    }


    async function asyncCall () {
        var requestToPlay1 =`https://apicarto.ign.fr/api/codes-postaux/communes/94300` 
                
        var obj = {codePostal : '94300', codeCommune : '94080', 
        nomCommune : 'Vincennes', libelleAcheminement : 'VINCENNES'}; 

        var promise1 = await APItesting(requestToPlay1,100, obj);
        var promise2 = await APItesting(requestToPlay1,80, obj);

   
        Promise.all([promise1,promise2]).then(function(values){
            console.log(values);
        }); 
    }
    
    it('asyncCall',async () => {
        asyncCall ();
    })
});