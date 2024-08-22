// const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@micluster.uix7hrk.mongodb.net/noteApp?retryWrites=true&w=majority&appName=MiCluster`

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'Tengo sueño',
//   important: false,
// })

// // note.save().then(result => {
// //   console.log('note saved!')
// //   mongoose.connection.close()
// // })


// /* 
// Los objetos se recuperan de la base de datos con el método find del modelo Note. 
// El parámetro del método es un objeto que expresa condiciones de búsqueda. 
// Dado que el parámetro es un objeto vacío {}, obtenemos todas las notas almacenadas en la colección notes.
// */
// Note.find({important: true }).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })