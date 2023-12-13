# Endpoint Documentation

## Endpoint: `/api/combatant-definition`

- **Method:** GET

### Description

This endpoint retrieves a list of combatant definitions. Each combatant is a character with specific attributes related to a role-playing game context, such as class, level, hit points (hp), armor class (ac), difficulty class (dc), saving throws, skills, and abilities.

### Response Format

The response is a JSON array where each element represents a combatant with the following structure:

- **name** (string): The name of the combatant.
- **class** (string): The class of the combatant (e.g., Monster, Rogue, Druid).
- **subclass** (string): The subclass of the combatant (e.g., Beast, Assassin, Humanoid).
- **level** (int): The level of the combatant.
- **hp** (int): The maximum hit points of the combatant.
- **ac** (int): The armor class of the combatant.
- **dc** (int): The difficulty class for the combatant's abilities.
- **saving_throws** (object): An object containing saving throw modifiers for different attributes (STR, DEX, CON, WIS, INT, CHA).
- **skills** (object): An object containing skill modifiers for different skills (athletics, acrobatics, stealth).
- **abilities** (array of strings): A list of abilities the combatant possesses.

### Sample Response

```json
[
    {
        "name": "Saber-Toothed Tiger",
        "class": "Monster",
        "subclass": "Beast",
        "level": 1,
        "hp": 52,
        "ac": 12,
        "dc": 0,
        "saving_throws": {
            "CHA": -1,
            "CON": 2,
            "DEX": 2,
            "INT": -4,
            "STR": 4,
            "WIS": 1
        },
        "skills": {
            "acrobatics": 2,
            "athletics": 4,
            "stealth": 0
        },
        "abilities": ["Bite", "Claws", "PounceClaws", "Pounce"]
    },
    // ... more combatants ...
]
```

## Endpoint: `/api/user_data`

- **Method:** GET

### Description

This endpoint provides data for the authenticated user. It retrieves user-specific information based on the user's email address.

### Authentication

- The endpoint requires user authentication. The user's data is accessed based on the authenticated user's email.

### Response Format

If the user is authenticated, the response is a JSON object containing the following fields:

- **creation_date** (string): The date and time when the user account was created.
- **credits** (string): The number of credits associated with the user's account.
- **email** (string): The email address of the user.
- **subscription_tier** (string): The subscription tier of the user.
- **user_id** (string): The unique identifier for the user.

If the user is not authenticated, the response will contain `null` values for `email` and `credits`.

### Sample Response

#### Authenticated User
```json
{
    "creation_date": "2023-01-01 12:00:00.000000",
    "credits": "100",
    "email": "user@example.com",
    "subscription_tier": "1",
    "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### Unauthenticated User

```json
{
    "email": null,
    "credits": null
}
```

## Endpoint: `/api/register`

- **Method:** POST

### Description

This endpoint is used to register a new user. It requires an email address and a password.

### Request Format

The request should be a JSON object containing the following fields:

- **email** (string): The email address of the user.
- **password** (string): The password for the new account.

### Response Format

The response format varies based on the result of the registration process:

- **Success**: If registration is successful, the response will be a JSON object with a status message.
- **Errors**: If there is an error, the response will contain a status and error message.

### Sample Request

```json
{
    "email": "newuser@example.com",
    "password": "SecurePassword123!"
}
```
Sample Responses
Success

```json
{
    "status": "success",
    "message": "User registered."
}
```

Missing Fields
```json
{
    "status": "error",
    "message": "All fields are required"
}
```

Username Exists
```json
{
    "status": "error",
    "message": "Email already exists"
}
```

Password Validation Failure
```json
{
    "status": "error",
    "message": "Password doesn't contain all required character types"
}
```

Other Errors
```json
{
    "status": "error",
    "message": "Error description"
}
```

Status Codes

    201 Created: Returned when a user is successfully registered.
    400 Bad Request: Returned when required fields are missing or the password validation fails.
    409 Conflict: Returned when the provided email already exists.
    500 Internal Server Error: Returned for any other unhandled exceptions.

Notes

    The password must meet the required complexity standards set by the system.

## Endpoint: `/api/login`

- **Method:** POST

### Description

This endpoint is used for user authentication. It verifies the user's email and password, and if successful, returns a set of JWT tokens for session management.

### Request Format

The request should be a JSON object containing the following fields:

- **email** (string): The email address of the user.
- **password** (string): The password of the user.

### Response Format

The response format varies based on the result of the login process:

- **Success**: If authentication is successful, the response will include JWT tokens.
- **Errors**: If there is an error, the response will contain a status and error message.

### Sample Request

```json
{
    "email": "user@example.com",
    "password": "UserPassword123"
}
```
Sample Responses
Success
```json
{
    "status": "success",
    "data": {
        "AccessToken": "access_token_string",
        "ExpiresIn": 3600,
        "RefreshToken": "refresh_token_string",
        // Other token data...
    }
}
```

Invalid Credentials
```json
{
    "status": "error",
    "message": "Invalid email or password!"
}
```

User Not Found
```json
{
    "status": "error",
    "message": "Unknown email address or email not yet verified!"
}
```

Other Errors
```json
{
    "status": "error",
    "message": "Error description"
}
```

Status Codes

    200 OK: Returned when a user is successfully authenticated.
    401 Unauthorized: Returned when the provided email or password is incorrect.
    404 Not Found: Returned when the provided email does not exist or is not verified.
    500 Internal Server Error: Returned for any other unhandled exceptions.

Notes

    The response includes JWT tokens such as Access Token, Refresh Token, and other relevant authentication details.
    These tokens are required for maintaining the user's session and accessing protected resources.

## Endpoint: `/api/forgot-password`

- **Method:** POST

### Description

This endpoint facilitates the process of resetting a user's password. It is designed to handle requests for password resets by sending a link to the user's email if it is registered in the system.

### Request Format

The request should be a JSON object containing the following field:

- **email** (string): The email address of the user who has forgotten their password.

### Response Format

The response will inform whether the request was processed successfully. For security reasons, the same response is returned whether the email is registered in the system or not.

### Sample Request

```json
{
    "email": "user@example.com"
}
```

Sample Responses
Request Processed
```json
{
    "status": "success",
    "message": "If the email address is correct, a password reset link will be sent."
}
```

Missing Email
```json
{
    "status": "error",
    "message": "Email is required"
}
```

Other Errors
```json
{
    "status": "error",
    "message": "An unexpected error occurred"
}
```

Status Codes

    200 OK: Returned when the request for password reset is successfully processed.
    400 Bad Request: Returned when the email field is missing in the request.
    500 Internal Server Error: Returned for any other unhandled exceptions.

Notes

    The endpoint's response is intentionally the same for both existing and non-existing email addresses to prevent email enumeration attacks.
    In the case of a valid email, the system will send a password reset link to that email address.
    The actual password reset process is handled through a separate flow initiated by the user following the link received in their email.

## Endpoint: `/api/reset-password`

- **Method:** POST

### Description

This endpoint is used for resetting a user's password. It requires the user's email, a new password, and a verification code (typically received via email after initiating a password reset request).

### Request Format

The request should be a JSON object containing the following fields:

- **email** (string): The email address of the user.
- **newPassword** (string): The new password for the user.
- **verificationCode** (string): The verification code received by the user to confirm the password reset.

### Response Format

The response will indicate whether the password reset was successful or if there were any errors during the process.

### Sample Request

```json
{
    "email": "user@example.com",
    "newPassword": "NewSecurePassword123!",
    "verificationCode": "123456"
}
```

Sample Responses
Password Reset Successful
```json
{
    "status": "success",
    "message": "Password has been reset successfully."
}
```

Missing Required Fields
```json
{
    "status": "error",
    "message": "Email, new password, and verification code are required"
}
```

Invalid Verification Code
```json
{
    "status": "error",
    "message": "Invalid verification code!"
}
```

Other Errors
```json
{
    "status": "error",
    "message": "An unexpected error occurred"
}
```

Status Codes

    200 OK: Returned when the password reset is successful.
    400 Bad Request: Returned when required fields are missing or if the verification code is invalid.
    500 Internal Server Error: Returned for any other unhandled exceptions.

Notes

    It is essential that all three fields - email, new password, and verification code - are provided for a successful password reset.
    The process is secure and follows standard procedures for password resets, including the use of verification codes.
    Users should receive their verification code via email after requesting a password reset through the /api/forgot-password endpoint.

## Endpoint: `/api/logout`

- **Method:** GET

### Description

This endpoint handles user logout. It clears the user's session data, effectively logging them out of the system.

### Authentication

- This endpoint requires the user to be authenticated.

### Response Format

The response indicates the successful logout of the user.

### Sample Responses

#### Successful Logout
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```
Status Codes

    200 OK: Returned when the user is logged out successfully.

Notes

    Upon calling this endpoint, the server will clear the session data associated with the user. This includes removing tokens and other authentication-related information stored in the session.
    The endpoint does not require any request body or query parameters.
    It is important to call this endpoint to ensure that the user session is properly terminated, especially in applications where security is a concern.

## Endpoint: `/api/get-simulation-result/<string:job_id>`

- **Method:** GET

### Description

This endpoint retrieves the result of a simulation job based on a provided job ID.

### Authentication

- This endpoint requires user authentication.

### Path Parameters

- **job_id** (string): The unique identifier for the simulation job whose result is being requested.

### Response Format

The response format varies based on the simulation job's status and outcome:

- **Success**: If the simulation is finished successfully, returns the simulation results.
- **In Progress**: Indicates that the simulation is still in progress.
- **Failed**: Indicates that the simulation has failed.
- **Error**: Returned in case of invalid requests or other errors.

### Sample Responses

#### Simulation Finished Successfully
```json
{
    "message": "Simulation finished",
    "log_link": "https://example.com/results.zip",
    "BLUE": {
        "AT_LEAST_ONE_DIED": 10,
        "AT_LEAST_THREE_DIED": 10,
        "AT_LEAST_TWO_DIED": 10,
        "VICTORIES": 0
    },
    "RED": {
        "AT_LEAST_ONE_DIED": 0,
        "AT_LEAST_THREE_DIED": 0,
        "AT_LEAST_TWO_DIED": 0,
        "VICTORIES": 10
    }
}
```

Simulation In Progress
```json
{
    "message": "Simulation in progress"
}
```

Simulation Failed
```json
{
    "message": "Simulation failed"
}
```

Invalid Request
```json
{
    "message": "Invalid request: job_id not provided"
}
```

Backend Request Failed
```json
{
    "error": "Backend request failed"
}
```

Status Codes

    200 OK: Returned when the simulation result is retrieved successfully.
    202 Accepted: Returned if the simulation is still in progress.
    400 Bad Request: Returned if the job ID is not provided in the request.
    404 Not Found: Returned if the job ID is not found in the system.
    500 Internal Server Error: Returned in case of unknown errors or simulation failure.

Notes

    The endpoint calls a backend service to obtain the result. The backend service performs the actual retrieval and processing of simulation data.
    The response includes detailed statistics of the simulation and a link to download the full results if available.
    This endpoint should be called after initiating a simulation job to periodically check for completion and fetch results.

## Endpoint: `/api/get-simulation-history`

- **Method:** GET

### Description

This endpoint retrieves the simulation history of an authenticated user. It provides a list of past simulations run by the user, along with detailed statistics and outcomes.

### Authentication

- This endpoint requires user authentication.

### Response Format

The response is an array of objects where each object represents a past simulation with details including combatants, number of iterations, simulation date, and statistical outcomes.

### Sample Response

```json
[
    {
        "blue": ["Vampire Spawn"],
        "iterations": "50",
        "red": ["Draconic Sorcerer 5Lvl", "Totem Barbarian 5Lvl"],
        "simulation_date": "2023-12-10 15:23:32.290100",
        "stats": "{\"BLUE\": {\"VICTORIES\": 16, \"AT_LEAST_ONE_DIED\": 24, \"AT_LEAST_TWO_DIED\": 0, \"AT_LEAST_THREE_DIED\": 0}, \"RED\": {\"VICTORIES\": 24, \"AT_LEAST_ONE_DIED\": 17, \"AT_LEAST_TWO_DIED\": 16, \"AT_LEAST_THREE_DIED\": 0}}"
    },
    // ... more simulations ...
]
```
Status Codes

    200 OK: Returned when the simulation history is retrieved successfully.
    400 Bad Request: Returned if the user is not logged in or other invalid request scenarios.

Notes

    The response includes a detailed breakdown of each simulation, including the participants (denoted by "blue" and "red" teams), the number of iterations run, the date and time of the simulation, and a statistics string containing numerical outcomes of the simulation.
    The statistics string is a JSON object in string format, containing keys like "VICTORIES", "AT_LEAST_ONE_DIED", etc., for both "BLUE" and "RED" teams.
    This endpoint is intended for users to review their previous simulation activities.