# markdown-reading-time 🧮 

**A library to help you calculate text/markdown files reading time**. The strategy to calculate this estimated time is based on the Medium post ["Read Time and You"](https://blog.medium.com/read-time-and-you-bc2048ab620c), which introduces at a high level the algorithm used by medium for this task. As a summary:

- The reading time is based on the average reading speed of an adult (roughly 275 WPM).
- The algorithm take the total word count of a post and translate it into minutes.
- For images, the algorithm count 12 seconds for the first image, 11 for the second, and minus an additional second for each subsequent image.
- Any images after the tenth image are counted at three seconds.

## Installation

```
$ npm install -g readme-example
```

## Usage

Simply import the package and pass the text content you want to measure as a string:

```typescript
import fs from 'fs';
import markdownReadingTime from 'markdown-reading-time';

const content = fs.readfileSynf('./README.md');

const readingStats = markdownReadingTime(content);
// => { imagesCount: 0, imagesTime: 0, minutes: 1, time: 33818, wordsCount: 155 }
```

### Configuration

#### WPS Factor

By default the WPS (Words Per Second) factor is setted to `275`, as recommended in the previously mentioned post, but you can change this value for the reading tima calculation:

```typescript
const readingStats = markdownReadingTime(content, { wordsPerMinute: 200 });
```

#### Disable image calculation

Image reading time is calculation is enabled by default however if you wanted to disable this feature you can do it as follows:

```typescript
const readingStats = markdownReadingTime(content, { includeImages: false });
```

## Support

You can open an issue through GitHub or contact me directly by e-mail: cascoemanuel@gmail.com.

## License
Released under the [MIT](./LICENSE) license.