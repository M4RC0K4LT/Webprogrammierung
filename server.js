const express = require("express");
const app = express();

const user = require("./routes/user");
const booksapi = require("./routes/booksapi");

const bodyParser = require('body-parser');

app.use(bodyParser.json());


// User Funktionen
app.use("/user", user);

// Buch Funktionen
app.use("/api/v1/books", booksapi);

//Detail Seite Template
/*app.get('/books/:id', async (request, response) => {
  const book = await books.findById(request.params.id);
  
  if (book == null) {
    response.status(404).send({error: `Book ${request.params.id} not found`});
    return;
  }
  
  response.render('book', {
    title: book.title,
    author: book.author
  });
});

*/

// listen for requests
app.listen(3001, function() {
  console.log("Your app is listening on port " + 3000);
});
