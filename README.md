# TicketIT-API

(API) ExpressJS server for TicketIT app.

## Getting Started

Clone:

```
git clone https://github.com/KleoHasani/TicketIT-API.git
```

Create .env file in root directory of this project:

```
PORT=8000
MONGO_URI=yourmongourihere
ACCESS_TOKEN=your256bitaccesstokensecret
REFRESH_TOKEN=your256bitaccesstokensecret
DOMAIN=OnlyDomainAllowedToAccessAPI
```

Or use generator for more secure strings:

```
node gen_env.js
```

Test .env.test

```
node gen_env_test.js
```

Install dependencies:

```
npm install
```

Run:

```
npm start
```

Run Dev:

```
npm run start:dev
```

## Required

Node v15.2.0

## Build With

Node

## Version

1.0.0

## Authors

Kleo Hasani

### Notes

**Thank You**
