/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, queryAsync} from 'lit/decorators.js';

enum DockableDirection {
  None = "none",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('mercury-dialog')
export class MercuryDialog extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--me-font-family, sans-serif);
      z-index: var(--me-dialog-z-index, 1000);
      position: relative;
    }

    dialog {
      border-style: var(--me-border-style, solid);
      border-width: var(--me-border-width, 1px);
      border-color: var(--me-border-color, #e5e5e5);
      box-shadow: 0 1px 2px rgb(20 45 82 / 2%), 0 3px 4px rgb(20 45 82 / 3%), 0 5px 8px rgb(20 45 82 / 4%);
      padding: 0;
      position: fixed;
      margin: auto;
      inset: 0;
      width: var(--me-dialog-width, fit-content);
      height: var(--me-dialog-height, fit-content);
      z-index: 1000;
    }

    dialog[open] {
      display: flex;
      flex-direction: column;
    }

    dialog[data-dock='left'] {
      height: auto;
      inset: 0 auto 0 0;
      margin: 0 auto 0 0;
      max-height: none;
      width: var(--me-dialog-width, 400px);
    }

    dialog[data-dock='right'] {
      height: auto;
      inset: 0 0 0 auto;
      margin: 0 0 0 auto;
      max-height: none;
      width: var(--me-dialog-width, 400px);
    }

    dialog[data-dock='bottom'] {
      inset: auto 0 0 0;
      margin: auto 0 0 0;
      width: auto;
      height: var(--me-dialog-height, 400px);
    }

    dialog[data-dock='top'] {
      inset: 0 0 auto 0;
      margin: 0 0 auto 0;
      width: auto;
      height: var(--me-dialog-height, 400px);
    }

    dialog::backdrop {
      background-color: black;
      opacity: 0.4;
    }

    #dragButton {
      cursor: move;
    }

    header {
      background-color: var(--me-dialog-header-background-color, #fff);
      display: flex;
      justify-content: space-between;
      padding: var(--me-dialog-header-space-inset-y, var(--me-space-inset-y, 5px)) var(--me-dialog-header-space-inset-x, var(--me-space-inset-x, 20px));
      border-bottom-style: var(--me-border-style, solid);
      border-bottom-width: var(--me-border-width, 1px);
      border-bottom-color: var(--me-border-color, #e5e5e5);
      position: sticky;
      top: 0;
    }

    h2 {
      font-size: var(--me-label-font-size, 16px);
      line-height: var(--me-label-line-height, 1.1);
      margin-inline-end: var(--me-space-inset, .5em);
    }

    main {
      background-color: var(--me-dialog-main-background-color, #fff);
      padding: var(--me-dialog-main-space-inset-y, var(--me-space-inset-y, 20px)) var(--me-dialog-main-space-inset-y, var(--me-space-inset-y, 20px));
      overflow-y: auto;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      margin-inline-end: -10px;
    }

    form[method='dialog'] {
      align-items: stretch;
      display: flex;
    }

    button {
      height: var(--me-dialog-button-height, 40px);
      width: var(--me-dialog-button-width, 40px);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: var(--me-dialog-button-radius, 3px);
      background-color: var(--me-dialog-button-background-color, #fff);
      transition: all .2s ease-out;
    }

    button:hover {
      background-color: var(--me-dialog-button-background-color-hover, #efefef);
    }

    button i {
      background-position: center;
      background-repeat: no-repeat;
      display: block;
      height: 50%;
      width: 50%;
    }

    button span {
      position: absolute !important;
      overflow: hidden;
      clip: rect(1px,1px,1px,1px);
      width: 1px;
      height: 1px;
      word-wrap: normal;
    }

    #closeButton i {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256l105.3-105.4z"/></svg>');
    }

    #dragButton i {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224v114.8l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288h114.8l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/></svg>');
    }

    #dockButton i {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M7.724 65.49A64.308 64.308 0 0 1 32 40.56a63.55 63.55 0 0 1 25.46-8.23c2.15-.22 4.33-.33 6.54-.33h384c35.3 0 64 28.65 64 64v320c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V96c0-2.21.112-4.39.33-6.54a63.634 63.634 0 0 1 7.394-23.97zM48 416c0 8.8 7.16 16 16 16h384c8.8 0 16-7.2 16-16V224H48v192z"/></svg>');
    }

    #undockButton i {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M432 48H208c-17.7 0-32 14.33-32 32v16h-48V80c0-44.18 35.8-80 80-80h224c44.2 0 80 35.82 80 80v224c0 44.2-35.8 80-80 80h-16v-48h16c17.7 0 32-14.3 32-32V80c0-17.67-14.3-32-32-32zm-112 80c35.3 0 64 28.7 64 64v256c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V192c0-35.3 28.65-64 64-64h256zM64 464h256c8.8 0 16-7.2 16-16V256H48v192c0 8.8 7.16 16 16 16z"/></svg>');
    }
  `;

  /**
   * Whether the dialog should be open or not.
   */
  @property({type: Boolean, reflect: true})
  open = false;

  /**
   * Whether the dialog should be treated as a modal with a backdrop.
   */
  @property({type: Boolean, reflect: true})
  modal = false;

  /**
   * Whether the dialog should be moveable.
   */
  @property({type: Boolean, reflect: true})
  moveable = false;

  /**
   * The location in which the dialog should be docked.
   */
  @property({
    type: DockableDirection,
    reflect: true,
  })
  dock = 'none';

  /**
   * True if a docked dialog should push the page contents over
   * rather than overlaying.
   */
  @property({type: Boolean, reflect: true})
  push = false;

  /**
   * The location in which the dialog should be docked.
   */
  @property({type: Boolean, reflect: true})
  dockable = false;

  @property({type: Boolean, reflect: true})
  closeButton = true;

  @property({type: Number, reflect: true})
  backdropOpacity = 1;

  @property({type: String, attribute: false})
  returnValue = 'tests';

  /**
   * The title shown in the dialog header when open.
   */
  @property({type: String, reflect: true})
  override title = '';

  @queryAsync('#dialog')
  private _dialog!: HTMLDialogElement;

  private _dragStartX = 0;
  private _dragStartY = 0;
  private _offsetTop = 0;
  private _offsetLeft = 0;
  // private _height = '400px';
  private _width = 400;

  /**
   *  Mimic the HTMLDialogElement close event.
   */
  async _handleClose () {
    const dialog = await this._dialog;
    this.returnValue = dialog.returnValue;
    this.open = false;
    this._teardownBody();
    this.dispatchEvent(new Event('close'));
  }

  /**
   *  Mimic the HTMLDialogElement cancel event.
   */
  async _handleCancel () {
    const dialog = await this._dialog;
    this.returnValue = dialog.returnValue;
    this.dispatchEvent(new Event('cancel'));
  }

  override render() {
    return html`
      <dialog
        id="dialog"
        part="dialog"
        data-dock=${this.dock}
        @close=${this._handleClose}
        @cancel=${this._handleCancel}
      >
        ${this.title || this.closeButton
          ? html`<header>
              ${this.title ? html`<h2>${this.title}</h2>` : html``}
              <div class="buttons">
                ${this.moveable
                  ? html`<button
                      @mousedown=${this._onDragMouseDown}
                      part="drag-button"
                      id="dragButton"
                    >
                      <i></i>
                      <span>Drag</span>
                    </button>`
                  : html``}
                ${!this.dockable
                  ? ''
                  : this.dock === 'none'
                    ? html`<button
                        @click=${this._onDock()}
                        part="dock-button"
                        id="dockButton"
                      >
                        <i></i>
                        <span>Dock</span>
                      </button>`
                    : html`<button
                        @click=${this._onUnDock}
                        part="undock-button"
                        id="undockButton"
                      >
                      <i></i>
                      <span>Undock</span>
                      </button>`}
                <form method="dialog">
                  <button
                    @click=${this._onCloseClick}
                    part="close-button"
                    id="closeButton"
                  >
                    <i></i>
                    <span>Close</span>
                  </button>
                </form>
              </div>
            </header>`
          : html``}
          <main>
            <slot></slot>
          </main>
        </dialog>
    `;
  }

  override updated(changedProperties) {
    if (changedProperties.has('dock') || changedProperties.has('push')) {
      this._setupBody();
    }

    if (changedProperties.has('modal')) {
      this._setupBody();
    }
  }

  /**
   * showModal
   * Shows the dialog as a modal with a background overlay.
   */
  public async showModal() {
    this.modal = true;
    this.open = true;

    if (this.isDocked()) {
      this._onDock();
    }

    (await this._dialog).showModal();
  }

  /**
   * show
   * Shows the dialog.
   */
  public async show() {
    this.modal = false;
    this.open = true;

    if (this.isDocked()) {
      await this._onDock(this.dock)();
    }

    (await this._dialog).show();
  }

  /**
   * close
   * Closes the dialog.
   */
  public async close() {
    if (this.isDocked()) {
      await this._onDock(this.dock)();
    }
    (await this._dialog).close();
  }

  /**
   * isDocked
   * True if docked.
   */
   public isDocked() {
    return this.dock && this.dock !== 'none';
  }

  private _onCloseClick() {
    this.open = false;
  }

  private async _onDragMouseDown(event: MouseEvent) {
    const dialog = await this._dialog;
    this._dragStartX = event.clientX;
    this._dragStartY = event.clientY;
    this._offsetLeft = dialog.offsetLeft;
    this._offsetTop = dialog.offsetTop;

    document.addEventListener('mouseup', this._onDragMouseUp);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  private _onDock = (direction = 'right') => async () => {
    const dialog = await this._dialog;
    dialog.style.removeProperty('inset');
    this.dock = direction;

    document.documentElement.style.setProperty('--me-dialog-width', `${this._width}px`);
    this._setupBody();
  };

  private _onUnDock = async () => {
    this.dock = 'none';
  };

  private _onDragMouseUp = () => {
    document.removeEventListener('mouseup', this._onDragMouseUp);
    document.removeEventListener('mousemove', this._onMouseMove);
  };

  private _onMouseMove = async (event: MouseEvent) => {
    const dialog = await this._dialog;
    this.dock = 'none';

    dialog.style.left = `${Math.min(
      Math.max(0, this._offsetLeft + event.clientX - this._dragStartX),
      window.innerWidth - dialog.offsetWidth
    )}px`;
    dialog.style.top = `${
      this._offsetTop + event.clientY - this._dragStartY
    }px`;
    dialog.style.right = 'auto';
    dialog.style.bottom = 'auto';
  };

  private _setupBody = () => {
    document.body.style.setProperty('transition', 'padding var(--me-dialog-duration, 200) var(--me-dialog-timing, ease-out)');
    document.body.style.removeProperty('padding-top');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('padding-bottom');
    document.body.style.removeProperty('padding-left');
    this._pushBody();
  }

  private _teardownBody = () => {
    document.body.style.removeProperty('transition');
    document.body.style.removeProperty('padding-top');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('padding-bottom');
    document.body.style.removeProperty('padding-left');
    this._pushBody();
  }

  private _pushBody = () => {
    [...document.querySelectorAll('[dock][push][open]')].forEach((dialog) => {
      switch (dialog.getAttribute('dock')) {
        case 'top':
          document.body.style.setProperty('padding-top', 'var(--me-dialog-offset-top, var(--me-dialog-height))');
          break;
        case 'right':
          document.body.style.setProperty('padding-right', 'var(--me-dialog-offset-right, var(--me-dialog-width))');
          break;
        case 'bottom':
          document.body.style.setProperty('padding-bottom', 'var(--me-dialog-offset-bottom, var(--me-dialog-height))');
          break;
        case 'left':
          document.body.style.setProperty('padding-left', 'var(--me-dialog-offset-left, var(--me-dialog-width)');
          break;
        default:
          break;
      }
    });
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'mercury-dialog': MercuryDialog;
  }
}
