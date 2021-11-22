export class ContactUsForm{
    constructor(
        public nombreCompleto: string,
        public correo: string,
        public asunto: string,
        public mensaje: string
    ) {}
}