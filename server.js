// Importar el framework Express para la creación de la aplicación
const express = require('express');
const axios = require('axios');
// Importar la biblioteca para trabajar con el sistema de archivos (file system)
var fs = require("fs");

// Importar la librería para manejar sesiones en Express (para autenticación, por ejemplo)
var session = require("express-session");

// Crear una instancia de la aplicación Express
const app = express();

// Crear una instancia del servidor HTTP utilizando la aplicación Express
const server = require('http').Server(app);

// Definir el puerto en el que la aplicación escuchará, con opción de usar el puerto proporcionado por el entorno
const port = process.env.PORT || 3000;
// Configurar Express para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));
// Importar Mongoose para la conexión a MongoDB y el manejo de esquemas
const mongoose = require("mongoose");

// Importar funciones y modelo definidos en el archivo "conexionMongo.js"
const { Usuario, conectarDB } = require("./conexionMongo.js");
// Configurar Express para manejar datos en formato JSON
app.use(express.json());
// Configurar Express para usar el middleware de sesión
app.use(session({
    secret: "Tu cadena secreta", // Agrega tu propia cadena secreta aquí
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
var auth = function (req, res, next) {
    // Verificar si hay una sesión activa y si el usuario es "admin" y tiene el rol de administrador
    if (req.session && req.session.user === "admin" && req.session.admin) {
      // Permitir el acceso al siguiente middleware o ruta
      return next();
    } else {
      // Devolver un código de estado 401 (No autorizado) si la autenticación falla
      return res.sendStatus(401);
    }
  }

  


  app.get('/', (req, res) => {
   
    var contenido=fs.readFileSync("public/index.html");
    res.setHeader("Content-type", "text/html");
    res.send(contenido);
  });

  app.get('/login', (req, res) => {
   
    var contenido=fs.readFileSync("public/login.html");
    res.setHeader("Content-type", "text/html");
    res.send(contenido);
  });

  app.get('/registro', (req, res) => {
   
    var contenido=fs.readFileSync("public/registro.html");
    res.setHeader("Content-type", "text/html");
    res.send(contenido);
  });

app.get('/info', auth, (req, res) => {
  
  var contenido=fs.readFileSync("public/info.html");
  res.setHeader("Content-type", "text/html");
  res.send(contenido);
});
app.get('/rickymorty', async (req, res) => {
  
  const urlApiExterna = `https://rickandmortyapi.com/api/character/?page=${req.query.parametro}`;

  try {
    
    const response = await axios.get(urlApiExterna);

    
    const datosExternos = response.data;

    
    res.status(200).json(datosExternos);
  } catch (error) {
    
    console.error('Error al recuperar datos externos de Rick and Morty API:', error.message);

    
    res.status(500).json({ error: 'Error al recuperar datos externos de Rick and Morty API' });
  }
});

//Para filtrar por nombre
app.get('/nombre', async (req, res) => {
  
  const urlApiExterna = `https://rickandmortyapi.com/api/character/?name=${req.query.nombre}`;

  try {
    
    const response = await axios.get(urlApiExterna);

    
    const datosExternos = response.data;

    
    res.status(200).json(datosExternos);
  } catch (error) {
    
    console.error('Error al recuperar datos externos de Rick and Morty API:', error.message);

    
    res.status(500).json({ error: 'Error al recuperar datos externos de Rick and Morty API' });
  }
});

//Filtrar por vivo, muerto y desconocido
app.get('/estado', async (req, res) => {
  console.log("Estoy en situacion")
  
  const urlApiExterna = `https://rickandmortyapi.com/api/character/?status=${req.query.estado}`;

  try {
    
    const response = await axios.get(urlApiExterna);

    
    const datosExternos = response.data;

    
    res.status(200).json(datosExternos);
  } catch (error) {
    
    console.error('Error al recuperar datos externos de Rick and Morty API:', error.message);

    
    res.status(500).json({ error: 'Error al recuperar datos externos de Rick and Morty API' });
  }
});
/*** FUNCIONES POST ***/
// Ruta para registrar un nuevo usuario en la base de datos
app.post("/registrar", async function(req, res) {
    // Verificar si los campos de nombre de usuario y contraseña están presentes en la solicitud
    if (!req.body.username || !req.body.password) {
      res.send({"res": "register failed"}); // Enviar respuesta de fallo si los campos no están presentes
    } else {
      let usuarioExistente;
      try {
        // Comprobar si ya existe un usuario con el mismo nombre
        usuarioExistente = await Usuario.findOne({ nombre: req.body.username });
      } catch (err) {
        console.error("Error al crear usuario: ", err);
      }
      if (usuarioExistente) {
        console.log("Ya existe un usuario con ese nombre");
        res.send({"res": "usuario ya existe"}); // Enviar respuesta de fallo si el usuario ya existe
      } else {
        // Crear un nuevo usuario utilizando el modelo Mongoose
        const nuevoUsuario = new Usuario({
          nombre: req.body.username,
          password: req.body.password
        });
        try {
          // Guardar el nuevo usuario en la base de datos
          nuevoUsuario.save();
          console.log("Nuevo usuario creado: ", nuevoUsuario);
          res.send({"res": "register true"}); // Enviar respuesta de éxito si el registro es exitoso
        } catch (err) {
          console.error("Error al crear usuario: ", err);
        }
      }
    }
  });
  
  /**************************************************************************************/
  // Ruta para identificar y autenticar a un usuario utilizando la base de datos
app.post("/identificar", async function(req, res) {
    // Verificar si los campos de nombre de usuario y contraseña están presentes en la solicitud
    if (!req.body.username || !req.body.password) {
      res.send({"res": "login failed"}); // Enviar respuesta de fallo si los campos no están presentes
    } else {
      try {
        
        // Buscar un usuario en la base de datos con el nombre y contraseña proporcionados
        const usuarioEncontrado = await Usuario.findOne({ nombre: req.body.username, password: req.body.password });
  
        if (usuarioEncontrado) {
          // Usuario autenticado con éxito
          
          
         
  
          // Establecer la sesión indicando que el usuario está autenticado y es un administrador
          req.session.user = "admin";
          req.session.admin = true;
          
          // Enviar respuesta de éxito
          return res.send({"res": "login true"});
        } else {
          // Enviar respuesta de fallo si el usuario no es válido
          res.send({"res": "usuario no válido"});
        }
      } catch (err) {
        console.error("Error al identificar usuario: ", err);
      }
    }
  });


  

  
  conectarDB();

  server.listen(port, () => {
    
    console.log(`App escuchando en el puerto ${port}`);
  });