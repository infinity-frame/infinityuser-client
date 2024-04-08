# InfinityUser client

This package provides utility functions for authentication using refresh tokens and JWT (JSON Web Tokens). It supports basic authentication functionalities such as registering users, logging in, logging out, changing email, and refreshing tokens.

## Installation

You can install this package using npm:

```bash
npm install auth-utility-package
```

## Usage

Import the required functions from the package:

```javascript
import {
  authFetch,
  initAuth,
  register,
  trySignInWithRefreshToken,
  logout,
  changeEmail,
  login,
} from "auth-utility-package";
```

## Functions

### `initAuth({ authApiPath })`

Initializes the authentication utility with the API path for authentication.

- **Parameters**:
  - `authApiPath` (string): The base URL path for the authentication API.
- **Returns**:
  - An authentication object containing necessary properties for subsequent operations.

#### Example

```javascript
const auth = initAuth({ authApiPath: "https://your-auth-api.com" });
```

### `register(auth, email, password)`

Registers a new user with the provided email and password.

- **Parameters**:
  - `auth` (object): The authentication object initialized with `initAuth()`.
  - `email` (string): The email of the user to be registered.
  - `password` (string): The password for the new user.
- **Returns**:
  - A user object upon successful registration.

#### Example

```javascript
const newUser = await register(auth, "user@example.com", "password123");
```

### `login(auth, email, password)`

Logs in a user with the provided email and password.

- **Parameters**:
  - `auth` (object): The authentication object initialized with `initAuth()`.
  - `email` (string): The email of the user to log in.
  - `password` (string): The password for the user.
- **Returns**:
  - A user object upon successful login.

#### Example

```javascript
const user = await login(auth, "user@example.com", "password123");
```

### `logout(auth)`

Logs out the currently authenticated user.

- **Parameters**:
  - `auth` (object): The authentication object initialized with `initAuth()`.
- **Returns**:
  - No return value.

#### Example

```javascript
await logout(auth);
```

### `changeEmail(auth, email, password)`

Changes the email address of the currently authenticated user.

- **Parameters**:
  - `auth` (object): The authentication object initialized with `initAuth()`.
  - `email` (string): The new email address.
  - `password` (string): The user's current password.
- **Returns**:
  - The updated user object.

#### Example

```javascript
const updatedUser = await changeEmail(auth, "new@example.com", "oldpassword");
```

### `authFetch(auth, path, data)`

A helper function for authenticated API requests. Automatically handles token refreshing if necessary.

- **Parameters**:
  - `auth` (object): The authentication object initialized with `initAuth()`.
  - `path` (string): The API endpoint URL.
  - `data` (object): Optional data object containing request parameters such as method, headers, and body.
- **Returns**:
  - The fetch response object.

#### Example

```javascript
const response = await authFetch(auth, "/api/data", {
  method: "GET",
});
const responseData = await response.json();
```

### `trySignInWithRefreshToken(auth)`

Attempts to sign in using a refresh token if available.

- **Parameters**:
  - `auth` (object): The authentication object initialized with `initAuth()`.
- **Returns**:
  - The user object upon successful sign-in using the refresh token, or `null` if no refresh token is available or user is already signed in.

#### Example

```javascript
const user = await trySignInWithRefreshToken(auth);
```

## Notes

- Make sure to handle errors appropriately using try-catch blocks around these functions to catch any thrown errors.
- Each function requires an initialized `auth` object created using `initAuth()` to operate correctly.
- Ensure to configure and handle authentication API endpoints properly based on your backend implementation.

This package simplifies the process of authentication in your application by encapsulating common authentication operations.
