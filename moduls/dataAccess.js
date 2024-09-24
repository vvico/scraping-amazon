import puppeteer from "puppeteer"
import dotenv from "dotenv"

dotenv.config()


export async function captureScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('https://web.telegram.org/a/#-1002036245383');
  await page.screenshot({path: 'example.png'});
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

export async function getDataFromWebPage() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200,
    });
    const link = "https://www.amazon.es/deals?ref_=nav_cs_gb&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522reviewRating%255C%2522%253A%255B%255C%25224%255C%2522%255D%252C%255C%2522departments%255C%2522%253A%255B%255C%2522599371031%252F665492031%252F17425698031%255C%2522%255D%252C%255C%2522percentOff%255C%2522%253A%255B%255C%25222%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522"

    const page = await browser.newPage();
    await page.goto(link);
    //   await page.waitForSelector('div[data-loaded="true"]'); // Asegúrate de reemplazar esto con el selector de CSS correcto.
    console.log("UNO");
    await page.evaluate(() => {
        console.log("DOS");
        const quotes = document.querySelectorAll(".GridItem-module__container_PW2gdkwTj1GQzdwJjejN");
        console.log("22");
        const data = [...quotes].map((quote) => {
            console.log("TRES");
            quote.click("ProductCard-module__cardContainingLink_OkTYz2ZO_0za69shksJ7").then(async (pageDetail) => {
                console.log(pageDetail);
                await getItemData(pageDetail);
            });
        });
    });
    await browser.close();
}

export async function getItemData(page) {
    // const url = "https://www.amazon.es/dp/B0CNQ7LW2L/ref=nosim?tag=tecnoacierto_21&th=1"
    // const page = await browser.newPage();
    // await page.goto(url);
    
    //   await page.waitForSelector('div[data-loaded="true"]'); // Asegúrate de reemplazar esto con el selector de CSS correcto.
    const data = await page.evaluate(() => {
        const quote = document.querySelector("#centerCol");
        const title = quote.querySelector("#productTitle").innerText;
        const discount = quote.querySelector(".savingsPercentage").innerText;
        const discountPrice = quote.querySelector(".aok-offscreen").innerText.split(" c")[0];
        const originalPrice = quote.querySelector(".a-text-price").innerText.split("\n")[0];
        // const tags = [...quote.querySelectorAll(".tag")].map(
        //   (tag) => tag.innerText
        // );
        return {
            title,
            discount,
            discountPrice,
            originalPrice
        };
    });
    
    createMessage(data, url).then(async (message) =>{
        await sendTelegramMessage(message)
    });
}

export async function createMessage(data, url){
    const lineBreak = "%0A%0A";

    let message = "➡️ _" + data.title + "_" + lineBreak 
    + "✅ *PRECIO OFERTA:* ‼️ " + data.discountPrice + " ‼️" + lineBreak
    + "❌ *PVP:* " + data.originalPrice + lineBreak
    + "📉 *AHORRO:* " + data.discount + " 🔥" + lineBreak
    + "🔗 [ENLACE AMAZON](" + url + ")";
    
    return message;
}

// Function to send a message to a Telegram channel
export async function sendTelegramMessage(message) {
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
