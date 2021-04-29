import faker from 'faker';

import { calculateReadingTime, Configuration, ReadingStats } from '../src';

const generateTest = (
  input: number | string,
  config: Partial<Configuration> = {},
  expected: Partial<ReadingStats> = {}
) => {
  const fakeText = typeof input === 'number'
    ? faker.random.words(input)
    : input;
  expect(calculateReadingTime(fakeText, config)).toStrictEqual(expected);
};

describe('calculateReadingTime', () => {
  test('should handle less than 1 minute text', () => {
      generateTest(5, {}, {
        minutes: 1,
        time: 1091,
        wordsCount: 5
      })
    });
  test('should handle less than 1 minute text', () => {
      generateTest(274, {}, {
        minutes: 1,
        time: 59782,
        wordsCount: 274
      })
    });
  test('should handle more than 1 minute text but less than 2', () => {
      generateTest(300, {}, {
        minutes: 1,
        time: 65455,
        wordsCount: 300
      })
    });
  test('should handle 50 words and 10 words per minute config', () => {
      generateTest(50, { wordsPerMinute: 10 }, {
        minutes: 5,
        time: 300000,
        wordsCount: 50
      })
    });
  test('should handle reading time from markdown', () => {
      generateTest(`
        # Title 
        Lorem ipsum.
        <img src="link" />
        The end.
      `, { includeImages: true }, {
        minutes: 1,
        time: 21818,
        wordsCount: 45
      })
    });
  test('should handle reading time from markdown', () => {
      generateTest(`
        # Title 
        Lorem ipsum.
        <img src="link" />
        The end.
      `, { includeImages: false }, {
        minutes: 1,
        time: 9818,
        wordsCount: 45
      })
    });
});
