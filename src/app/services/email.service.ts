import '../../assets/js/smtp.js';

declare const Email: any;
declare const EmailDigi:any;

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
    EmailDigi.send({
        SecureToken: "c4c2a6e5-ad26-49e5-8f8d-4468439ac72c",
        To: CorreoDigitador,
        From: 'rasodep696@naluzotan.com', //modificar correo presidencia
        Subject: `Actualización de Solicitud`,
        Body: `Presidencia ha respondido a su solicitud de donación del paciente: ${NombrePaciente}`
    }).then(
        message => console.log(message)
    );
}