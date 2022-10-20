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
    }

    dialog[data-dock='right'] {
      height: auto;
      max-height: none;
      width: 400px;
      left: auto;
      right: 0;
      position: fixed;
      top: 0;
      bottom: 0;
      border-right-width: 0;
      border-top-width: 0;
      border-bottom-width: 0;
    }

    dialog[data-dock='left'] {
      height: auto;
      max-height: none;
      width: 400px;
      left: 0;
      right: auto;
      position: fixed;
      top: 0;
      bottom: 0;
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
        ?open=${this.open}
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
                    @click=${() => this._setDock('right')}
                    part="dock-button"
                    id="dockButton"
                  >
                    Dock
                  </button>`
                : html`<button
                    @click=${() => this._setDock('none')}
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
    this.open = true;
    this.modal = true;
    (await this._dialog).showModal();
  }

  /**
   * show
   * Shows the dialog.
   */
  public async show() {
    this.open = true;
    this.modal = false;
    (await this._dialog).show();
  }

  /**
   * close
   * Closes the dialog.
   */
  public close() {
    this.open = false;
    this._dialog.close();
  }

  private _onCloseClick() {
    this.open = false;
  }

  private _onDragMouseDown(event: MouseEvent) {
    this._dragStartX = event.clientX;
    this._dragStartY = event.clientY;
    this._offsetLeft = this._dialog.offsetLeft;
    this._offsetTop = this._dialog.offsetTop;

    document.addEventListener('mouseup', this._onDragMouseUp);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  private _onDragMouseUp = () => {
    document.removeEventListener('mouseup', this._onDragMouseUp);
    document.removeEventListener('mousemove', this._onMouseMove);
  };

  private _setDock(direction: string) {
    this.dock = direction;

    switch (direction) {
      case 'right':
        Object.assign(this._dialog.style, {
          inset: '0 0 0 auto',
        });
        break;
      case 'none':
        Object.assign(this._dialog.style, {
          inset: 'auto',
        });
        break;

      default:
        break;
    }
  }

  private _onMouseMove = (event: MouseEvent) => {
    this._dialog.style.left = `${Math.min(
      Math.max(0, this._offsetLeft + event.clientX - this._dragStartX),
      window.innerWidth - this._dialog.offsetWidth
    )}px`;
    this._dialog.style.top = `${
      this._offsetTop + event.clientY - this._dragStartY
    }px`;
    this._dialog.style.right = 'auto';
    this._dialog.style.bottom = 'auto';
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'mercury-dialog': MercuryDialog;
  }
}
