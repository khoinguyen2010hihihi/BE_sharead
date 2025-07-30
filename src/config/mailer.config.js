import mailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.error("Mailer configuration error:", error)
  } else {
    console.log("Mailer is ready to send emails")
  }
})

export default transporter