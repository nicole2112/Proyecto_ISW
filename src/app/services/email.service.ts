import '../../assets/js/smtp.js';

declare const Email: any;

export function EnviarCorreo(NombrePaciente: any, Solicitud: any, DescripcionCaso: any){
    Email.send({
        SecureToken: "c4c2a6e5-ad26-49e5-8f8d-4468439ac72c",
        To: 'aaron20092009@hotmail.com',
        From: 'lopez.aaron1022@gmail.com',
        Subject: `Nueva solicitud de Donación - ${NombrePaciente}`,
        Body: `Solicitud de Donación, lo que solicita el paciente es: ${Solicitud}` + '\n' + `Descripción del caso: ${DescripcionCaso}`
    }).then(
        message => console.log(message)
    );
}

export function EnviarCorreoDigi(NombrePaciente: any, CorreoDigitador:any){
    Email.send({
        SecureToken: "735fd14b-47d2-47eb-b64d-6c94daa44421",
        To: `${CorreoDigitador}`,
        From: 'angella.falck@unitec.edu', //modificar correo presidencia 'rasodep696@naluzotan.com'
        Subject: `Actualización de Solicitud`,
        Body: `Presidencia ha respondido a su solicitud de donación del paciente: ${NombrePaciente}`
    }).then(
        message => console.log(message)
    );
}