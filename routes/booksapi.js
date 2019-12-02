const express = require("express");
const router = express.Router();

//Datenbankoperationen bei Büchern
const books = require("../database/books");

//Übersicht
router.get('/', async (request, response) => {
    response.send(await books.getAll());
  });
  
//Detail Seite
router.get('/:id', async (request, response) => {
    const book = await books.findById(request.params.id);

    if (book == null) {
        response.status(404).send({error: `Book ${request.params.id} not found`});
        return;
    }

    response.send(book);
});

//Buch hinzufügen
router.post('/', async (request, response) => {
    const book = await books.create(request.body);
    response.status(201).send(book);
});

//Buch ändern/updaten
router.put('/:id', async (request, response) => {
    const book = await books.update(request.params.id, request.body);
    response.status(201).send(book);
});

//Buch löschen
router.delete('/:id', async (request, response) => {
    const isDeleted = await books.remove(request.params.id);
    console.log(isDeleted);

    if (isDeleted == null) {
        response.status(404).send({error: `Book ${request.params.id} not found`});
        return;
    }

    response.status(202).send("Erfolgreich gelöscht!");
});

module.exports = router;