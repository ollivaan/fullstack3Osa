if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
// app.use(logger)
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}));


const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))
const Person = require('./models/person')



// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Martti Tienari",
//     "number": "040-123456",
//     "id": 2
//   },
//   {
//     "name": "Arto Järvinen",
//     "number": "040-123456",
//     "id": 3
//   },
//   {
//     "name": "Lea Kutvonen",
//     "number": "040-123456",
//     "id": 4
//   }
// ]



morgan.token('id', function getId(req) {
  return req.id
});

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

app.use(morgan(loggerFormat, {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: process.stderr
}));

app.use(morgan(loggerFormat, {
  skip: function (req, res) {
    return res.statusCode >= 400
  },
  stream: process.stdout
}));


app.get('/info', (request, response) => {
  //tulostaa kolme :D
  response.send(`<p>puhelinluettelossa on ${ Person.length  } henkilön tiedot </p> ${Date(Person)}`)
})


app.get('/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  });
});


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0

  min = Math.ceil(maxId);
  max = Math.floor(1000000);

  return Math.floor(Math.random() * (max - min)) + min;
}


app.post('/persons', (request, response) => {
  const body = request.body
//   const result = persons.find( person => person.name === body.name );
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }


  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person.save().then(savedPerson => {
    return saverdPerson.toJSON()
    // response.json(savedPerson.toJSON())
  })
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
  .catch(error => next(error))
})


app.delete('/persons/:id', (request, response, next) => {

  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})  

app.put('/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  //tänne lisää sitten kun menee rikki
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})