//Esto era un archivo borrador para probar la conexion con la DB!

// const mongoose = require('mongoose');
// const Note = require('./models/note'); // Asegúrate de tener un modelo Note definido

// const url = 'mongodb+srv://fullstack:fullstack@micluster.uix7hrk.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=MiCluster';

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('connected to MongoDB');
//     return Note.find({});
//   })
//   .then(notes => {
//     if (notes.length === 0) {
//       console.log('No notes found, adding a sample note');
//       const note = new Note({
//         content: 'HTML is very very easy',
//         date: new Date(),
//         important: true,
//       });
//       return note.save();
//     } else {
//       console.log('Notes already exist:', notes);
//     }
//   })
//   .catch(error => {
//     console.error('Error connecting to MongoDB:', error.message);
//   })
//   .finally(() => {
//     mongoose.connection.close();
//   });
