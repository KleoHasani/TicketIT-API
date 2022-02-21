<p align="center">
	<img src="./docs/screenshots/logo.png" width="200px" height="200px">
</p>

# TicketIT-API

(API) ExpressJS server for TicketIT app.

## Getting Started

Clone:

```git
git clone https://github.com/KleoHasani/TicketIT-API.git
```

Create .env file in root directory of this project:

```env
PORT=8000
MONGO_URI=yourmongourihere
ACCESS_TOKEN=your256bitaccesstokensecret
REFRESH_TOKEN=your256bitaccesstokensecret
DOMAIN=OnlyDomainAllowedToAccessAPI
```

Or use generator for more secure strings:

```node
node gen_env.js
```

Test .env.test

```node
node gen_env_test.js
```

Install dependencies:

```npm
npm install
```

Run:

```npm
npm start
```

Run Dev:

```npm
npm run start:dev
```

### Required

- Node v15.2.0

### Build With

Node
```npm
npm run build
```

## Version

v1.0.0

## Authors

Kleo Hasani

### Notes
