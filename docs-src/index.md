---
layout: page.11ty.cjs
title: <mercury-dialog> ⌲ Home
---

# &lt;mercury-dialog>

`<mercury-dialog>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<mercury-dialog>` is just an HTML element. You can it anywhere you can use HTML!

```html
<mercury-dialog></mercury-dialog>
```

  </div>
  <div>

<mercury-dialog></mercury-dialog>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<mercury-dialog>` can be configured with attributed in plain HTML.

```html
<mercury-dialog name="HTML"></mercury-dialog>
```

  </div>
  <div>

<mercury-dialog name="HTML"></mercury-dialog>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<mercury-dialog>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;mercury-dialog&gt;</h2>
    <mercury-dialog .name=${name}></mercury-dialog>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;mercury-dialog&gt;</h2>
<mercury-dialog name="lit-html"></mercury-dialog>

  </div>
</section>
