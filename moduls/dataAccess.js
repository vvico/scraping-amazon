import puppeteer from "puppeteer"
import dotenv from "dotenv"
import { TYPE } from "./Constants.js"
import { getProductFromCode, insertProduct } from "../config/db.js"

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

export async function getDataFromWebPage(link, type) {
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
    await page.setDefaultTimeout(10000);
    let productListLinks = [];
    try{
        await page.waitForSelector('.GridItem-module__container_PW2gdkwTj1GQzdwJjejN',);
        productListLinks = await page.evaluate(async () => {
            window.scrollTo(0, 500);
            const products = document.querySelectorAll('.GridItem-module__container_PW2gdkwTj1GQzdwJjejN');
            return [...products].map((product) => {
                const linkToPtoduct = product.querySelector('a').getAttribute("href");
                return linkToPtoduct;
            });
        });
    }catch(e){
        console.error("Error al leer los items");
        console.log(productListLinks);
    }
    await browser.close();

    for await (let productLink of productListLinks) {
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
        await getItemData(productPage, productLink, type);
        await browser2.close();
    }
}

export async function getDataFromWebArray(products, type) {
    for await (let productLink of products) {
        const browser = await puppeteer.launch({
            headless: true
        });

        const productPage = await browser.newPage();
        await productPage.setViewport({
            width: 1920,
            height: 4320,
            deviceScaleFactor: 1,
        });

        await productPage.goto(productLink);
        await productPage.setDefaultTimeout(10000);
        await getItemData(productPage, productLink, type);
        await browser.close();
    }
}

export async function getItemData(page, link, type) {
    const productCode = getProductCode(link);
    const AfiliatedUrl = getAfiliatedLink(productCode);
    const productDb = await getProductFromCode(productCode);
    let data = null;

    if (productDb === undefined) {
        try{
            await page.waitForSelector('#centerCol');
            data = await page.evaluate(() => {
                const titleDiv = document.querySelector("#centerCol");
                const title = titleDiv.querySelector("#productTitle").innerText;
                const priceDiv = document.querySelector("#corePriceDisplay_desktop_feature_div");
                const discount = priceDiv.querySelector(".savingsPercentage").innerText;
                const discountPrice = priceDiv.querySelector(".aok-offscreen").innerText.split(" c")[0];
                const originalPrice = priceDiv.querySelector(".a-text-price").innerText.split("\n")[0];
                return {
                    title,
                    discount,
                    discountPrice,
                    originalPrice
                };
            });
        }catch(e){
            console.error("Error al leer detalle de producto: " + e);
            console.log(productCode);
        }
        if(data !== null){
            await insertProduct(productCode, data.discount, data.discountPrice, AfiliatedUrl);
            const message = await createMessage(data, AfiliatedUrl);
            await sendTelegramMessages(message, type);
        }
    }
}

function getAfiliatedLink(productCode) {
    const AfiliatedUrl = `https://www.amazon.es/dp/${productCode}/ref=nosim?tag=tecnoacierto_21&th=1`;
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
        + "🔗 " + " [IR A AMAZON](" + url + ")";

    return message;
}

export async function communityMessage() {
    const lineBreakx2 = "%0A%0A";
    const lineBreak = "%0A";

    const message = "✳️ *Nuestra Comunidad* ✳️" + lineBreakx2
        + "🔰 *TODO CON MÁS DEL 25% DE DESCUENTO*‼️" + lineBreakx2
        // + "🔴 " + "[Acierto Chollos](" + "https://t.me/AciertoChollo" + ") - _Todos nuestros productos_" + lineBreak
        // + "🟠 " + "[Acierto Chollos +50%](" + "https://t.me/AciertoChollo50" + ") - _Más del 50% descuento_" + lineBreak
        + "🟢 " + "[TecnoAcierto](" + "https://t.me/tecnoAcierto" + ") - _Los mejores productos de Tecnología_" + lineBreak
        + "🔵 " + "[Acierto Hogar](" + "https://t.me/AciertoHogar" + ") - _Los mejores productos para el Hogar_" + lineBreakx2
        + "ℹ️ ÚNETE A NUESTRA COMUNIDAD Y NO TE PIERDAS NADA!";

   await sendTelegramMessage(message, process.env.TOKEN_ACIERTOHOGAR, process.env.CHANNEL_ACIERTOHOGAR);
    await sendTelegramMessage(message, process.env.TOKEN_TECNOACIERTO, process.env.CHANNEL_TECNOACIERTO);
}
// Function to send a message to a Telegram channel
async function sendTelegramMessages(message, type) {

    let token = process.env.TOKEN_TECNOACIERTO;
    let channel = process.env.CHANNEL_TECNOACIERTO;

    switch (type) {
        case TYPE.ELECTRONICA:
            token = process.env.TOKEN_TECNOACIERTO;
            channel = process.env.CHANNEL_TECNOACIERTO;
            break;
        case TYPE.HOGAR:
            token = process.env.TOKEN_ACIERTOHOGAR;
            channel = process.env.CHANNEL_ACIERTOHOGAR;
            break;
    }

    await sendTelegramMessage(message, token, channel);
}

async function sendTelegramMessage(message, token, channel) {
    try {
        // Construct the Telegram API endpoint for sending a message
        const request = await fetch(`https://api.telegram.org/${token}/sendMessage?chat_id=${channel}&parse_mode=Markdown&text=${message}`, {
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

