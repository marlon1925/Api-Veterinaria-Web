// Importar el modelo Veterinario
import Veterinario from "../models/Veterinario.js"
import sendMailToUser from "../config/nodemailer.js"



const login = async(req,res)=>{
    // Capturar datos del requets
    const {email,password} = req.body

    // Validacion de campos vacios
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})

    // Obetner el usuario en base al email
    // Es una consulta en la BDD select("-status -__v -token -updatedAt -createdAt")
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")

    // Validacion de la cuenta del email
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})

    // Validar si existe el usuario
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})

    // Validar si el password del request es el mismo de la base de datos BDD 
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

    // Desestructurar la info del usuario 
    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD

    // Presentar datos
    res.status(200).json({
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBDD.email
    })
    
}


const perfil=(req,res)=>{
    res.status(200).json({res:'perfil del veterinario'})
}


const registro = async (req,res)=>{
    // Capturar los datos del body de la peticion
    const {email,password} = req.body

    // Validacion de los campos vacios 
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    // Verificar la existencia del mail
    const verificarEmailBDD = await Veterinario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    
    // Crear la instancia del modelo 
    const nuevoVeterinario = new Veterinario(req.body)

    // Encriptar el password del usuario
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)

    const token = nuevoVeterinario.crearToken()
    await sendMailToUser(email,token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}



const confirmEmail = async(req,res)=>{
    // Validar el token del correo
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    // Verificamos si en base al token existe ese usuario
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})

    // Validar si el token ya fue seteado a null
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})

    // Setear a null el token
    veterinarioBDD.token = null

    // Cambiar a true la confirmacion de la cuenta
    veterinarioBDD.confirmEmail=true

    // Guardamos los cambios en la base de datos BDD
    await veterinarioBDD.save()

    // Presentamos mensajes al usuario 
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}



const listarVeterinarios = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}
const detalleVeterinario = (req,res)=>{
    res.status(200).json({res:'detalle de un eterinario registrado'})
}
const actualizarPerfil = (req,res)=>{
    res.status(200).json({res:'actualizar perfil de un veterinario registrado'})
}
const actualizarPassword = (req,res)=>{
    res.status(200).json({res:'actualizar password de un veterinario registrado'})
}
const recuperarPassword= (req,res)=>{
    res.status(200).json({res:'enviar mail recuperación'})
}
const comprobarTokenPasword= (req,res)=>{
    res.status(200).json({res:'verificar token mail'})
}
const nuevoPassword= (req,res)=>{
    res.status(200).json({res:'crear nuevo password'})
}


// Exportacion nombrada 
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}