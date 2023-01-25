import * as dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;
import nodemailer from "nodemailer";
("use strict");

export async function confirmEmail(email, name) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);

  const token = sign({ email: email, verify: true }, process.env.SECRETSAUCE, {
    expiresIn: "96h",
  });

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "hrbvekkcnvjyuzkp@ethereal.email",
      //user: testAccount.user, // generated ethereal user
      pass: "8hs5BawKmjbB4TGHAG",
      //pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Meal Planner" <no-reply@meal-planner.com>', // sender address
    to: `${email}`, // list of receivers
    subject: `Welcome to Meal Planner`, // Subject line
    text: `Hey ${name}, please verify your account. At www.meal-planner.com/verify/${token}`, // plain text body
    html: `<b>Hey ${name}, please verify your account. At www.meal-planner.com/verify/${token}</b>`, // html body
  });

  console.log(token);
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
