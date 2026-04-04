"use strict";

const { add, divide } = require("../src/math");

describe("math helpers", () => {
  test("add sums two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("divide returns the quotient", () => {
    expect(divide(8, 2)).toBe(4);
  });

  test("divide throws on zero", () => {
    expect(() => divide(8, 0)).toThrow("Division by zero");
  });
});
