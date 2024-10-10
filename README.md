# Web Scraping de Amazon y Publicación de Ofertas en Telegram / Amazon Web Scraping and Offer Posting to Telegram

## Descripción / Description

**Español**:  
Este proyecto realiza web scraping en la página de **Amazon** para obtener las mejores ofertas del día y luego publica un mensaje en un canal de **Telegram** utilizando un bot. La aplicación busca productos en oferta en las categorías deseadas y envía los detalles al canal de Telegram en formato de mensaje.

**English**:  
This project performs web scraping on **Amazon** to find the best deals of the day and then publishes a message in a **Telegram** channel using a bot. The app searches for discounted products in selected categories and sends the details to a Telegram channel in a message format.

---

## Funcionalidades / Features

**Español**:
- Realiza web scraping en Amazon para obtener las mejores ofertas del día.
- Filtra y selecciona las ofertas más relevantes.
- Genera un mensaje automático con la información de las ofertas (nombre del producto, precio original, precio de oferta, porcentaje de descuento, y enlace al producto).
- Publica el mensaje en un canal de Telegram a través de un bot de Telegram.

**English**:
- Performs web scraping on Amazon to retrieve the best daily deals.
- Filters and selects the most relevant deals.
- Automatically generates a message with deal information (product name, original price, sale price, discount percentage, and product link).
- Posts the message in a Telegram channel via a Telegram bot.

---

## Requisitos / Requirements

- **Node.js** (v.14+)

Además, necesitarás las siguientes credenciales:  
Additionally, you'll need the following credentials:

- **API Key de Telegram** / **Telegram API Key**: Para conectar el bot con el canal de Telegram / To connect the bot to the Telegram channel.
- **Credenciales de acceso a Amazon** (opcional) / **Amazon access credentials** (optional): En algunas páginas de Amazon puede ser necesario autenticarte / Some Amazon pages may require authentication.

---

## Instalación / Installation

1. Clona el repositorio en tu máquina local / Clone the repository to your local machine:

       git clone https://github.com/vvico/scraping-amazon.git
   
2. Instala las dependencias utilizando npm / Install the dependencies using npm:

       npm install
3. Crea un archivo .env en el directorio raíz / Create a .env file in the root directory
4. Configura el bot en Telegram siguiendo los pasos de la documentación oficial de Telegram Bots / Set up the bot in Telegram by following the steps in the Telegram Bots official documentation.

---

## Uso / Usage

**Español**:  
Ejecuta el script principal para realizar el web scraping y enviar las ofertas al canal de Telegram:

**English**:  
Run the main script to perform the web scraping and send the deals to the Telegram channel:

    node index.js

---

## Automatización / Automation
**Español**:  
Si deseas que el scraping y la publicación de ofertas se realicen automáticamente, puedes usar la librería node-schedule para programar la ejecución del script a intervalos regulares (ej. cada 6 horas):

**English**:  
If you want the scraping and offer posting to happen automatically, you can use the node-schedule library to schedule the script to run at regular intervals (e.g., every 6 hours):

    const schedule = require('node-schedule');
    const ejecutarScraping = require('./index.js');
    
    schedule.scheduleJob('0 */6 * * *', ejecutarScraping); // Cada 6 horas / Every 6 hours

---

## Notas / Notes
**Español**:  
- Amazon puede bloquear solicitudes si detecta un comportamiento inusual en el scraping. Se recomienda hacer pausas entre solicitudes y usar proxies si es necesario.
- Puedes personalizar los productos y categorías que deseas buscar modificando las URLs en el archivo de configuración.

**English**:  
- Amazon may block requests if it detects unusual scraping behavior. It is recommended to pause between requests and use proxies if necessary.
- You can customize the products and categories you want to search for by modifying the URLs in the configuration file.













