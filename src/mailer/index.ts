import { APIGatewayProxyResultV2, SQSEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { SES_EMAIL_FROM, SES_EMAIL_TO, SES_REGION } from "../../env";
import { mailerTemplate } from "./mailer.html";

if (!SES_EMAIL_TO || !SES_EMAIL_FROM || !SES_REGION) {
  throw new Error(
    "Please add the SES_EMAIL_TO, SES_EMAIL_FROM and SES_REGION environment variables in an env.js file located in the root directory"
  );
}

interface IEmail {
  email: string;
  target: string;
}

export async function main(event: SQSEvent): Promise<APIGatewayProxyResultV2> {
  console.log(1);
  try {
    console.log("email payload", event);
    console.log(2);

    let payload = event.Records.map((record) => {
      const body = JSON.parse(record.body) as {
        Message: string;
      };

      return body.Message;
    });

    let emailBody: IEmail = JSON.parse(payload[0]);

    if (!emailBody) throw new Error("Email and target are required required.");

    return await sendEmail(emailBody.email);
  } catch (error: any) {
    console.log(7);

    console.log("7 error", error);

    return JSON.stringify({
      body: { error: JSON.stringify(error) },
      statusCode: 400,
    });
  }
}

async function sendEmail(email: string): Promise<APIGatewayProxyResultV2> {
  try {
    const ses = new AWS.SES({ region: SES_REGION });
    await ses.sendEmail(sendEmailParams(email)).promise();

    console.log("email sent");

    return JSON.stringify({
      body: { message: "Email sent successfully" },
      statusCode: 200,
    });
  } catch (e) {
    console.log("email not sent", e);
    throw new Error("Email not sent");
  }
}

function sendEmailParams(email: string) {
  return {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent(email),
        },
        Text: {
          Charset: "UTF-8",
          Data: getTextContent(email),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Email from Procore App.`,
      },
    },
    Source: SES_EMAIL_FROM,
  };
}

function getHtmlContent(email: string) {
  return mailerTemplate();
}

function getTextContent(email: string) {
  return mailerTemplate();
}
