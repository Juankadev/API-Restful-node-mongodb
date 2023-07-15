const express = require("express");
const path = require('path');
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
// Configurar la carpeta "public" como directorio de archivos estáticos
app.use(express.static(path.join(__dirname, "public")));


app.get('/', async (req, res) => {
  res.status(200).end("<h1>Bienvenido a la API de Frutas");
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

    if (muebles) {
      let data = {
        muebles: muebles
      }
      res.render('index', { data: data });
      //res.json(muebles);
    }
    else {
      const data = {
        message: "No existen muebles en la base de datos"
      }
      res.render('error', data);
      //res.status(404).send("Mueble no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener los muebles
    const data = {
      message: "No existen muebles en la base de datos"
    }
    res.render('error', data);
    //res.status(500).send("Error al obtener muebles de la base de datos");
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
      let data = {
        muebles: [mueble] //como findOne devuelve un objeto y no un array, si agregamos [] en el objeto mueble, este se convierte en un array con un elemento, y ahora podremos usarlo en nuestro ciclo for de la vista index.ejs ya que este procesa arrays
      }
      res.render('index', { data: data });
    } else {
      const data = {
        message: "No existe mueble con el codigo enviado"
      }
      res.render('error', data);
      //res.status(404).send("Mueble no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener el mueble
    const data = {
      message: "Error al obtener un mueble de la base de datos por su código"
    }
    res.render('error', data);
    //res.status(500).send("Error al obtener un mueble de la base de datos por su código");
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
      let data = {
        muebles: muebles
      }
      res.render('index', { data: data });
    } else {
      const data = {
        message: "Mueble/s no encontrado/s",
      }
      res.render('error', data);
      //res.status(404).send("Mueble/s no encontrado/s");
    }
  } catch (error) {
    // Manejo de errores al obtener muebles por su nombre
    const data = {
      message: "Error al obtener mueble/s de la base de datos por su nombre",
    }
    res.render('error', data);
    //res.status(500).send("Error al obtener mueble/s de la base de datos por su nombre");
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
      let data = {
        muebles: muebles //como findOne devuelve un objeto y no un array, si agregamos [] en el objeto mueble, este se convierte en un array con un elemento, y ahora podremos usarlo en nuestro ciclo for de la vista index.ejs ya que este procesa arrays
      }
      res.render('index', { data: data });
    } else {
      const data = {
        message: "Mueble/s no encontrado/s o Categoria inexistente",
      }
      res.render('error', data);
      //res.status(404).send("Mueble/s no encontrado/s");
    }
  } catch (error) {
    // Manejo de errores al obtener los muebles por su categoria
    const data = {
      message: "Error al obtener mueble/s de la base de datos por su categoria",
    }
    res.render('error', data);
    //res.status(500).send("Error al obtener mueble/s de la base de datos por su categoria");
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
app.use((req, res) => {
  const data = {
    message: "Ruta invalida",
  }
  res.render('error', data);
  //res.status(404).send("No existe el Endpoint");
});





// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
