const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}));


const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')

app.use(cors())


// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)



let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
]



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


app.get('/', (req, res) => {
    res.send('<a href="https://lit-badlands-15940.herokuapp.com/app/persons">Mene tänne</a>')
  })

app.get('/info', (req, res) => {
 
    res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot </p> ${Date(persons)}`)
  }) 

app.get('/app/persons', (req, res) => {
  res.json(persons)
})

const generateId = () => {
  const maxId = persons.length > 0 
  ? Math.max(...persons.map(p => p.id)) 
  : 0
  
  min = Math.ceil(maxId);
  max = Math.floor(1000000);

return Math.floor(Math.random() * (max - min)) + min;
}



app.post('/app/persons', (request, response) => {
  const body = request.body

  const result = persons.find( person => person.name === body.name );

  if(body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if(result) {
    return response.status(400).json({
      error: 'name already exist'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/app/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.get('/app/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.json(person)    
    } else {
        response.status(404).end()
    }
  })

  // const unknownEndpoint = (request, response) => {
  //   response.status(404).send({ error: 'unknown endpoint' })
  // }
  
  // app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})