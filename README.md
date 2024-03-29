# shop-danny-drumsticks-cloudfront-api

This is a monorepo for AWS API provisioning for the Danny drumsticks store

# Links

-   [Cloudfront FE side](https://d2d25cyeqtftsg.cloudfront.net/)
-   [/products GET](https://xun888d5wf.execute-api.eu-west-1.amazonaws.com/dev/products)
-   [/products POST](https://xun888d5wf.execute-api.eu-west-1.amazonaws.com/dev/products)
-   [/products/{id} GET](https://xun888d5wf.execute-api.eu-west-1.amazonaws.com/dev/products/m6Gkc19AVw)
-   [swagger](https://eqkv6cw9rf.execute-api.eu-west-1.amazonaws.com/swagger.json)
-   [swagger-ui](https://eqkv6cw9rf.execute-api.eu-west-1.amazonaws.com/swagger)
-   [/import](https://iglqomrbgj.execute-api.eu-west-1.amazonaws.com/dev/import?name=filename)

# Task 7

## Task 7.1

-   `authorization-service` creation
-   `λ basicAuthorizer`
-   specify .env authentication parameters
-   Basic auth flow
-   401 - for header absence, 403 - for improper authentication details

## Task 7.2

-   `/import` updated with Gateway authorizer
-   `basicAuthorizer` is used as an authorizer

## Taks 7.3

-   FE application sends the authorization token
-   the token is taken from the local storage

## Task 7.4

PR

## Additional tasks

-   +30 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - statuses 401 and 403 for the FE part

# Task 6

## Task 6.1

-   `λ catalogBatchProcess` batching new products records
-   SQS queue created
-   `batchSize: 5`
-   lambda iteration over SQS records

## Task 6.2

-   `λ importFileParser` lambda to post messages to SQS
-   no Readable stream

## Task 6.3

-   SNS Topic creation
-   subsctiption to the topic with an email receiver
-   updated `λ catalogBatchProcess` to push messages

## Task 6.4

PR

## Additional tasks

-   +15 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - catalogBatchProcess lambda is covered by unit tests
-   +15 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - set a Filter Policy for SNS createProductTopic in serverless.yml and create an additional email subscription to distribute messages to different emails depending on the filter for any product attribute

# Task 5

## Task 5.1

1. `import-service` created
2. new S3 bucket with the `/uploaded` folder created

## Task 5.2

1. `λ importProductsFile` created
2. `/imoprt` url
3. signed url generation
4. name of the file in query parameters
5. serverless configured
6. response as a signed url
7. FE integration

## Task 5.3

1. `λ importFileParser`
2. s3 event `s3:ObjectCreated:*` configured
3. event restrictions for only `uploaded` folder
4. `csv-parser` reading readable stream

## Task 5.4

PR

## Additional (optional) tasks

-   +10 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - async/await is used in lambda functions
-   +10 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - importProductsFile lambda is covered by unit tests. (for JS only) aws-sdk-mock can be used to mock S3 methods
-   +10 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder (move the file means that file should be copied into a new folder in the same bucket called parsed, and then deleted from uploaded folder)

# Task 4

## Task 4.1

1. `Products` and `Stocks` DynamoDb tables've been created
2. The [fill script](./services/product-service/src/db/dynamodb-fill.mjs) for data generation from mocks

## Task 4.2

1. serverless.ts is extended with iam role creation for dynamodb access and with environment variables storing the region, products and stocks tables
2. `λ getProductsList` returns joined response from Stocks and Products tables
3. `λ getProductsById` returns joined respoins from a product and the respective stock
4. `λ getProductsById` integrated with `/products/{id}`

## Task 4.3

1. `λ  createProduct` created
2. `/products` POST endpoint
3. business-logic created to post a new product and the according stock
4. the URL added to the links section [/products POST](https://xun888d5wf.execute-api.eu-west-1.amazonaws.com/dev/products)

## Task 4.4

PR

## Additional (optional) tasks

-   +6 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - POST /products lambda functions returns error 400 status code if product data is invalid
-   +6 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)
-   +6 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - All lambdas do console.log for each incoming requests and their arguments
-   +6 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - Use RDS instance instead fo DynamoDB tables. Do not commit your environment variables in serverless.yml to github!
-   +6 ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - Transaction based creation of product (in case stock creation is failed then related to this stock product is not created and not ready to be used by the end user and vice versa)

# Task 3

The `procuct-service`'s been created through the `aws-nodejs-typescript` template in the services monorepo.

## Task 3.1 getProductsList λ

1. `getProductsList` lambda function created.
2. request url - `/products`, method - `GET `
3. returns full array of mocked yet products which are drumsticks.
4. the endpoint is integrated into the FE application of the drumsticks store on the [products list page](https://d2d25cyeqtftsg.cloudfront.net/).

## Task 3.2 getProductsById λ

1. `getProductsById` lambda function created.
2. request url - `/products/{id}`, method - `GET`, search by product id
3. the search is conducted through the list of products returned from the array of products
4. the endpoint is not integrated into the FE app

## Task 3

1. task_3 branch created
2. pull request created
3. request submitted

## Optional

-   +5 - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` Async/await is used in lambda functions
-   +5 - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` Async/await is used in lambda functions ES6 modules are used for Product Service implementation
-   +4 - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` Custom Webpack/ESBuild/etc is manually configured for Product Service. Not applicable for preconfigured/built-in bundlers that come with templates, plugins, etc.
-   +4 (All languages) - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - SWAGGER documentation is created for Product Service
-   +4 (All languages) - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done`- Lambda handlers are covered by basic UNIT tests (NO infrastructure logic is needed to be covered)
-   +4 (All languages) - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
-   +4 (All languages) - ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png) `done` - Main error scenarios are handled by API ("Product not found" error).
