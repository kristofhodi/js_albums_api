import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS albums");
    await dbRun(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            band TEXT,
            title TEXT,
            year INTEGER,
            genre TEXT
        )
    `);

    const albums = [
        { band: "Travis Scott", title: "Rodeo", year: 2015, genre: "Hip-Hop" },
        { band: "Travis Scott", title: "Birds In The Trap Sing McKnight", year: 2016, genre: "Hip-Hop" },
        { band: "Travis Scott", title: "Astroworld", year: 2018, genre: "Hip-Hop" },
        { band: "Travis Scott", title: "Utopia", year: 2023, genre: "Hip-Hop" },
      
        { band: "Playboi Carti", title: "Die Lit", year: 2018, genre: "Trap" },
        { band: "Playboi Carti", title: "Whole Lotta Red", year: 2020, genre: "Trap" },
        { band: "Playboi Carti", title: "MUSIC", year: 2025, genre: "Trap" },
      
        { band: "Ken Carson", title: "Project X", year: 2021, genre: "Trap" },
        { band: "Ken Carson", title: "X", year: 2022, genre: "Trap" },
        { band: "Ken Carson", title: "A Great Chaos", year: 2023, genre: "Trap" },
        { band: "Ken Carson", title: "More Chaos", year: 2025, genre: "Trap" }

      ];
      

    for (const album of albums) {
        await dbRun(
            "INSERT INTO albums (band, title, year, genre) VALUES (?, ?, ?, ?);",
            [album.band, album.title, album.year, album.genre]
        );
    }
}