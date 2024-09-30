import sqlite from 'sqlite3';

const dbPath = './database.db'; // Path to the database file

// Connect to the database in a physical file
export const db = new sqlite.Database(dbPath);

/* Init car and driver tables if they don't exist */
export async function initDb() {
    await db.run("CREATE TABLE if not exists products (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT" +
        ", code TEXT" +
        ", url TEXT" +
        ")");
};

export async function closeDb() {
    await db.close();
}

export async function insertProduct(code, url) {
    try {
        await db.run("INSERT INTO products (code, url) VALUES (?, ?)", [code, url]);
    } catch (error) {
        console.error('Error al insertar datos:', error);
    }
}

export function getProductFromId(id) {
    db.get("SELECT * FROM products where id = ?", [id]), (err, row)=>{
        if(err){
            throw err;
        }
        console.log(row.code)
        return row;
    }
}

export function getProductFromCode(code) {
    // try {
    //     return await db.get("SELECT * FROM products where code = ?", [code]);
    // } catch (error) {
    //     console.error('Error al obtener datos:', error);
    // }
    db.get("SELECT * FROM products where code = ?", [code]), (err, row)=>{
        if(err){
            throw err;
        }
        console.log(row.code)
        return row;
    }
}

export async function getAllProducts() {
    try {
        return await db.all("SELECT * FROM products");
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

export async function updateProduct(id, code, url) {
    try {
        await db.run("UPDATE products SET url = ?, code = ? WHERE id = ?", [code, url, id]);
    } catch (error) {
        console.error('Error al actualizar datos:', error);
    }
}

export async function deleteProduct(id) {
    try {
        await db.run("DELETE FROM products WHERE id = ?", [id]);
    } catch (error) {
        console.error('Error al eliminar datos:', error);
    }
}