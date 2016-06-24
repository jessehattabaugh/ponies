# ponies 🐎🐎🐎

My little library for registering [Custom Elements] that automatically update when their attributes change. It's powered by [yo-yo] which uses  for DOM Diffing, and [bel] for creating DOM elements from [tagged template literals]. It's lightweight so you can use it to create [Web Components] that other people can easily add to their pages.

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

[Custom elements] often need to do setup when they are first created or attached to the DOM, clean up after they are detached, or perform custom tasks when their attributes are changed. [Lifecycle callbacks] are functions that you provide to handle these events. Ponies assigns these functions to every instance of your component, so you can refer to the current element using `this`.

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

Technically, ponies lets you create [Web Components], but it doesn't use [Shadow DOM]. This means that the style of your components can be affected by the stylesheet of the page. You can style your components using style attributes which have high specificity, but these can still be overridden with `!important`.

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
[Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements)
[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
[yo-yo](https://npmjs.org/yo-yo)
[morphdom](https://npmjs.org/morphdom)
[bel](https://npmjs.org/bel)
[tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)
[lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements#Lifecycle_callbacks)