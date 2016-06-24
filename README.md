# ponies 🐎🐎🐎

My little library for creating [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that automatically update when their attributes change. It's powered by [yo-yo](https://npmjs.org/yo-yo) which uses [morphdom](https://npmjs.org/morphdom) for DOM Diffing, and [bel](https://npmjs.org/bel) for creating DOM elements from [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals). It's lightweight so you can use it to create libraries that other people can easily add to their pages.

## Basic Example

```js
const ponies = require('ponies');

ponies.register({
  render() {
    return ponies.render`
      <my-little-component>
        <h1>Hello ${this.getAttribute('you') || "World"}</h1>
        <input onkeyup=${ev => this.setAttribute('you', ev.target.value)}/>
      </my-little-component>
    `;
  }
});
```

Note that the root element must have a dash in it's tagName. Then use it like you would any other HTML element.

```html
<my-little-component you="Jesse"></my-little-component>
```

Whenever the element's attributes change the render function gets called again and the element's DOM gets transformed to match the new result.

## Lifecycle Callbacks

[Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) often need to do setup when they are first created or attached to the DOM, clean up after they are detached, or perform custom tasks when their attributes are changed. [Lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Lifecycle_callbacks) are functions that you provide to handle these events. Ponies assigns these functions to every instance of your component, so you can refer to the current element using `this`.

```js
ponies.register({
  render() {
    return ponies.render`
      <log-component>
        <ul>
          ${this.logs.map(val => ponies.render`<li>${val}</li>`)}
        </ul>
      </log-component>
    `;
  }
  attached() {
    this.interval = window.setInterval(() => {
      this.logs.push(new Date());
      this.update();
    }, 1000);
  },
  detached() {
    window.clearInterval(this.interval);
  }
});
```

## Styling

Ponies registers [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements), but it doesn't use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM). This means that the style of your components can be affected by the stylesheet of the page. You can style your components using style attributes which have high specificity, but these can still be overridden with `!important`.

## Polyfilling

Native support for [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) has been present in Chrome since 2014. [Firefox](https://platform-status.mozilla.org/#custom-elements), and [WebKit](https://webkit.org/status/#feature-custom-elements) support is in development. [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/customelements) support is in consideration. In the mean time it is advised to use [a polyfill for document.registerElement](https://www.npmjs.com/package/document-register-element). 

## Transpiling

ES2015 features including template literals, classes, and `Object.assign` are used with aplomb. [You know what to do](https://babeljs.io/).