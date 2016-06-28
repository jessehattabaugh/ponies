const test = require('tape');
const p = require('../ponies').register;
const h = require('../ponies').render;

const $ = document.getElementById.bind(document);

// polyfills
require('document-register-element');

// one
test("Exports the right stuff", function (t) {
  t.plan(2);
  t.equal(typeof p, 'function');
  t.equal(h`<div>`.tagName, 'DIV');
});

// two 
test("Throws exceptions on invalid definition", function (t) {
  t.plan(6);
  t.throws(function () {
    p();
  }, "no arguments");
  t.throws(function () {
    p({});
  }, "no render property");
  t.throws(function () {
    p({render: 'invalid'});
  }, "render property not a function");
  t.throws(function () {
    p({render() {return 'invalid';}});
  }, "render function doesn't return a node");
  t.throws(function () {
    p({render() {return h`<invalid>`;}});
  }, "root element tagName must contain a dash");
  t.doesNotThrow(() => {
    p({render() {return h`<el-two>`;}});
  }, "acceptable definition doesn't throw an error");
});

// three
test("Replaces a Custom Element's DOM with a VDOM", function (t) {
  t.plan(3);
  t.equal($('id-three-old').tagName, 'DIV');
  p({
    render() { 
      return h`<el-three><div id="id-three-new"></div></el-three>`;
    }
  });
  t.equal($('id-three-old'), null);
  t.equal($('id-three-new').tagName, 'DIV');
});

// four
test("Attached callback is executed", function (t) {
  t.plan(1);
  p({
    render() {
      return h`<el-four>`;
    },
    attached() {
      t.pass("callback called");
    }
  });
  t.timeoutAfter(1000);
});

// five
test("Render function can use attributes of element to render", function (t) {
  t.plan(1);
  p({
    render() {
      let textFive = this.attributes['att-five'] ? this.attributes['att-five'].value: 'val-null';
      return h`<el-five><div id='id-five'>${textFive}</div></el-five>`;
    }
  });
  t.equal($('id-five').innerText, 'val-five');
});

// six
test("Mutations of the element's attributes will trigger a render", function (t) {
  t.plan(1);
  p({
    render() {
      let textSix = this.attributes['att-six'] ? this.attributes['att-six'].value : 'val-null';
      return h`<el-six id="id-six">${textSix}</el-six>`;
    }
  });
  $('id-six').setAttribute('att-six', 'val-six-new');
  // todo: if dom update takes too long this timeout interval might not work
  setTimeout(function () {
    t.equal($('id-six').innerText, 'val-six-new');
  }, 1000);
});