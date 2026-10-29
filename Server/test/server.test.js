import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "test-secret";
process.env.CLIENT_SECRET_GOOGLE = "test-session-secret";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.SERVER_URL = "http://localhost:2004";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";

const { app } = await import("../server.js");

describe("Sparkl API authentication and books", () => {
  it("validates registration input", async () => {
    const response = await request(app).post("/user/register").send({});
    assert.equal(response.status, 400);
    assert.equal(response.body.message, "All fields must be filled");
  });

  it("validates login input", async () => {
    const response = await request(app).post("/user/login").send({});
    assert.equal(response.status, 400);
    assert.equal(response.body.message, "All fields must be filled");
  });

  it("rejects a books read without a JWT", async () => {
    const response = await request(app).get("/books");
    assert.equal(response.status, 401);
  });

  it("rejects a book create without a JWT", async () => {
    const response = await request(app).post("/books").send({
      title: "Unauthenticated book",
    });
    assert.equal(response.status, 401);
  });
});
