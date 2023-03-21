import { HttpStatuses } from "@const/index"
import { logger } from "@libs/logger"
import AWS from "aws-sdk"
import csv from "csv-parser"

export const importFileParser = async (event) => {
    const s3 = new AWS.S3({ region: process.env.REGION })
    const sqs = new AWS.SQS({ region: process.env.REGION })

    try {
        for (const record of event.Records) {
            await new Promise(async (resolveCopy) => {
                return new Promise((resolveSqs) => {
                    s3.getObject({
                        Bucket: process.env.BUCKET_CSV,
                        Key: record.s3.object.key,
                    })
                        .createReadStream()
                        .pipe(csv())
                        .on("data", async (data) => {
                            logger.log(data)
                            debugger

                            sqs.getQueueUrl(
                                {
                                    QueueName: process.env.SQS_QUEUE_NAME,
                                },
                                (error, { QueueUrl }) => {
                                    if (error) {
                                        logger.error(error)
                                    }
                                    logger.log("QueueUrl", QueueUrl)

                                    sqs.sendMessage(
                                        {
                                            QueueUrl: QueueUrl,
                                            MessageBody: JSON.stringify(data),
                                        },
                                        (err, data) => {
                                            if (err) {
                                                console.log(err)
                                            }
                                            logger.log(
                                                "after: sqs.sendMessage",
                                                data
                                            )

                                            resolveSqs()
                                        }
                                    )
                                }
                            )
                        })
                        .on("end", async () => {
                            const source = `${process.env.BUCKET_CSV}/${record.s3.object.key}`
                            const distKey = record.s3.object.key.replace(
                                process.env.BUCKET_CSV_SOURCE,
                                process.env.BUCKET_CSV_DIST
                            )

                            logger.log(`Copy Source ${source}`)
                            logger.log(
                                `Destination Source ${process.env.BUCKET_CSV}/${distKey}`
                            )

                            await s3
                                .copyObject({
                                    Bucket: process.env.BUCKET_CSV,
                                    CopySource: source,
                                    Key: distKey,
                                })
                                .promise()

                            logger.log(
                                `Copied from ${source} to ${process.env.BUCKET_CSV}/${distKey}`
                            )

                            await s3
                                .deleteObject({
                                    Bucket: process.env.BUCKET_CSV,
                                    Key: record.s3.object.key,
                                })
                                .promise()

                            logger.log(`Deleted from ${source}`)

                            resolveCopy({
                                statusCode: HttpStatuses.Ok,
                            })
                        })
                        .on("error", (error) => {
                            logger.error(error)

                            resolveCopy({
                                statusCode: HttpStatuses.InternalServerError,
                            })
                        })
                })
            })
        }
    } catch (error) {
        logger.error(error)
    }
}
