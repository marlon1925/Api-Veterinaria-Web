import Paciente from "../models/Paciente.js"
import mongoose from "mongoose"

/**
 * @swagger
 * /ruta-de-la-api/listar-pacientes:
 *   get:
 *     summary: Listar pacientes
 *     description: Obtiene la lista de pacientes asociados al veterinario.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 *       401:
 *         description: No se proporcionó un token válido.
 *       404:
 *         description: No se encontraron pacientes.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del paciente.
 *         propietario:
 *           type: string
 *           description: El nombre del paciente.
 *         email:
 *           type: string
 *           description: El correo del paciente
 *         ceular: 
 *           type: string
 *           description: numero del paciente
 *         convencional:
 *           type: string
 *           description: numero convencional del paciente
 *         ingreso:
 *           type: date
 *           description: la fecha de ingreso
 *         sintomas:
 *           type: string
 *           description: los sintomas del paciente
 *         salida:
 *           type: date
 *           description: la fecha de salida
 *         estado:
 *           type: booleano
 *           description: true o false
 *         veterinario:
 *           type: objeto
 *           description: datos del veterinario 
 * 
 */ 
const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}

/**
 * @swagger
 * /ruta-de-la-api/detalle-paciente/{id}:
 *   get:
 *     summary: Detalle de paciente
 *     description: Obtiene los detalles de un paciente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Detalles del paciente obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       401:
 *         description: No se proporcionó un token válido.
 *       404:
 *         description: No se encontró el paciente.
 */

const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}

/**
 * @swagger
 * /ruta-de-la-api/registrar-paciente:
 *   post:
 *     summary: Registrar paciente
 *     description: Registra un nuevo paciente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente registrado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Debes llenar todos los campos.
 */

const registrarPaciente = async(req,res)=>{
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const nuevoPaciente = new Paciente(req.body)
    console.log(req.veterinarioBDD._id)
    nuevoPaciente.veterinario=req.veterinarioBDD._id
    console.log(nuevoPaciente)
    await nuevoPaciente.save()
    res.status(200).json(nuevoPaciente)
}
/**
 * @swagger
 * /ruta-de-la-api/actualizar-paciente/{id}:
 *   put:
 *     summary: Actualizar paciente
 *     description: Actualiza los datos de un paciente existente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Actualización exitosa del paciente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Mensaje de éxito
 *       400:
 *         description: Debes llenar todos los campos.
 *       404:
 *         description: No se encontró el paciente.
 */
const actualizarPaciente = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    await Paciente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}

/**
 * @swagger
 * /ruta-de-la-api/eliminar-paciente/{id}:
 *   put:
 *     summary: Eliminar paciente
 *     description: Actualiza el estado y la fecha de salida de un paciente existente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salida:
 *                 type: string
 *                 format: date
 *                 description: Fecha de salida del paciente (en formato ISO 8601)
 *             required:
 *               - salida
 *     responses:
 *       200:
 *         description: Fecha de salida del paciente registrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Mensaje de éxito
 *       400:
 *         description: Debes llenar todos los campos.
 *       404:
 *         description: No se encontró el paciente.
 */

const eliminarPaciente = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const {salida} = req.body
    await Paciente.findByIdAndUpdate(req.params.id,{salida:Date.parse(salida),estado:false})
    res.status(200).json({msg:"Fecha de salida del paciente registrado exitosamente"})
}

export {
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}