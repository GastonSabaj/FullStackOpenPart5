//Este archivo solo setea el schema de note para mongoose

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    //Esto se encarga de cambiar el nombre del campo _id al campo id en el objeto retornado.
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    //__v es un campo interno de Mongoose que se utiliza para rastrear la versión del documento. No es necesario incluirlo en los objetos JSON, por lo que se elimina
    delete returnedObject.__v
  }
})

/* 
  Si se elimina el tercer argumento en la llamada a mongoose.model(), el modelo 'Note' se 
almacenará en la base de datos predeterminada de Mongoose. La base de datos predeterminada se define en la configuración de
Mongoose y generalmente se establece en la cadena de conexión de la base de datos. 
  Si no se ha configurado una base de datos predeterminada, Mongoose utilizará una base de datos en memoria temporal.

  En tu archivo /models/note.js, defines el modelo como Note, lo que hace que Mongoose busque 
una colección llamada notes en la base de datos. Si quieres que Mongoose use una colección específica, 
en este caso testingNote, debes especificarlo explícitamente como lo has hecho 
con la tercera opción en la llamada a mongoose.model():

  module.exports = mongoose.model('Note', noteSchema, "testingNote")

*/
module.exports = mongoose.model('Note', noteSchema)