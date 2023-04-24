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
        TopicArn: cdk.Fn.importValue("alertTopicArn"),
        Message: JSON.stringify(payload, null, 2),
      })
      .promise();
    return;
  } catch (error) {
    throw new Error(
      `Failed to publish message to Alert Topic. Throwing Error...`
    );
  }
}
