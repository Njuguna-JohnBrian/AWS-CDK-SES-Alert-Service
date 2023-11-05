# AWS CDK Alert Service

This AWS CDK (Cloud Development Kit) code creates an alert service that utilizes AWS Simple Email Service (SES) to send email alerts. The service is built using AWS Lambda, Amazon SNS (Simple Notification Service), and Amazon SQS (Simple Queue Service).

## Prerequisites

Before deploying this CDK stack, make sure you have the following prerequisites set up:

1. AWS CDK and AWS CLI installed and configured.
2. Node.js and npm installed.

## Installation

1. Clone the repository containing the CDK code to your local machine:

   ```bash
   git clone https://github.com/Njuguna-JohnBrian/SES-ALERT
   ```

2. Update env.ts to reflect your ```FROM``` and ```TO``` email targets
```ts
export const SES_REGION = "us-east-1";
export const SES_EMAIL_TO = "";
export const SES_EMAIL_FROM = "";
```
2. Install the required dependencies:

   ```bash
   npm install
   ```

## Deployment

To deploy the AWS CDK stack, run the following command:

```bash
cdk deploy
```

## Configuration

In the CDK code (`AlertServiceStack`), you can modify the configuration as needed:

- `alertTopic`: The SNS topic used for publishing alerts.
- `alertQueue`: The SQS queue used to consume and process alerts.
- `alertLambda`: The Lambda function responsible for sending email alerts.
- `alertPublisherLambda`: The Lambda function used to publish alerts to the SNS topic.
- IAM policies are attached to Lambda functions to grant necessary permissions.
- Batch size for processing alerts from the SQS queue can be adjusted.

## Usage

Once the CDK stack is deployed, you can start using the alert service. You can publish alerts to the SNS topic, and the Lambda functions will process and send email alerts.

## Cleanup

To remove the CDK stack and associated AWS resources, run the following command:

```bash
cdk destroy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.