export default ({ text = '' } = {}) => `
  <div class="layout__offline-panel offline-panel" id="offline-panel">
    <div class="container">
      <div class="offline-panel__inner">
        <p>${text}</p>
      </div>
    </div>
  </div>
`
