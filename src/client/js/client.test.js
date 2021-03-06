import { cToF } from './helper';
import { handleSubmit } from './app';

// test proper conversion of freezing point 0 deg Celcius => 32 deg Fahrenheit
test("Convert degrees Celcius to Fahrenheit", () => {
  expect(cToF(0)).toBe(32);
});

// test handleSubmit function exists and is defined
describe('initiate trip submission on submit', () => {
  test('It should return true', () => {
    expect(handleSubmit).toBeDefined();
  });
});
