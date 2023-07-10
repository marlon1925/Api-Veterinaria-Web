// Reaalizar importaciones
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import path from 'path'
import routerVeterinarios from './routers/veterinario_routes.js'
import routerPacientes from './routers/paciente_routes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node MongoDB API",
            version: "1.0.0"
        },
        servers: [
            { 
                url: "http://localhost:3000" 
            }
        ]
    },
    apis:[`${path.join(__dirname,"./controllers/*.js")}`],
}


//Inicializar Express en la vatiable app
const app = express()
dotenv.config()


// Configuraciones 
app.set('port', process.env.port || 3000)
app.use(cors())


// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/', (req, res) => {
    res.send("Server on")
})

app.use('/api', routerVeterinarios)

app.use('/api', routerPacientes)

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerSpec)))

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))




// Una exportacion de la variable app
export default app