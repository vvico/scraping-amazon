import Database from 'better-sqlite3';

const db = new Database('./database.db', { verbose: console.log });

db.pragma('journal_mode = WAL');

/* Init car and driver tables if they don't exist */
export function initDb() {
    db.prepare("CREATE TABLE if not exists products (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT" +
        ", code TEXT" +
        ", discount TEXT" +
        ", price TEXT" +
        ", url TEXT" +
        ", date INTEGER" +
        ")").run();
};

export function getProductFromCode(code) {
    const stmt = db.prepare("SELECT * FROM products where code = ?");
    const product = stmt.get(code);
    return product;
}

export function insertProduct(code, discount, price, url) {
    const stmt = db.prepare("INSERT INTO products (code, discount, price, url, date) VALUES (?, ?, ?, ?, ?)");
    stmt.run(code, discount, price, url, new Date().getTime());
}

export function deleteAll() {
    db.prepare("DELETE FROM products").run();
};

export function deleteProduct(code) {
    db.prepare("DELETE FROM products where code = ?").run(code);
};

export function deleteProductsDays(days) {
    let dateOrigin = addDays(days);
    db.prepare("DELETE FROM products where date < ?").run(dateOrigin);
};

function addDays(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result.getTime();
}
