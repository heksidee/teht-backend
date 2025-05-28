require("dotenv").config()
const express = require("express")
const Note = require("./models/note")
const cors = require("cors")

const app = express()
app.use(cors());

let notes = []

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method)
    console.log("Path: ", request.path)
    console.log("Body: ", request.body)
    console.log("---")
    next() 
}

app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.json())

app.get("/", (request, response) => {
    response.send("<h1>Hello world!</h1>")
})

app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then((savedNote) => {
    response.json(savedNote)
  })
})

app.delete("/api/notes/:id", (request, response) => {
    const id = request.params.id
    /*notes = notes.filter((note) => note.id !== id)*/
    Note.findByIdAndDelete(id).then (() => {
      response.status(204).end()
    })
})

app.put("/api/notes/:id", (request, response) => {
  const { important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { important },
    { new: true, runValidators: true, context: "query" }
  )
  .then(updatedNote => {
    if (updatedNote) {
      response.json(updatedNote);
    } else {
      response.status(404).json({ error: "Note not found" });
    }
  })
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint "})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
