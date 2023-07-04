// InMPORTACION DE LA VAIABLE .APP POR MEDIO DE MODULOS
import app from './server.js'

// Importacopn de la variable de la base de datos
import connection from './database.js';

// Ejecutar el servidor por medio de modulos
app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})


// Invocacion para que la base de datos se conecte
connection()