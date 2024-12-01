require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const People = require('./models/people')

const app = express()

/* Middleware */
app.use(express.json())

/* Sallitaan CORS */
app.use(cors())

app.use(express.static('dist'))

/*
app.use(morgan('tiny'))
*/

/* Logataan myös pyynnön mukana tuleva data */
morgan.token('body', (req) => {
  return JSON.stringify(req.body) || ''
})

/* Logataan pyynnön tiedot */
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* Juuresta saadaan vastauksena Hello World! Fullstack-versiossa frontend hoitaa tämän.
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
*/

/* Puhelinluettelon tiedot */
app.get('/api/persons', (request, response, next) => {
  People.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

/* Info-sivu */
app.get('/info', (request, response, next) => {
  People.countDocuments({}).then(count => {
    const presentTime = new Date()
    response.send(
      `<p>Phonebook has info for ${count} people.</p>
       <p>${presentTime}</p>`
    )
  //}).catch(error => {
  //  response.status(500).send({ error: 'something went wrong' })
  }).catch(error => next(error))
  //})
})

// Yksittäisen henkilön haku
app.get('/api/persons/:id', (request, response, next) => {
  People.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      // Jos henkilöä ei löydy, palautetaan 404
      //} else {
      //  response.status(404).end()
      }
    })
    // Jos tulee virhe, siirrytään virheidenkäsittelijään
    .catch(error => next(error))
})

/* Lisätään uusi henkilö */
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  /* Tarkistetaan, että nimi ja numero on annettu */
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  /* Tarkistetaan, että nimi on uniikki */
  People.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    /* Luodaan uusi henkilö */
    const person = new People({
      name: body.name,
      number: body.number,
    })

    /* Tallennetaan henkilö tietokantaan */
    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
    //}).catch(error => {
    //  response.status(500).json({ error: 'something went wrong in person.save()' })
    //})
  }).catch(error => next(error))
  //}).catch(error => {
  //  response.status(500).json({ error: 'something went wrong in People.findOne()' })
  //})
})

/* Päivitetään yksittäisen henkilön tiedot */
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  People.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/* Poistetaan yksittäinen henkilö */
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  //phonebook = phonebook.filter(person => person.id !== id)
  People.deleteOne({ _id: id })
    .then(result => console.log(result))
  //.catch(err => console.error(err))
    .catch(error => next(error))

  response.status(204).end()
})

/* Siirretty errorHandleriin
// Jos pyydettyä osoitetta ei ole, palautetaan 404
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Jos pyydettyä osoitetta ei ole, palautetaan 404
app.use(unknownEndpoint)
*/

// Otetaan kiinni tietokannan palaute virheellisestä ID:stä
const errorHandler = (error, request, response, /*next*/) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.status === 404) {
    return response.status(404).send({ error: 'unknown endpoint' })
  }

  return response.status(500).json({ error: 'something went wrong' })

  // next(error)
}

// Käsitellään virheitä
app.use(errorHandler)

/* Portti */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})