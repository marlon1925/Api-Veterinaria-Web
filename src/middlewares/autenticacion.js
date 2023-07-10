//Importación JWT
import jwt from 'jsonwebtoken'
//Importación del modelo
import Veterinario from '../models/Veterinario.js'


//Definir una función para validar el JWT
/**
 * @swagger
 * components:
 *   schemas:
 *     verificarAutenticacionMiddleware:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Mensaje de error si no se proporciona un token.
 */

/**
 * @swagger
 * /ruta-a-la-que-se-aplica-el-middleware:
 *   get:
 *     summary: Descripción breve de la ruta
 *     description: Descripción detallada de la ruta y su funcionalidad.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Respuesta exitosa.
 *       401:
 *         description: No se proporcionó un token válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verificarAutenticacionMiddleware'
 *       404:
 *         description: No se encontró el recurso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verificarAutenticacionMiddleware'
 */

const verificarAutenticacion = async (req, res, next) => {

    if (!req.headers.authorization) return res.status(404).json({ msg: "Lo sentimos, debes proprocionar un token" })
    const { authorization } = req.headers
    //Obtener el JWT
    try {
        //Obtener solo el token
        const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)
        //Obtener el usuario en base a la ID
        req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
        next()
    } catch (error) {
        //Mandar mensajes de error
        const e = new Error("Formato del token no válido")
        return res.status(404).json({ msg: e.message })
    }
}

export default verificarAutenticacion