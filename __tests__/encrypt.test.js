const { encrypt, validate } = require("../src/helpers/encrypt");

let data = null;
let encrypted = null;

beforeAll((done) => {
  data = Date.now().toString();
  done();
});

afterAll((done) => {
  data = null;
  encrypted = null;
  done();
});

describe("ENCRYPT", () => {
  // encrypt
  it("Should encrypt string data and return encrypted string.", async (done) => {
    encrypted = await encrypt(data);
    expect(encrypted).not.toBeNull();
    expect(encrypted.length).toEqual(60);
    done();
  });

  it("Should fail to encrypt when no payload", async (done) => {
    const failedtoencrypt = await encrypt();
    expect(failedtoencrypt).toBeNull();
    done();
  });

  it("Should fail to encrypt when payload type is not string (number)", async (done) => {
    const failedtoencrypt = await encrypt(123);
    expect(failedtoencrypt).toBeNull();
    done();
  });

  it("Should fail to encrypt when payload type is not string (object)", async (done) => {
    const failedtoencrypt = await encrypt({ data: "data" });
    expect(failedtoencrypt).toBeNull();
    done();
  });

  it("Should fail to encrypt when payload type is not string (array)", async (done) => {
    const failedtoencrypt = await encrypt(["data"]);
    expect(failedtoencrypt).toBeNull();
    done();
  });

  it("Should fail to encrypt when payload type is not string (null)", async (done) => {
    const failedtoencrypt = await encrypt(null);
    expect(failedtoencrypt).toBeNull();
    done();
  });

  // validate
  it("Should validate encrypted string and return true", async (done) => {
    const validated = await validate(data, encrypted);
    expect(validated).not.toBeNull();
    expect(validated).toBe(true);
    done();
  });

  it("Should return false on no hash to validate against", async (done) => {
    expect(await validate(data)).toBe(false);
    done();
  });

  it("Should return false on no data no hash to validate against", async (done) => {
    expect(await validate()).toBe(false);
    done();
  });
});
