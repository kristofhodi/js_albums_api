import express from 'express'
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js'

const app = express()
app.use(express.json())
app.use(express.static('public'));
// Listázás
app.get('/album', async (req, res) => {
    const albums = await dbAll("SELECT * FROM albums");
    res.status(200).json(albums);
});

// Egy album lekérdezése
app.get('/album/:id', async (req, res) => {
    const id = req.params.id;
    const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);
    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json(album);
});

// Zenekar alapján keresés
app.get('/album/search/:band', async (req, res) => {
    const band = req.params.band;
    const albums = await dbAll("SELECT * FROM albums WHERE band LIKE ?;", [`%${band}%`]);
    
    if (!albums.length) {
        return res.status(404).json({ message: "No albums found" });
    }

    res.status(200).json(albums);
});


// Új album hozzáadása
app.post('/album', async (req, res) => {
    const { band, title, year, genre } = req.body;
    if (!band || !title || !year || !genre) {
        return res.status(400).json({ message: "Missing data" });
    }
    const result = await dbRun(
        "INSERT INTO albums (band, title, year, genre) VALUES (?, ?, ?, ?);",
        [band, title, year, genre]
    );
    res.status(201).json({ id: result.lastID, band, title, year, genre });
});

// Album módosítása
app.put('/album/:id', async (req, res) => {
    const id = req.params.id;
    const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);
    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    const { band, title, year, genre } = req.body;
    if (!band || !title || !year || !genre) {
        return res.status(400).json({ message: "Missing data" });
    }

    await dbRun(
        "UPDATE albums SET band = ?, title = ?, year = ?, genre = ? WHERE id = ?;",
        [band, title, year, genre, id]
    );

    res.status(200).json({ id: +id, band, title, year, genre });
});

// Album törlése
app.delete('/album/:id', async (req, res) => {
    const id = req.params.id;
    const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);
    if (!album) {
        return res.status(404).json({ message: "Album not found" });
    }

    await dbRun("DELETE FROM albums WHERE id = ?;", [id]);
    res.status(200).json({ message: "Delete successful" });
});

// Hiba kezelő middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: `Error: ${err.message}` });
});

// Szerver indítása
async function startServer() {
    await initializeDatabase();
    app.listen(3000, () => {
        console.log('Server runs on http://localhost:3000');
    });
}

startServer();
