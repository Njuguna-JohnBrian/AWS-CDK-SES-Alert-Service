import * as AWS from "aws-sdk";
import * as cdk from "aws-cdk-lib";
export async function sendEmail(): Promise<void> {
  const notification: AWS.SNS = new AWS.SNS({
    region: "us-east-1",
  });
  try {
    const payload = { target: "project", email: "njugunajb96@gmail.com" };
    await notification
      .publish({
        TopicArn: "arn:aws:sns:us-east-1:329314673490:alertTopic",
        Message: JSON.stringify(payload, null, 2),
      })
      .promise();
    return;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Failed to publish message to Alert Topic. Throwing Error...`
    );
  }
}
