import { getItemData, getDataFromWebPage } from './moduls/dataAccess.js'
import { initDb, deleteAll, deleteProductsDays} from "./config/db.js"
import { ELECTRONICA } from "./moduls/Constants.js"

// Llamada a los procesos
(async () => {
  // initDb();
  // deleteAll();
  deleteProductsDays(-7);
  getDataFromWebPage(ELECTRONICA.PORTATIL);
  getDataFromWebPage(ELECTRONICA.MOVIL);
})();