import '../../assets/js/smtp.js';

declare const Email: any;



export class Correo{
    constructor(){}

    EnviarCorreo(NombrePaciente: any, Solicitud: any, DescripcionCaso: any){
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



}