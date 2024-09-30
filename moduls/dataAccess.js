import puppeteer from "puppeteer"
import dotenv from "dotenv"
// import { initDb, closeDb, getProductFromCode, insertProduct, db } from "../config/dbconfig.js"
import { initDb, getProductFromCode, deleteAll, insertProduct } from "../config/db.js"

dotenv.config();

export async function captureScreenshot() {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto('https://web.telegram.org/a/#-1002036245383');
    await page.screenshot({ path: 'example.png' });
    await browser.close();
}

export async function navigateWebPage() {
    const browser = await puppeteer.launch({
        slowMo: 200,
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://web.telegram.org/a/#-1002036245383");
    // await page.click('a[href="/login"]');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await browser.close();
}

export async function getDataFromWebPage(link) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 4320,
        deviceScaleFactor: 1,
    });
    await page.goto(link);
    await page.waitForSelector('.GridItem-module__container_PW2gdkwTj1GQzdwJjejN');
    const productListLinks = await page.evaluate(async () => {
        window.scrollTo(0, 500);
        const products = document.querySelectorAll('.GridItem-module__container_PW2gdkwTj1GQzdwJjejN');
        return [...products].map((product) => {
            const linkToPtoduct = product.querySelector('a').getAttribute("href");
            return linkToPtoduct;
        });
    });
    console.log(productListLinks);
    await browser.close();
    // await page.close();

    for await (let productLink of productListLinks) {
        // productPage = await browser.newPage();
        const browser2 = await puppeteer.launch({
            headless: true
        });

        const productPage = await browser2.newPage();
        await productPage.setViewport({
            width: 1920,
            height: 4320,
            deviceScaleFactor: 1,
        });

        await productPage.goto(productLink);
        await getItemData(productPage, productLink);
        await browser2.close();
    }
    // const productPage = await browser.newPage();
    // await productPage.goto(productListLinks[0]);
    // await getItemData(productPage);
    // await productPage.close();
    // console.log(productListLinks.length);
}

export async function getItemData(page, link) {
    const productCode = getProductCode(link);
    const AfiliatedUrl = getAfiliatedLink(productCode);
    console.log(productCode)
    //await deleteAll();
    const productDb = await getProductFromCode(productCode);
    if (productDb === undefined) {
        await page.waitForSelector('#centerCol');
        const data = await page.evaluate(() => {
            const quote = document.querySelector("#centerCol");
            const title = quote.querySelector("#productTitle").innerText;
            const discount = quote.querySelector(".savingsPercentage").innerText;
            const discountPrice = quote.querySelector(".aok-offscreen").innerText.split(" c")[0];
            const originalPrice = quote.querySelector(".a-text-price").innerText.split("\n")[0];
            return {
                title,
                discount,
                discountPrice,
                originalPrice
            };
        });
        
        await insertProduct(productCode, data.discount, data.discountPrice, AfiliatedUrl);
        const message = await createMessage(data, AfiliatedUrl);
        await sendTelegramMessage(message);
    }
}

function getAfiliatedLink(productCode) {
    const AfiliatedUrl = `https://www.amazon.es/dp/${productCode}/ref=nosim?tag=tecnoacierto_21&th=1`;
    console.log(AfiliatedUrl);
    return AfiliatedUrl;
}

function getProductCode(url) {
    const parts = url.split("/dp/");
    const productCode = parts[1].split("?")[0];
    return productCode;
}

// Function to create a Telegram message
async function createMessage(data, url) {
    const lineBreak = "%0A%0A";

    const message = "➡️ _" + data.title + "_" + lineBreak
        + "✅ *PRECIO OFERTA:* ‼️ " + data.discountPrice + " ‼️" + lineBreak
        + "❌ *PVP:* " + data.originalPrice + lineBreak
        + "📉 *AHORRO:* " + data.discount + " 🔥" + lineBreak
        + "🔗 " + " [ENLACE AMAZON](" + url + ")";

    return message;
}

// Function to send a message to a Telegram channel
async function sendTelegramMessage(message) {
    try {
        // Construct the Telegram API endpoint for sending a message
        const request = await fetch(`https://api.telegram.org/${process.env.TOKEN}/sendMessage?chat_id=${process.env.CHANNEL}&parse_mode=Markdown&text=${message}`, {
            method: 'GET',
            redirect: 'follow'
        });

        // Parse the JSON response from the Telegram API
        const response = await request.json();

        // Return the response object
        return response;
    } catch (error) {
        // Handle errors by logging them to the console
        console.error('Error:', error);
    }
}

