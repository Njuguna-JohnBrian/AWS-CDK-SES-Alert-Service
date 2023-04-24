import { APIGatewayProxyResultV2, SQSEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { SES_EMAIL_FROM, SES_EMAIL_TO, SES_REGION } from "../../env";
import { mailerTemplate } from "./mailer.html";

if (!SES_EMAIL_TO || !SES_EMAIL_FROM || !SES_REGION) {
  throw new Error(
    "Please add the SES_EMAIL_TO, SES_EMAIL_FROM and SES_REGION environment variables in an env.js file located in the root directory"
  );
}

export type ContactDetails = {
  email: string;
};

export async function main(event: SQSEvent): Promise<APIGatewayProxyResultV2> {
  try {
    console.log("email payload", event);

    let messages = event.Records.map((record) => {
      const body = JSON.parse(record.body) as {
        Message: string;
      };

      return { email: body.Message };
    });

    JSON.stringify(messages, null, 2);

    const { email } = messages[0] as ContactDetails;

    console.log(email);

    if (!email) throw new Error("Email is required.");

    return await sendEmail({ email });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return JSON.stringify({
        body: { error: error.message },
        statusCode: 400,
      });
    }
    return JSON.stringify({
      body: { error: JSON.stringify(error) },
      statusCode: 400,
    });
  }
}

async function sendEmail({
  email,
}: ContactDetails): Promise<APIGatewayProxyResultV2> {
  const ses = new AWS.SES({ region: SES_REGION });
  await ses.sendEmail(sendEmailParams({ email })).promise();

  return JSON.stringify({
    body: { message: "Email sent successfully" },
    statusCode: 200,
  });
}

function sendEmailParams({ email }: ContactDetails) {
  return {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent({ email }),
        },
        Text: {
          Charset: "UTF-8",
          Data: getTextContent({ email }),
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

function getHtmlContent({ email }: ContactDetails) {
  return mailerTemplate();
}

function getTextContent({ email }: ContactDetails) {
  return mailerTemplate();
}
