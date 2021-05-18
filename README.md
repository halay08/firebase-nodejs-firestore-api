# Firebase NodeJS Firestore API

A DDD application focused on separation of concerns and scalability.
Loosely coupling with clear dependency graphs provided by Inversion of Control.

![alt text](architecture.png 'Clean Architecture')

- [Firebase NodeJS Firestore API](#firebase-nodejs-firestore-api)
  - [Getting Started](#getting-started)
  - [Project architecture](#project-architecture)
  - [Setup Development Environment](#setup-development-environment)
    - [Set firebase project alias](#set-firebase-project-alias)
    - [Set environment configuration](#set-environment-configuration)
    - [Retrieve current environment configuration](#retrieve-current-environment-configuration)
    - [Start firestore for database (emulators)](#start-firestore-for-database-emulators)
    - [Start the dev server](#start-the-dev-server)
  - [API Documentation](#api-documentation)
    - [VS Code snippet](#vs-code-snippet)
  - [Using API](#using-api)
    - [Code Generator](#code-generator)
    - [Authorization](#authorization)
    - [Create an user](#create-an-user)
    - [List items](#list-items)
    - [List item by id](#list-item-by-id)
    - [Update User](#update-user)
    - [Delete User](#delete-user)
  - [Migration & Seeding](#migration--seeding)
  - [VS Code](#vs-code)
  - [Troubleshooting](#troubleshooting)

## Getting Started

...

## Project architecture

    .
    └── src
        ├── api # Layer that exposes application to external world (primary adapters)
        │   └── http # Exposes application over HTTP protocol
        ├── app # Layer that composes application use cases
        ├── domain # Business domain classes and everything that composes domain model
        ├── infra # Communication with what is external of application
        └── dist # Common functionalities

## Setup Development Environment

### Set firebase project alias

```sh
firebase use develop
```

_Note: You have install GPG Suit if it hasn't been installed on your PC yet. [Learn more](https://www.gnupg.org/download/)._

### Set environment configuration

```sh
yarn functions:set-env
```

### Retrieve current environment configuration

```sh
yarn functions:export-env
```

### Start firestore for database (emulators)

```sh
yarn firestore
```

### Start the dev server

Open another terminal to start the development server:

```sh
yarn dev
```

## API Documentation

Using [APIDoc](https://apidocjs.com/) as documentation for Restful APIs.

Running the following command to generate documentation:

```
yarn docs
```

### VS Code snippet

Install the following extenstion to generate APIDoc format

https://marketplace.visualstudio.com/items?itemName=myax.appidocsnippets

## Using API

### Code Generator

Running the following command and follow the instruction to generate a new API:

```sh
node generate.js
```

### Authorization

To set the custom claims for user, please use the sample code below:

```ts
@inject(TYPES.AuthService) private readonly _authService: AuthService;

// ...

// Firebase user uid = I4bwuWF6uRUe10wqil7DrxvSdvm2
// Role is admin | customer
this._authService.setCustomUserClaims('I4bwuWF6uRUe10wqil7DrxvSdvm2', {role: 'admin'});
```

Use authorization middleware decorator in controller:

```ts
@httpGet('/', authorize({ roles: ['admin']}))
public async getUsers(@response() res: Response): Promise<User[] | void> {
    try {
        const data = await this.userService.getUsers();
        // The AuthProvider decoded user token after logging.
        // You can see the decodedIdToken and user information below:
        // console.log('Decoded Id Token: ', this.httpContext.user.details);

        return data;
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
}
```

If you want to allow the action for some roles, please add more items in the roles array, see it below

`@httpGet('/', authorize({ roles: ['admin', 'customer']}))`

If the action is required two role for executing, please add two middleware decorators to `@httpGet` decorator:

`@httpGet('/', authorize({ roles: ['admin']}), authorize({ roles: ['customer']}))`

Note: We have some APIs that open to publish for all users. It means without authentication and authorization.

Manual check user authenticated in controller:

```
@httpGet('/')
public async fooAction() {
    const isAuthenticated: boolean = this.httpContext.user.isAuthenticated();
    // ...
}
```

### Create an user

```sh
curl -XPOST -i -H"Content-Type: application/json" -d'{"uid" : 1, "email": "abc@gmail.com", "name": "Learning Kubernetes"}' http://localhost:5001/firebase-project-name/asia-east2/api/v1/users

# output
bC4XfImu5r9SC3UfhCFr
```

### List items

```sh
curl -I http://localhost:5001/firebase-project-name/asia-east2/api/v1/users | jq
```

Sample response data

```json
[
    {
        "_id": "zcCqsJbdCVjbvf8Inqzd",
        "props": {
            "name": "Khiem 2",
            "email": "khiem.le@codeenginestudio.com"
        }
    }
]
```

### List item by id

```sh
curl -I http://localhost:5001/firebase-project-name/asia-east2/api/v1/users/bC4XfImu5r9SC3UfhCFr | jq
```

Sample response data

```json
{
    "_id": "zcCqsJbdCVjbvf8Inqzd",
    "props": {
        "name": "Khiem 2",
        "email": "khiem.le@codeenginestudio.com"
    }
}
```

### Update User

```sh
curl -XPUT -i -H"Content-Type: application/json" -d'{"uid" : 1, "email": "abc@gmail.com", "name": "Learning React"}' http://localhost:5001/firebase-project-name/asia-east2/api/v1/users/bC4XfImu5r9SC3UfhCFr
```

### Delete User

```sh
curl -XDELETE -i http://localhost:5001/firebase-project-name/asia-east2/api/v1/users/qPXJqaJrcly2BXja1v8v
```

## Migration & Seeding

The database seeding provides an easy way to generate sample data in the database using seed classes.

```ts
// File: src/infra/database/migration/seeding/user.ts

@provide(TYPES.UserSeeding)
class UserSeeding implements ISeeding {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository
    ) {}

    async run() {
        // ...
    }
}
```

How to use it in CLI:

1. Open file `src/cli/seeding.ts` then added the new seeding class.

```ts
type ISeedingType = 'UserSeeding';

class Seeding {
    #seedings: ISeedingType[] = ['UserSeeding'];
}
```

2. Build & Run seedings

Before run seedings using CLI, you must use firebase function shell to run user seeding first.

```sh
$ yarn shell
```

```sh
> userSeeding({})
```

Run other seedings

```sh
$ cd /path/to/project
$ yarn build && chmod +x ./dist/cli/index.js
$ yarn tools
# Run single seeding
$ ./dist/cli/index.js --seed UserSeeding
$ # Run all seeding with
$ ./dist/cli/index.js --seedall
```

## VS Code

Automatically fix code in VS Code

```js
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

## Troubleshooting
