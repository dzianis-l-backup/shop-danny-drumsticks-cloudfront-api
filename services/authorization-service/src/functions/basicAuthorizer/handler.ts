enum HttpStatuses {
    Unauthorized = 401,
    Forbidden = 403,
    Ok = 200,
}

enum Effect {
    Allow = "Allow",
    Deny = "Deny",
}

const validateCredentials = (username: string, password: string) => {
    return (
        username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
    )
}

const getPolicy = (
    principalId: string,
    effect: Effect,
    resource: string,
    statusCode,
    message
) => {
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",

            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: [resource],
                },
            ],
        },
        context: {
            statusCode,
            message,
        },
    }
}

const processToken = (authorizationHeader: string) => {
    const responseUnauthorized = {
        Effect: Effect.Deny,
        statusCode: HttpStatuses.Unauthorized,
        message: "Unauthorized 😢",
        token: authorizationHeader,
    }

    const responseAuthorized = {
        Effect: Effect.Allow,
        statusCode: HttpStatuses.Ok,
        message: "Ok",
    }

    if (!authorizationHeader) {
        return responseUnauthorized
    }

    const [, token] = authorizationHeader.split("Basic ")

    if (!token) {
        return responseUnauthorized
    }

    const [username, password] = Buffer.from(token, "base64")
        .toString()
        .split(":")

    if (!username || !password) {
        return { ...responseUnauthorized, token }
    }

    if (!validateCredentials(username, password)) {
        return { ...responseUnauthorized, token: username }
    }

    return { ...responseAuthorized, token: username }
}

export const basicAuthorizer = async (event) => {
    debugger
    console.log("BASIC_AUTHORIZER EVENT", event)
    const authorizationHeader = event.authorizationToken
    console.log("authorizationHeader", authorizationHeader)

    const { token, Effect, statusCode, message } =
        processToken(authorizationHeader)

    const policy = getPolicy(
        token,
        Effect,
        event.methodArn,
        statusCode,
        message
    )

    console.log("policy", policy)

    return policy
}
