import { getDataFromWebPage, communityMessage, getDataFromWebArray } from './moduls/dataAccess.js'
import { initDb, deleteAll, deleteProductsDays } from './config/db.js'
import { ELECTRONICA, HOGAR, TYPE, OTROS_ELECT, OTROS_HOGAR } from './moduls/Constants.js'

const option = process.argv[2]
console.log('opcion: ' + option);

(async () => {
  switch (option) {
    case 'i': initDb()
      break
    case 'd': deleteAll()
      break
    case 'm': communityMessage()
      break
    default: run()
  }
})()

async function run () {
  // Borrar productos con más de x días
  await deleteProductsDays(-5)

  // Electrónica
  await getDataFromWebPage(ELECTRONICA.PORTATIL, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.MOVIL, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.TABLET, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.MONITOR, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.PC, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.AUDIO, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.AURICULAR, TYPE.ELECTRONICA)
  await getDataFromWebPage(ELECTRONICA.WATCH, TYPE.ELECTRONICA)

  // Hogar
  await getDataFromWebPage(HOGAR.CAFETERA, TYPE.HOGAR)
  await getDataFromWebPage(HOGAR.ELECTRODOMESTICO, TYPE.HOGAR)
  await getDataFromWebPage(HOGAR.FREIDORA, TYPE.HOGAR)
  await getDataFromWebPage(HOGAR.ROBOT, TYPE.HOGAR)

  // Productos individuales
  await getDataFromWebArray(OTROS_ELECT, TYPE.ELECTRONICA)
  await getDataFromWebArray(OTROS_HOGAR, TYPE.HOGAR)
}
