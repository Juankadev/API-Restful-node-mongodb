<h1>API REST</h1>
<p>Proyecto final Argentina Programa 4.0</p>

<h2> Introducción</h2>
Esta documentación le mostrará cómo realizar diferentes consultas.

</br>
<!-- 
- [EJEMPLOS DE USO](#ejemplos-de-uso)
- [GET](#get)
    - [GET POR NOMBRE](#get-por-nombre)
    - [GET POR PRECIO](#get-por-precio)
- [POST](#post)
- [PUT](#put)
- [DELETE](#delete)
- [.env](#env) -->



## Instalación
### Dependencias:
Asumiendo que tiene node.js preinstalado, ejecute en su terminal el siguiente comando:


```
npm install
```
Asegurese de estar posicionado en la carpeta de raiz del proyecto.

<br>

## Rutas
|MÉTODO|URL|DESCRIPCION|
|-|-|-|
|GET|http://localhost:4000/|La URL o ruta principal
|GET| http://localhost:4000/mobiliario | La URL general para visualizar todos los productos
|GET| http://localhost:4000/mobiliario/:codigo | La URL general para visualizar un producto por su código
|GET| http://localhost:4000/mobiliario/nombre/:nombre | La URL que nos retorna un producto/s por su nombre o parte de él
|GET| http://localhost:4000/mobiliario/categoria/:categoria | La URL que nos retorna un producto/s por su categoria
|POST| http://localhost:4000/mobiliario/ | La URL que nos permite dar de alta un recurso
|PATCH| http://localhost:4000/mobiliario/:id | La URL que nos permite modificar el precio de un recurso existente
|DELETE| http://localhost:4000/mobiliario/:id | La URL que nos permite eliminar un recurso existente

<br>

## EJEMPLOS DE USO
### GET
La URL general para visualizar todos los productos.
http://localhost:4000/mobiliario


```json
{
    "_id": "64b416afad2d5b968bdba9b5",
    "codigo": 1,
    "nombre": "Sofá de Cuero",
    "precio": 999.99,
    "categoria": "Sala de estar"
  },
  {
    "_id": "64b416afad2d5b968bdba9b6",
    "codigo": 2,
    "nombre": "Escritorio de Madera",
    "precio": 499.99,
    "categoria": "Oficina en casa"
  }
```


<br>



### GET CODIGO
La URL general para visualizar un producto por su código
http://localhost:4000/mobiliario/2 

```json
  {
    "_id": "64b416afad2d5b968bdba9b6",
    "codigo": 2,
    "nombre": "Escritorio de Madera",
    "precio": 499.99,
    "categoria": "Oficina en casa"
  }
```


<br>




### GET NOMBRE
La URL que nos retorna un producto/s por su nombre o parte de él
http://localhost:4000/mobiliario/nombre/escritorio

```json
  {
    "_id": "64b416afad2d5b968bdba9b6",
    "codigo": 2,
    "nombre": "Escritorio de Madera",
    "precio": 499.99,
    "categoria": "Oficina en casa"
  }
```



<br>





### GET CATEGORIA
La URL que nos retorna un producto/s por su categoria
http://localhost:4000/mobiliario/categoria/dormitorio

```json
  {
    "_id": "64b416afad2d5b968bdba9b7",
    "codigo": 3,
    "nombre": "Cama Queen Size",
    "precio": 799.99,
    "categoria": "Dormitorio"
  },
  {
    "_id": "64b416afad2d5b968bdba9ba",
    "codigo": 6,
    "nombre": "Armario multiestante",
    "precio": 89.99,
    "categoria": "Dormitorio"
  }
```



<br>




### POST 
La URL que nos permite dar de alta un recurso

http://localhost:4000/mobiliario/

```json
  {
    "codigo": 31,
    "nombre": "Cama Queen Size",
    "precio": 1279.99,
    "categoria": "Dormitorio"
  },
```


<br>



### PATCH 
La URL que nos permite modificar el precio de un recurso existente

http://localhost:4000/mobiliario/31


```json
  {
    "precio": 1579.99,
  }
```



<br>




### DELETE 
La URL que nos permite eliminar un recurso existente

http://localhost:4000/mobiliario/31




<!-- ## .env
Deberás crear en tu carpeta raíz un archivo con nombre ".env" donde incluirás las siguientes variables:
```javascript
PORT=4000
DATABASE_PATH=/database/frutas.json
``` -->