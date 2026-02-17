# Whyrify

![Static Badge](https://img.shields.io/badge/build-passing-brightgreen)  ![NPM Version](https://img.shields.io/npm/v/%40whyrify%2Fwhyrify-js)  ![NPM Downloads](https://img.shields.io/npm/dy/%40whyrify%2Fwhyrify-js) ![Static Badge](https://img.shields.io/badge/coverage-65%25-orange)

Fault injection engine for [whyrify.com](whyrify.com)

## Inject and configure

inject snippet to website, make it not async and load as early as you can:

```
<script type="text/javascript" src="//s.whyrify.com/w/whyrify.min.js" />
```

Using `WHYRIFY_CONFIG` object, you can setup reporting, and fault rate (default to 5%).

```js
<script>
  window.whyrify = window.whyrify || function() {
    (window.whyrify.q = window.whyrify.q || []).push(arguments);
  };
  whyrify('config', 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX', 0.5);
</script>
<script type="text/javascript" src="//s.whyrify.com/w/whyrify.js" />
```

## Fault injection

Now all scripts marked with `type="text/whyrify"` will run by `whyrify.js`, eventually fail with controlled chance.
Additionally you can name the feature/attribute by adding attribute `data-feature="feature-x"`.

For example:

```
<script type="text/whyrify" src="https://www.googletagmanager.com/gtm.js?id='XXXXX" data-feature="GTM" />
```

You can also call `decide` to bucket feature manually:

```js
<script>
  window.whyrify = window.whyrify || function() {
    (window.whyrify.q = window.whyrify.q || []).push(arguments);
  };
  window.whyrify("decide", "featureX", (result) => {
      if(result === "control") {
          //activate feature
      }
  });
</script>
<script type="text/javascript" src="//s.whyrify.com/w/whyrify.min.js" />
```

## Measure

Finally, you can send conversion events by calling `whyrify('link', 'conversion')`, so we can validate experiment using Bayesian stats.

```js
window.whyrify =
    window.whyrify ||
    function () {
        (window.whyrify.q = window.whyrify.q || []).push(arguments);
    };
window.whyrify("link", "conversion"); //trigger  default conversion
window.whyrify("link", "add-to-cart"); // trigger another conversion
```

## How to use as NPM package

Install the package:

```bash
npm i @whyrify/whyrify-js
```

Basic usage:

```javascript
import { Whyrify } from "@whyrify/whyrify-js";

const faultEngine = new Whyrify(
    "XXXX-XXXX-XXXX-XXXX-XXXX-XXXX", // measurement id
    50, // 50% chance to fail
    true, //do not watch for another scripts
);
if (faultEngine.decide("fault-injection-hero") === "control") {
    console.log("Control");
} else {
    console.log("Fault");
}
//report all features
faultEngine.reportFeatures();
//report conversion
faultEngine.link("conversion");
```
