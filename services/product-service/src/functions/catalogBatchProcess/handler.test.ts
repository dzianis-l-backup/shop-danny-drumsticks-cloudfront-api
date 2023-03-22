// import { SQSRecord, Context } from "aws-lambda"
// import { catalogBatchProcess } from "./handler"

// import { HttpStatuses } from "src/types"

// jest.mock()

// describe("product-service", () => {
//     describe("catalogBatchProcess", () => {
//         let topicArn: string

//         beforeAll(() => {
//             topicArn = process.env.SNS_TOPIC_CREATE_BATCH_PROCESS_ARN

//             process.env.SNS_TOPIC_CREATE_BATCH_PROCESS_ARN =
//                 "arn:aws:sns:eu-west-1:test:shop-danny-products-sns"
//         })

//         beforeEach(() => {
//             snsMock.on(PublishCommand).resolves({ MessageId: "chiky pooky" })
//             dynamoMock.on(TransactWriteCommand).resolves({})
//         })

//         afterEach(() => {
//             dynamoMock.reset()
//             snsMock.reset()
//         })

//         afterAll(() => {
//             process.env.SNS_TOPIC_CREATE_BATCH_PROCESS_ARN = topicArn
//         })

//         it("should process batch requests", async () => {
//             const result = await catalogBatchProcess(
//                 {
//                     Records: [
//                         {
//                             body: '{"title":"vicfirth5a","description":"Vic Firth 5A American Classic Hickory","price":1,"count":1}',
//                         } as SQSRecord,
//                         {
//                             body: '{"title":"promark5b","description":"The 5B is a standard diameter drumstick for the heavy hitter","price":1,"count":1}',
//                         } as SQSRecord,
//                     ],
//                 },
//                 {} as Context
//             )

//             expect(result).toEqual({
//                 statusCode: HttpStatuses.CREATED,
//             })
//         })
//     })
// })
