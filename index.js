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
  return JSON.stringify(req.body) || '';
});

/* Logataan pyynnön tiedot */
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* Jos pyydettyä osoitetta ei ole, palautetaan 404 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

/* Juuresta saadaan vastauksena Hello World! */
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

/* Puhelinluettelon tiedot */
app.get('/api/persons', (request, response) => {
  People.find({}).then(persons => {
    response.json(persons)
  })
})

/* Info-sivu */
app.get('/info', (request, response) => {
  People.countDocuments({}).then(count => {
    const presentTime = new Date()
    response.send(
      `<p>Phonebook has info for ${count} people.</p>
       <p>${presentTime}</p>`
    )
  }).catch(error => {
    response.status(500).send({ error: 'something went wrong' })
  })
})

/* Yksittäisen henkilön tiedot */
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(person => person.id === id)

  /* Jos henkilö löytyy, palautetaan tiedot, muuten 404 */
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

/* Luodaan satunnainen ID-numero väliltä 1024 - 8192 ja tarkistetaan, että sitä ei ole jo
// Tätä ei tarvita tietokantaa käyttävässä versiossa
const generateId = () => {
  let newId
  // Generoidaan uusi ID
  do {
    newId = Math.floor(Math.random() * (8192 - 1024 + 1)) + 1024
  } while (phonebook.some(person => person.id === String(newId))) // Tarkistetaan, että ID ei ole jo olemassa
  return String(newId)
}
*/

/* Lisätään uusi henkilö */
app.post('/api/persons', (request, response) => {
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
    }).catch(error => {
      response.status(500).json({ error: 'something went wrong in person.save()' })
    })
  }).catch(error => {
    response.status(500).json({ error: 'something went wrong in People.findOne()' })
  })
})

/* Poistetaan yksittäinen henkilö */
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  //phonebook = phonebook.filter(person => person.id !== id)
  People.deleteOne({ _id: id })
  .then(result => console.log(result))
  .catch(err => console.error(err));

  response.status(204).end()
})

/* Jos pyydettyä osoitetta ei ole, palautetaan 404 */
app.use(unknownEndpoint)

/* Portti */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})