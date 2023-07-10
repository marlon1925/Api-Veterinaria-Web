import { Router } from 'express'
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router()

import {
    actualizarPaciente,
    detallePaciente,
    eliminarPaciente,
    listarPacientes,
    registrarPaciente,
} from "../controllers/paciente_controller.js";

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
router.get("/pacientes", verificarAutenticacion, listarPacientes);
router.get("/paciente/:id", verificarAutenticacion, detallePaciente);
router.post("/paciente/registro", verificarAutenticacion, registrarPaciente);
router.put("/paciente/actualizar/:id", verificarAutenticacion, actualizarPaciente);
router.delete("/paciente/eliminar/:id", verificarAutenticacion, eliminarPaciente);


export default router