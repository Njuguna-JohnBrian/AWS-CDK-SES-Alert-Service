import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as path from "path";

import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class AlertServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const alertTopic = new sns.Topic(this, "alertTopic", {
      topicName: "alertTopic",
    });

    const alertQueue = new sqs.Queue(this, "alertQueue", {
      queueName: "alertQueue",
      visibilityTimeout: Duration.seconds(300),
    });

    const alertLambda = new NodejsFunction(this, "alertLambda", {
      description: "alertLambda",
      functionName: "alertLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "main",
      memorySize: 1024,
      timeout: Duration.seconds(300),
      entry: path.join(__dirname, "/../src/mailer/index.ts"),
    });

    const alertPublisherLambda = new NodejsFunction(
      this,
      "alertPublisherLambda",
      {
        description: "alertPublisherLambda",
        functionName: "alertPublisherLambda",
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "sendEmail",
        memorySize: 1024,
        timeout: Duration.seconds(300),
        entry: path.join(__dirname, "/../src/mailer/publisher.ts"),
      }
    );

    alertPublisherLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["sns:publish"],
        resources: ["*"],
      })
    );

    alertLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:SendTemplatedEmail",
        ],
        resources: ["*"],
      })
    );

    alertTopic.addSubscription(new subscriptions.SqsSubscription(alertQueue));

    alertLambda.addEventSource(
      new SqsEventSource(alertQueue, { batchSize: 10 })
    );

    new cdk.CfnOutput(alertTopic, "alertTopicArn", {
      value: alertTopic.topicArn,
      exportName: "alertTopicArn",
    });
  }
}
