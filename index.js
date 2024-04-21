require('dotenv').config()
const express = require('express')
const app = express()

// MongoDB and Mongoose handling
const Note = require('./models/note')

// for using the /dist folder as frontend
app.use(express.static('dist'))
// for using json file format automatically when sending/receiving data
app.use(express.json())

// "cors" for cross origin resource sharing
const cors = require('cors')
app.use(cors())


// "requestLogger" for logging requests in console
const requestLogger = (request, response, next) => {
   console.log('Method:', request.method)
   console.log('Path:  ', request.path)
   console.log('Body:  ', request.body)
   console.log('---')
   next()
}
app.use(requestLogger)


let notes = [

]

app.get('/', (request, response) => {
   response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
   Note.find({}).then(notes => {
      response.json(notes)
   })
})

app.get('/api/notes/:id', (request, response, next) => {
   Note.findById(request.params.id)
      .then(note => {
         if (note) {
            response.json(note)
         } else {
            response.status(404).end()
         }
      })
      .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
   const body = request.body

   const note = new Note({
      content: body.content,
      important: body.important || false
   })

   note.save()
      .then(savedNote => response.json(savedNote))
      .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
   const { content, important } = request.body

   Note.findByIdAndUpdate(
      request.params.id,
      { content, important },
      { new: true, runValidators: true, context: 'query' }
   )
      .then(updatedNote => response.json(updatedNote))
      .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
   // const id = Number(request.params.id)
   // notes = notes.filter(note => note.id !== id)

   // response.status(204).end()
   Note.findByIdAndDelete(request.params.id)
      .then(result => response.status(204).end())
      .catch(error => next(error))
})


// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// error handler middleware (because of 4 parameters)
const errorHandler = (error, request, response, next) => {
   console.error(error.message)

   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
   } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
   }

   // pass error to default express error handler
   next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`started on port ${PORT}`)
})