type GeminiResponse = { response: Promise<{ text: () => string }> };

const RESPONSE_DELAY = 2000;
const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget magna venenatis, tincidunt mi a, efficitur eros. Aenean accumsan, quam eget pulvinar pellentesque, dolor nunc lacinia libero, ac vulputate arcu quam ac nisl. Quisque rutrum lacinia dolor ac pharetra. Suspendisse et lacus ac risus dignissim auctor eu ut enim. Fusce diam ex, porta vitae turpis posuere, imperdiet rhoncus dolor. Etiam efficitur a dui in imperdiet. Morbi porttitor feugiat velit in tempor. Phasellus vulputate lacus quis enim mattis tempor. Sed vel ullamcorper tortor.';

export const geminiApiMock = {
  generateContent: (prompt: string): GeminiResponse => {
    let [, text] = prompt.split(':');
    text = (text || prompt).trim().replace(/"/g, '');
    let output = LOREM_IPSUM;

    for (let i = text.length; i < LOREM_IPSUM.length; i++) {
      if (LOREM_IPSUM[i] === ' ') {
        output = LOREM_IPSUM.substring(0, i);
        break;
      }
    }

    // Remove ending punctuation marks.
    output = output.replace(/(\.|,)$/g, '');

    // Is not upper case
    const charCode = text.charCodeAt(0);

    if (!(65 <= charCode && charCode <= 90)) {
      console.log('inside', text, output);
      const chars = output.split('');
      chars[0] = chars[0].toLowerCase();
      output = chars.join('');
    }

    if (text.endsWith('.')) {
      output += '.';
    }

    return {
      response: new Promise((r) =>
        setTimeout(() => r({ text: () => output }), RESPONSE_DELAY),
      ),
    };
  },
};
