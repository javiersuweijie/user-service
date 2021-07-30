const { quotient } = require(".");

// describe("quotient", () => {
//   beforeAll(() => {
//     // Do something before all tests runs
//   });
//   afterAll(() => {
//     // Do something afterall tests runs
//   });
//   test("x = 10, y = 5, result = 2", () => {
//     const actual = quotient(10, 5);
//     expect(actual).toEqual(2);
//   });
//   test("x = -10, y = -2, result = 5", () => {
//     const actual = quotient(-10, -2);
//     expect(actual).toEqual(5);
//   });
// });

describe("quotient", () => {
  const cases = [
    [10, 5, 2],
    [-10, -2, 5],
  ];

  test.each(cases)("x = %s, y = %s, result = %s", (x, y, expected) => {
    const actual = quotient(x, y);
    expect(actual).toEqual(expected);
  });
});
