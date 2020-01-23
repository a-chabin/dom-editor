const fs = require('fs');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');
const htmlBeautify = require('js-beautify').html;
const isFragment = process.argv.includes('-fragment');

const INPUT_DIR = './src/';
const OUTPUT_DIR = './dist/';

const HTML_FILENAME = 'original.html';
const DOM_SCRIPT_FILENAME = 'instructions.js';
const RESULT_FILENAME = 'result.html';

let window = null;
let resultHTML = null;

fs.watch(INPUT_DIR, { persistent: true }, () => {
    const html = fs.readFileSync(INPUT_DIR + HTML_FILENAME).toString();
    const DOMScript = fs.readFileSync(INPUT_DIR + DOM_SCRIPT_FILENAME).toString();

    try {
        window = (new JSDOM(html, { runScripts: "outside-only" })).window;
        window.eval(DOMScript);

        resultHTML = isFragment
            ? window.document.body.innerHTML
            : window.document.documentElement.outerHTML;

        fs.writeFileSync(OUTPUT_DIR + RESULT_FILENAME, htmlBeautify(resultHTML));
        console.log('Transformed!');
    } catch (e) {
        console.error(e);
    }
});
