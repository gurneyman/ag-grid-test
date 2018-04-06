module.exports = CheckBoxCellRendererBuilderService;

function CheckBoxCellRendererBuilderService($document) {
  return {
    build: build
  };

  function build(clickHandler) {
    // cell renderer class
    function CheckBoxCellRenderer() {}

    // init method gets the details of the cell to be rendered
    CheckBoxCellRenderer.prototype.init = function (params) {
      this.checkbox = $document[0].createElement('span');
      this.checkbox.classList.add('ag-selection-checkbox');
      if (params.value) {
        this.checkbox.innerHTML += '<span class="ag-icon ag-icon-checkbox-checked"></span>';
      } else {
        this.checkbox.innerHTML += '<span class="ag-icon ag-icon-checkbox-unchecked"></span>';
      }
      this.checkbox.innerHTML += '</span>';
      this.eventListener = clickHandler;

      this.checkbox.addEventListener('click', this.eventListener);
    };

    CheckBoxCellRenderer.prototype.getGui = function () {
      return this.checkbox;
    };

    // gets called whenever the user gets the cell to refresh
    CheckBoxCellRenderer.prototype.refresh = function () {
      return true;
    };

    // gets called when the cell is removed from the grid
    CheckBoxCellRenderer.prototype.destroy = function () {
      // do cleanup, remove event listener from button
      this.checkbox.removeEventListener('click', this.eventListener);
    };

    return CheckBoxCellRenderer;
  }
}
