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
 * 
 */ 
const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}


const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}


const registrarPaciente = async(req,res)=>{
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const nuevoPaciente = new Paciente(req.body)
    console.log(req.veterinarioBDD._id)
    nuevoPaciente.veterinario=req.veterinarioBDD._id
    console.log(nuevoPaciente)
    await nuevoPaciente.save()
    res.status(200).json(nuevoPaciente)
}

const actualizarPaciente = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    await Paciente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}



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