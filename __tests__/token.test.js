const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../src/helpers/token");
const { connection, disconnect } = require("mongoose");

let payload = null;
let token = null;

beforeAll((done) => {
  require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  });
  require("../src/config/mongodb");
  payload = Date.now().toString();
  done();
});

afterAll(async (done) => {
  payload = null;
  token = null;
  await connection.db.dropDatabase();
  await disconnect();
  done();
});

describe("TOKEN", () => {
  it("Should genereate new access token", (done) => {
    token = signAccessToken(payload);
    expect(token).not.toBeNull();
    expect(typeof token).toBe("string");
    done();
  });

  it("Should return null without a payload passed to access token", (done) => {
    const badtoken = signAccessToken();
    expect(badtoken).toBeNull();
    done();
  });

  it("Should validate access token to match payload, audience issuer = TICKETIT-API", (done) => {
    const validated = verifyAccessToken(token);
    expect(validated).not.toBeNull();
    expect(typeof validated).toBe("object");
    expect(validated.payload).toBe(payload);
    expect(validated.aud).toBe(payload);
    expect(validated.iss).toBe("TICKETIT-API");
    done();
  });

  // refresh token
  it("Should genereate new refresh token", async (done) => {
    token = await signRefreshToken(payload);
    expect(token).not.toBeNull();
    expect(typeof token).toBe("string");
    done();
  });

  it("Should return null without a payload passed to refresh token", async (done) => {
    const badtoken = await signRefreshToken();
    expect(badtoken).toBeNull();
    done();
  });

  it("Should validate access token to match payload, audience issuer = TICKETIT-API", (done) => {
    const validated = verifyRefreshToken(token);
    expect(validated).not.toBeNull();
    expect(typeof validated).toBe("object");
    expect(validated.payload).toBe(payload);
    expect(validated.aud).toBe(payload);
    expect(validated.iss).toBe("TICKETIT-API");
    done();
  });
});
