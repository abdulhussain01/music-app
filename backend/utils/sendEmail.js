import { MailtrapClient } from "mailtrap";

export const sendEmail = async (email, resetPasswordToken) => {
  const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
  });

  const sender = {
    email: process.env.SENDEREMAIL,
    name: "Musiko",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: process.env.TEMPLATE_UUID,
    template_variables: {
      companyName: "Musiko",
      user_email: email,
      pass_reset_link: `${process.env.MUSICAPP_URL}/resetpassword/${resetPasswordToken}`,
    },
  });


};
