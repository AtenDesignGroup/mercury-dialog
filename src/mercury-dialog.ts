/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, queryAsync} from 'lit/decorators.js';

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
    }

    dialog {
      border-style: var(--me-border-style, solid);
      border-width: var(--me-border-width, 1px);
      border-color: var(--me-border-color, #e5e5e5);
      padding: 0;
      position: fixed;
      margin: auto;
      height: fit-content;
      inset: 0;
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
      display: flex;
      justify-content: flex-end;
      padding: var(--me-space-inset, 8px);
      border-bottom-style: var(--me-border-style, solid);
      border-bottom-width: var(--me-border-width, 1px);
      border-bottom-color: var(--me-border-color, #e5e5e5);
    }

    h2 {
      font-size: var(--me-label-font-size, 16px);
      line-height: var(--me-label-line-height, 1.1);
      margin-inline-end: auto;
    }

    form[method='dialog'] {
      align-items: stretch;
      display: flex;
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
  @property({type: String, reflect: true})
  dock = 'none';

  @property({type: Boolean, reflect: true})
  closeButton = true;

  @property({type: Number, reflect: true})
  backdropOpacity = 1;

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

  override render() {
    return html`
      <dialog
        id="dialog"
        part="dialog"
        data-dock=${this.dock}
      >
        ${this.title || this.closeButton
          ? html`<header>
              ${this.title ? html`<h2>${this.title}</h2>` : html``}
              ${this.moveable
                ? html`<button
                    @mousedown=${this._onDragMouseDown}
                    part="drag-button"
                    id="dragButton"
                  >
                    Drag
                  </button>`
                : html``}
              ${this.dock === 'none'
                ? html`<button
                    @click=${() => this.dock = 'right'}
                    part="dock-button"
                    id="dockButton"
                  >
                    Dock
                  </button>`
                : html`<button
                    @click=${() => this.dock = 'none'}
                    part="undock-button"
                    id="undockButton"
                  >
                    Undock
                  </button>`}
              <form method="dialog">
                <button
                  @click=${this._onCloseClick}
                  part="close-button"
                  id="closeButton"
                >
                  Close
                </button>
              </form>
            </header>`
          : html``}

        <slot></slot>
      </dialog>
    `;
  }

  /**
   * showModal
   * Shows the dialog as a modal with a background overlay.
   */
  public async showModal() {
    this.modal = true;
    this.open = true;
    (await this._dialog).showModal();
  }

  /**
   * show
   * Shows the dialog.
   */
  public async show() {
    this.modal = false;
    this.open = true;
    (await this._dialog).show();
  }

  /**
   * close
   * Closes the dialog.
   */
  public async close() {
    this.open = false;
    (await this._dialog).close();
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

  private _onDragMouseUp = () => {
    document.removeEventListener('mouseup', this._onDragMouseUp);
    document.removeEventListener('mousemove', this._onMouseMove);
  };

  private _onMouseMove = async (event: MouseEvent) => {
    const dialog = await this._dialog;

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
}

declare global {
  interface HTMLElementTagNameMap {
    'mercury-dialog': MercuryDialog;
  }
}
