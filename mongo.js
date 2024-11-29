/* Vain testaamiseen käytettävä tiedosto, joka lisää tietokantaan uuden henkilön tai tulostaa kaikki tietokannassa olevat henkilöt */

const mongoose = require('mongoose')

/*Jos salasanaa ei ole annettu, tulostetaan virheilmoitus*/
if (process.argv.length<3) {
  console.log('tietokantayhteys vaatii vähintään salasanan toimiakseen')
  process.exit(1)
}

/*Määritellään salasana, nimi ja puhelinnumero käyttämään ympäristömuuttujia*/
const password = process.argv[2]
const newName = process.argv[3] || null
const newPhoneNumber = process.argv[4] || null

/*Määritellään tietokannan URL*/
const url =
  `mongodb+srv://fullstack666:${password}@fullstackopen.cd1fc.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=fullstackopen`

/*Yhdistetään tietokantaan*/
mongoose.set('strictQuery', false)
mongoose.connect(url)

/*Määritellään skeema henkilöille*/
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

/*Määritellään Person-malli*/
const Person = mongoose.model('Person', personSchema)

/*Jos nimeä tai puhelinnumeroa ei ole annettu, tulostetaan kaikki henkilöt tietokannasta*/
if (newName === null || newPhoneNumber === null) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

/*Jos on annettu kaksi ylimääräistä argumenttia, tallennetaan ne tietokantaan nimenä ja puhelinnumerona*/
} else {
  const person = new Person({
    name: newName,
    number: newPhoneNumber,
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}