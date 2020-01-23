# DOM Editor

Easy way to edit HTML using DOM API (cheerio, jsdom)


## Using

`npm i` — install dependencies

`npm start` — start watcher (/src folder)

### Parameters

`npm start -- -jquery` — jQuery mode (cheerio)

`npm start -- -fragment` — only fragment (result.html without *<html>* and *<body>* tags)



## Example

### original.html

```html
<div>
    <ul class="block">
        <li>One</li>
        <li>Two<b>remove me!</b></li>
    </ul>
    text
</div>

```

### instructions.js (Vanilla JS or jQuery)

```js
// jQuery 
$('.block > li').addClass('test');
$('.block > li b').remove();
```

```js
// Vanilla JS
document.querySelectorAll('.block > li').forEach(item => {
    item.classList.add('test');
})

document.querySelector('.block > li b').remove();
```

### result.html

```html
<div>
    <ul class="block">
        <li class="test">One</li>
        <li class="test">Two</li>
    </ul>
    text
</div>
```
