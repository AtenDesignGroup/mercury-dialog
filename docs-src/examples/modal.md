---
layout: example.11ty.cjs
title: <mercury-dialog> ⌲ Examples ⌲ Modal
tags: example
name: Modal Property
description: Modal
---

<button id="openDialogButton">Open Dialog</button>

<mercury-dialog id="mercuryDialog" open modal dialogTitle="My Dialog">
  <p>Maybe in order to understand mankind, we have to look at the word itself: "Mankind". Basically, it's made up of two separate words - "mank" and "ind". What do these words mean ? It's a mystery, and that's why so is mankind.</p>
</mercury-dialog>

<script>
  document.getElementById('openDialogButton')
    .addEventListener('click', event => document.getElementById('mercuryDialog').show());
</script>

<h3>HTML</h3>

```html
<button id="openDialogButton">Open Dialog</button>
<mercury-dialog id="mercuryDialog" open modal dialogTitle="My Dialog">
  <p>Maybe in order to understand mankind, we have to look at the word itself: "Mankind". Basically, it's made up of two separate words - "mank" and "ind". What do these words mean ? It's a mystery, and that's why so is mankind.</p>
  <footer>
    <p>Powered by Mercury Dialog</p>
  </footer>
</mercury-dialog>
```

<h3>JS</h3>

```js
document.getElementById('openDialogButton')
  .addEventListener(
    'click',
    event => document.getElementById('mercuryDialog').show()
  );
```
