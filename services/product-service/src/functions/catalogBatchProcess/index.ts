import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
    events: [
        {
            sqs: {
                batchSize: 5,
                arn: {
                    "Fn::GetAtt": ["SQSQueue", "Arn"],
                },
            },
        },
    ],
}
