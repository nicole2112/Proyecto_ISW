import '../../assets/js/smtp.js';

declare const Email: any;

export function EnviarCorreo(NombrePaciente: any, Solicitud: any, DescripcionCaso: any){
    Email.send({
        SecureToken: " c0c85b71-1052-45a0-8507-c395d5d555a2",
        To: 'Patriciamolina@dialisisdehonduras.com',
        From: 'Patriciamolina@dialisisdehonduras.com',
        Subject: `Nueva solicitud de Donación - ${NombrePaciente}`,
        Body: `Solicitud de Donación, lo que solicita el paciente es: ${Solicitud}` + '\n' + `Descripción del caso: ${DescripcionCaso}`
    }).then(
        message => console.log(message)
    );
}

export function EnviarCorreoDigi(NombrePaciente: any, CorreoDigitador:any){
    Email.send({
        SecureToken: " c0c85b71-1052-45a0-8507-c395d5d555a2",
        To: `${CorreoDigitador}`,
        From: 'Patriciamolina@dialisisdehonduras.com', //modificar correo presidencia 'rasodep696@naluzotan.com'
        Subject: `Actualización de Solicitud`,
        Body: `Presidencia ha respondido a su solicitud de donación del paciente: ${NombrePaciente}`
    }).then(
        message => console.log(message)
    );
}