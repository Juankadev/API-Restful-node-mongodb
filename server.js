const express = require("express");
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware para establecer el encabezado Content-Type en las respuestas
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).end("Bienvenido a la API de Frutas");
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
    res.json(muebles);
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
  const codigo = parseInt(req.params.codigo);
  try {
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
  const nombre = req.params.nombre;
  let nombreRegExp = RegExp(nombre, "i");
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
      .find({ nombre: nombreRegExp })
      .toArray();
   
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
  const categoria = req.params.categoria;
  let categoriaRegExp = RegExp(categoria, "i");
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
      res.status(404).send("Mueble/s no encontrado/s");
    }
  } catch (error) {
    // Manejo de errores al obtener los muebles por su categoria
    res.status(500).send("Error al obtener mueble/s de la base de datos por su categoria");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para agregar un recurso
app.post("/mobiliario", async (req, res) => {
  const mueble = req.body;
  try {
    if (mueble === undefined) {
      res.status(400).send("Error en el formato de datos a crear.");
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("mobiliario");
    const collection = db.collection("mobiliario");
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
app.put("/mobiliario/:codigo", async (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const precio = req.body.precio; //si no llega el campo precio guarda undefined
  try {
    if (!precio) {
      res.status(400).send("El campo precio no se definió en el cuerpo de la solicitud");
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("mobiliario");
    const collection = db.collection("mobiliario");

    await collection.updateOne({ codigo: codigo }, { $set: {precio: precio} });

    console.log("Precio modificado");

    res.status(200).send(precio);
  } catch (error) {
    // Manejo de errores al modificar un precio
    res.status(500).send("Error al modificar un precio");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para eliminar un recurso
app.delete("/mobiliario/:codigo", async (req, res) => {
  const codigo = parseInt(req.params.codigo);
  try {
    if (!codigo) {
      res.status(400).send("Error en el formato de datos a eliminar.");
      return;
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de muebles, buscar un mueble por su codigo y eliminarlo
    const db = client.db("mobiliario");
    const collection = db.collection("mobiliario");
    const resultado = await collection.deleteOne({ codigo: codigo });
    if (resultado.deletedCount === 0) {
      res
        .status(404)
        .send("No se encontró ningun mueble con el codigo enviado.");
    } else {
      console.log("Mueble eliminado");
      res.status(204).send();
    }
  } catch (error) {
    // Manejo de errores al obtener las frutas
    res.status(500).send("Error al eliminar el mueble");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

//ruta predeterminada para manejar rutas inexistentes
app.use((req,res)=>{
    res.status(404).send("No existe el Endpoint");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
