/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {MercuryDialog} from '../mercury-dialog.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('mercury-dialog', () => {
  test('is defined', () => {
    const el = document.createElement('mercury-dialog');
    assert.instanceOf(el, MercuryDialog);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<mercury-dialog></mercury-dialog>`);
    assert.shadowDom.equal(
      el,
      `
      <dialog>
      <slot></slot>
      </dialog>
    `
    );
  });

  test('renders with a set open state', async () => {
    const el = await fixture(html`<mercury-dialog open></mercury-dialog>`);
    assert.shadowDom.equal(
      el,
      `
      <dialog open>
      <slot></slot>
      </dialog>
    `
    );
  });

  // test('handles a click', async () => {
  //   const el = (await fixture(html`<mercury-dialog></mercury-dialog>`)) as MercuryDialog;
  //   const button = el.shadowRoot!.querySelector('button')!;
  //   button.click();
  //   await el.updateComplete;
  //   assert.shadowDom.equal(
  //     el,
  //     `
  //     <h1>Hello, World!</h1>
  //     <button part="button">Click Count: 1</button>
  //     <slot></slot>
  //   `
  //   );
  // });

  // test('styling applied', async () => {
  //   const el = (await fixture(html`<mercury-dialog></mercury-dialog>`)) as MercuryDialog;
  //   await el.updateComplete;
  //   assert.equal(getComputedStyle(el).paddingTop, '16px');
  // });
});
