const ponies = require('../../ponies');

ponies.register({
  render() {
    return ponies.render`
      <ui-field>
        <input onkeyup=${this.getAttribute('oninput')}/>
      </ui-field>
    `;
  }
});