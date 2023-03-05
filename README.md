# shop-danny-drumsticks-cloudfront-api

This is a monorepo for AWS API provisioning for the Danny drumsticks store

# Task 3

The `procuct-service`'s been created through the `aws-nodejs-typescript` template in the services monorepo.

## Links

-   [Cloudfront FE side](https://d2d25cyeqtftsg.cloudfront.net/)
-   [/products](https://xun888d5wf.execute-api.eu-west-1.amazonaws.com/dev/products)
-   [/products/{id}](https://xun888d5wf.execute-api.eu-west-1.amazonaws.com/dev/products/m6Gkc19AVw)
-   [swagger](https://eqkv6cw9rf.execute-api.eu-west-1.amazonaws.com/swagger.json)
-   [swagger-ui](https://eqkv6cw9rf.execute-api.eu-west-1.amazonaws.com/swagger)

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
