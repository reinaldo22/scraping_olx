const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const fs = require('fs');

const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth:{
            api_key: ''
        }
    })
)

const excluirelatorio = async()=> {

    try {
        fs.unlinkSync('./index.html')
        console.log("Arquivo excluído!")
    } catch (error) {
        console.log("Deu problema na exclusão: ",error)
    }
}
//'lady.marubo@gmail.com',
//'le_ids@hotmail.com','m.k.m.guedes@hotmail.com'
const enviaEmail = async () =>{
    transporter.sendMail({
        to:'',
        from:'',
        subject:'Preço de casa para dona leide',
        html:({path: './index.html'})
    })
}

const main = async() =>{
    await enviaEmail();
    await excluirelatorio();
}

main();