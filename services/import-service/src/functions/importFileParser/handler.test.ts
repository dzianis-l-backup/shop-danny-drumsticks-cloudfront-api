import * as AWSMock from "aws-sdk"
import { importFileParser } from "./handler"

describe("λ importFileParser", () => {
    const FILE_NAME = "myFile.csv"
    const SOURCE_OBJECT_KEY = `${process.env.BUCKET_CSV_SOURCE}/${FILE_NAME}`
    const RECORD = {
        s3: {
            object: {
                key: SOURCE_OBJECT_KEY,
            },
        },
    }
    const RECORDS = [RECORD]
    const S3Mock = new AWSMock.S3()

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should get object", async () => {
        await importFileParser({
            Records: RECORDS,
        })

        // @ts-ignore
        expect(S3Mock.getObject).toHaveBeenCalledWith({
            Bucket: process.env.BUCKET_CSV,
            Key: RECORD.s3.object.key,
        })
    })

    it("should copy object", async () => {
        await importFileParser({
            Records: RECORDS,
        })

        // @ts-ignore
        expect(S3Mock.copyObject).toHaveBeenCalledWith({
            Bucket: process.env.BUCKET_CSV,
            CopySource: `${process.env.BUCKET_CSV}/${RECORD.s3.object.key}`,
            Key: `${process.env.BUCKET_CSV_DIST}/${FILE_NAME}`,
        })
    })

    it("should delete object", async () => {
        await importFileParser({
            Records: RECORDS,
        })

        // @ts-ignore
        expect(S3Mock.deleteObject).toHaveBeenCalledWith({
            Bucket: process.env.BUCKET_CSV,
            Key: RECORD.s3.object.key,
        })
    })
})
