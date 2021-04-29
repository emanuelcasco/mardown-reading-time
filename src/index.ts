/*
  @licstart 
     Copyright (©) 2021 Emanuel Casco (https://github.com/emanuelcasco)
     Available under the terms of the MIT
     See LICENSE file for more informations.
  @licend 
*/

// 👇 See RegExp in action: https://regex101.com/r/j0FGQ2/1
const IMAGE_VALIDATION_REGEXP =
  /(!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\))|(<img)/g;
// 👇 See RegExp in action: https://regex101.com/r/JVPouF/1
const WORD_VALIDATION_REGEXP = /[a-zA-Z0-9]*/;
// 👇 Values defined on this Medium post: https://blog.medium.com/read-time-and-you-bc2048ab620c
const IMAGE_FACTOR_IN_SECONDS = 12;

export const DEFAULT_WORDS_PER_MINUTE = 275;

export interface Configuration {
  wordsPerMinute?: number;
  includeImages?: boolean;
}

export interface ReadingStats {
  time: number;
  wordsCount: number;
  minutes: number;
}

const getImagesCount = (content: string) => {
  if (!content) return 0;
  const result = content.match(IMAGE_VALIDATION_REGEXP);
  return result ? result.length : 0;
};

const getWordsCount = (content: string) =>
  content
    .split(' ')
    .filter(value => WORD_VALIDATION_REGEXP.test(value))
    .length;

/**
 * Based on MEDIUM reading time calculation criteria described in the following post:
 * https://blog.medium.com/read-time-and-you-bc2048ab620c
 *
 * @param content Markdown content.
 * @param config (Optional)
 * @param config.wordsPerMinute (Default: 275) Words per minute used to calculate the reading time.
 * @param config.includeImages (Default: 275) Enable include images reading time in the estimation.
 * @returns Markdown content reading time estimation stats.
 *
 * Read time is based on the average reading speed of an adult (roughly 275 WPM). 
 * We take the total word count of a post and translate it into minutes.
 *
 * For images, the algorithm count 12 seconds for the first image, 11 for the second,
 * and minus an additional second for each subsequent image.
 * Any images after the tenth image are counted at three seconds.
 *
 * @example
 * import fs from 'fs';
 * import markdownReadingTime from 'markdown-reading-time';
 *
 * const content = fs.readfileSynf('./README.md');
 * const readingStats = markdownReadingTime(content);
 * // => { imagesCount: 0, imagesTime: 0, minutes: 1, time: 33818, wordsCount: 155 }
 */
export const calculateReadingTime = (
  content: string,
  config?: Configuration,
): ReadingStats => {
  // Setup configuration
  const wordsPerMinute =
    config?.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE;
  const includeImages =
    config?.includeImages ?? true;
  // Calculate words count, time (miliseconds) and minutes
  const wordsCount = getWordsCount(content);

  let minutes = wordsCount / wordsPerMinute;
  let time = Math.round(minutes * 60 * 1_000);

  if (includeImages) {
    // Get images coutn and update response value
    const imagesCount = getImagesCount(content);
    // Iterate over image quantity to calculate the images reading time
    let imageFactor = IMAGE_FACTOR_IN_SECONDS;
    let processedImages = 0;
    let accumulatedSeconds = 0;
    while(processedImages < imagesCount) {
      accumulatedSeconds += imageFactor;
      if (processedImages < 10) imageFactor--;
      processedImages++;
    }
    // Update response values
    minutes += Math.round(accumulatedSeconds / 60);
    time += Math.round(accumulatedSeconds * 1_000);
  }

  return {
    time,
    wordsCount,
    minutes: Math.max(1, Math.round(minutes))
  };
};

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};
