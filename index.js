const fs = require('fs');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');
const htmlBeautify = require('js-beautify').html;
const isFragment = process.argv.includes('-fragment');
const isJQuery = process.argv.includes('-jquery');

const INPUT_DIR = './src/';
const OUTPUT_DIR = './dist/';

const RESULT_FILENAME = 'result.html';
const DOM_SCRIPT_FILENAME = 'instructions.js';
const HTML_FILENAME = 'original.html';

let window = null;
let $ = null;
let resultHTML = null;

fs.watch(INPUT_DIR, { persistent: true }, () => {
    let html = fs.readFileSync(INPUT_DIR + HTML_FILENAME).toString();
    html = preserveTags(html);
    const DOMScript = fs.readFileSync(INPUT_DIR + DOM_SCRIPT_FILENAME).toString();

    try {
        if (isJQuery) {
            $ = cheerio.load(html, {
                decodeEntities: false
            });
            eval(DOMScript);

            resultHTML = isFragment
                ? $('body').html()
                : $.html();
        } else {
            window = (new JSDOM(html, { runScripts: "outside-only" })).window;
            window.eval(DOMScript);

            resultHTML = isFragment
                ? window.document.body.innerHTML
                : window.document.documentElement.outerHTML;
        }

        resultHTML = rollBackTags(resultHTML);

        fs.writeFileSync(OUTPUT_DIR + RESULT_FILENAME, htmlBeautify(resultHTML));
        console.log('Transformed!');
    } catch (e) {
        console.error(e);
    }
});

function preserveTags(html) {
    return html
        .replace(/script/g, 'preserve-script')
        .replace(/style/g, 'preserve-style');
}

function rollBackTags(html) {
    return html
        .replace(/preserve-script/g, 'script')
        .replace(/preserve-style/g, 'style');
}
