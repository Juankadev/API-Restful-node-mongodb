const express = require("express");
const path = require('path');
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3008;

// Configurar la carpeta "public" como directorio de archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
    const client = await connectToDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }
        const db = client.db("mobiliario");
        const frutas = await db.collection("mobiliario").find().toArray();

	let data = {
		name: 'Akashdeep',
		hobbies: ['playing football', 'playing chess', 'cycling'],
        title: "titulo",
        muebles: frutas
	}

	res.render('index', { data: data });

    await disconnectFromMongoDB();
});

const server = app.listen(4000, function () {
	console.log('listening to port 4000')
});

