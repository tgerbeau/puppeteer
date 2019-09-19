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

    function APItesting (requestToPlay, timeoutThreshold) {
        
        return new Promise((resolve, reject) => {
            request (requestToPlay, function (error,response,body){
                if (! error) {
                    data = JSON.parse(body)
                    let obj = { codePostal: data[0].codePostal, 
                        codeCommune: data[0].codeCommune,
                        nomCommune: data[0].nomCommune,
                        libelleAcheminement: data[0].libelleAcheminement};

                    if (obj.codePostal === '94300'
                    && obj.codeCommune === '94080' 
                    && obj.nomCommune === 'Vincennes'
                    && obj.libelleAcheminement === 'VINCENNES'
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
        var requestToPlay1 =`https://apicarto.in.fr/api/codes-postaux/communes/94300` 
        //var requestToPlay2 =`https://apiarto.ign.fr/api/codes-postaux/communes/93600` 
        var promise1 = await APItesting(requestToPlay1,100);
        var promise2 = await APItesting(requestToPlay1,100);

   
        Promise.all([promise1,promise2]).then(function(values){
            console.log(values);
        }); 
    }
    
    it('asyncCall',async () => {
        asyncCall ();
    })
});