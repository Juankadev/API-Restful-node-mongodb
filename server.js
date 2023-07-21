const express = require("express");
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
//const { bool } = require("prop-types");
//const { boolean } = require("webidl-conversions");
const app = express();
const PORT = process.env.PORT || 3000;
const { MongoError } = require("mongodb"); //para lanzar excepciones de tipo MongoError

app.use(express.json());

// Middleware para establecer el encabezado Content-Type en las respuestas
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});



function diacriticSensitiveRegex(string = '') {
  return string
    .replace(/a/g, '[a,á,à,ä,â]')
    .replace(/A/g, '[A,a,á,à,ä,â]')
    .replace(/e/g, '[e,é,ë,è]')
    .replace(/E/g, '[E,e,é,ë,è]')
    .replace(/i/g, '[i,í,ï,ì]')
    .replace(/I/g, '[I,i,í,ï,ì]')
    .replace(/o/g, '[o,ó,ö,ò]')
    .replace(/O/g, '[O,o,ó,ö,ò]')
    .replace(/u/g, '[u,ü,ú,ù]')
    .replace(/U/g, '[U,u,ü,ú,ù]');
}




// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).end("Bienvenido a la API de Mobiliarios");
});


// Ruta para obtener todos los recursos
app.get("/mobiliario", async (req, res) => {
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de muebles y convertir los documentos a un array
    const db = client.db("mobiliario");
    const muebles = await db.collection("mobiliario").find().toArray();
    if (muebles.length > 0) {
      res.json(muebles);
      return;
    }
    res.status(500).send("Error al obtener muebles de la base de datos");

  } catch (error) {
    // Manejo de errores al obtener los muebles
    res.status(500).send("Error al obtener muebles de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});


// Ruta para obtener un recurso por su codigo
app.get("/mobiliario/:codigo", async (req, res) => {
  try {
    const codigo = parseInt(req.params.codigo);

    if (isNaN(codigo)) { //entra por acá si se envia algo como /"2" etc
      res.status(400).send("El parametro enviado no es valido");
      return;
    }
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de muebles y buscar un mueble por su codigo
    const db = client.db("mobiliario");
    const mueble = await db.collection("mobiliario").findOne({ codigo: codigo });
    if (mueble) {
      res.json(mueble);
    } else {
      res.status(404).send("Mueble no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener el mueble
    res.status(500).send("Error al obtener un mueble de la base de datos por su código");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});



// Ruta para obtener un recurso/s por su nombre
app.get("/mobiliario/nombre/:nombre", async (req, res) => {
  const nombre = req.params.nombre.trim();
  //let nombreRegExp = RegExp(nombre, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de muebles y buscar muebles por su Nombre
    const db = client.db("mobiliario");
    const muebles = await db
      .collection("mobiliario")
      .find({ nombre: { $regex: diacriticSensitiveRegex(nombre), $options: 'i' } })
      .toArray();

    console.log(muebles.length)

    if (muebles.length > 0) {
      res.json(muebles);
    } else {
      res.status(404).send("Mueble/s no encontrado/s");
    }
  } catch (error) {
    // Manejo de errores al obtener muebles por su nombre
    res.status(500).send("Error al obtener mueble/s de la base de datos por su nombre");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});



// Ruta para obtener un recurso/s por su categoria
app.get("/mobiliario/categoria/:categoria", async (req, res) => {
  const categoria = req.params.categoria.trim();
  let categoriaRegExp = RegExp(`^${categoria}$`, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de muebles y buscar el mueble por su categoria
    const db = client.db("mobiliario");
    const muebles = await db
      .collection("mobiliario")
      .find({ categoria: categoriaRegExp })
      .toArray();

    if (muebles.length > 0) {
      res.json(muebles);
    } else {
      res.status(400).send("Categoria no encontrada");
    }
  } catch (error) {
    // Manejo de errores al obtener los muebles por su categoria
    res.status(500).send("Error al obtener mueble/s de la base de datos por su categoria");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});



/////////////////////////////////////////////////////////////////////////////////////



// Ruta para agregar un recurso
app.post("/mobiliario", async (req, res) => {
  const mueble = req.body;
  try {
    //pasara por acá si no estan los middleware que formatean las solicitudes, por ejemplo si sacamos la linea de  app.use(express.json());
    if (mueble === undefined) {
      res.status(400).send("Error en el formato de datos a crear.");
      return;
    }

    if(req.body.codigo === undefined || req.body.nombre===undefined || req.body.precio === undefined || req.body.categoria === undefined){
      res.status(400).send("Error en el formato de datos a crear. Faltan campos");
      return;
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("mobiliario");
    const collection = db.collection("mobiliario");

    //Validar codigo repetido
    let existCodigo = await collection.find({ codigo: mueble.codigo }).toArray();
    if (existCodigo.length > 0) {
      res.status(400).send("El codigo ingresado ya existe en la Base de Datos.");
      return;
    }

    await collection.insertOne(mueble);
    console.log("Nuevo mueble creado");
    res.status(201).send(mueble);

  } catch (error) {
    // Manejo de errores al agregar un mueble
    res.status(500).send("Error al intentar agregar un nuevo mueble");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});



//Ruta para modificar el precio de un recurso
app.patch("/mobiliario/:codigo", async (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const precio = req.body.precio; //si no llega el campo precio, devuelve undefined
  try {
    if (isNaN(codigo)) { //si se envian un codigo con letras por parametro
      throw new SyntaxError('El codigo enviado por parametro debe ser numerico');
    }
    if (!precio) {
      //res.status(400).send("El campo precio no se definió en el cuerpo de la solicitud");
      throw new SyntaxError('El campo precio no se definió en el cuerpo de la solicitud');
    }
    if (Object.keys(req.body).length > 1) {
      throw new Error('Solo puede actualizar el campo Precio.');
    }
    if (typeof precio !== "number") {
      throw new SyntaxError('El valor del precio debe ser numerico');
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      //res.status(500).send("Error al conectarse a MongoDB");
      throw new MongoError('Error al conectarse a MongoDB');
    }

    const db = client.db("mobiliario");
    const collection = db.collection("mobiliario");

    //Validar que exista el codigo
    let existCodigo = await collection.find({ codigo: codigo }).toArray();
    if (!existCodigo.length) { //si es 0, se convierte en true
      res.status(400).send("El codigo ingresado no existe en la Base de Datos.");
      return;
    }
    await collection.updateOne({ codigo: codigo }, { $set: { precio: precio } });
    console.log("Precio modificado");
    res.status(204).send();

  }

  catch (error) {
    // Manejo de errores al modificar un precio
    if (error instanceof SyntaxError) {
      error = error.message;
      res.status(400).send(error);
      return;
    }
    else if (error instanceof MongoError) {
      error = error.message;
      res.status(500).send(error);
      return;
    }
    else if (error instanceof Error) {
      error = error.message;
      res.status(400).send(error);
      return;
    }
    else {
      res.status(400).send("Error al modificar un precio");
    }

  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});


// Ruta para eliminar un recurso
app.delete("/mobiliario/:codigo", async (req, res) => {
  const codigo = parseInt(req.params.codigo);
  try {
    if (!codigo) { //entra si se envían letras
      res.status(400).send("Error en el formato de datos a eliminar.");
      return;
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      throw new MongoError('Error al conectarse a MongoDB');
    }

    // Obtener la colección de muebles, buscar un mueble por su codigo y eliminarlo
    const db = client.db("mobiliario");
    const collection = db.collection("mobiliario");
    const resultado = await collection.deleteOne({ codigo: codigo });
    if (resultado.deletedCount === 0) {
      res
        .status(404)
        .send("No se encontró ningun mueble con el codigo enviado para eliminar.");
    } else {
      console.log("Mueble eliminado");
      res.status(204).send();
    }
  } catch (error) {
    if (error instanceof MongoError) {
      error = error.message;
      res.status(500).send(error);
      return;
    }
    res.status(500).send("Error al eliminar el mueble");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});


//ruta predeterminada para manejar rutas inexistentes
app.use((req, res) => {
  res.status(404).send("No existe el Endpoint");
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
