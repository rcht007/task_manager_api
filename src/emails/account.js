const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{

    sgMail.send({
        to:email,
        from:'rchtnhr007@gmail.com',
        subject:'Thanks for joining in!',
        text:'Welcome to the app '+name+', let me know how to get along with the app'
    })


}

const sendCancelEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'rchtnhr007@gmail.com',
        subject:'account deleted',
        text:name+',you have succcesfully deleted the your account let me know how were we lacking'
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}