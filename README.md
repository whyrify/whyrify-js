# Whyrify

Fault injection engine.

## How to inject fault engine

inject snippet to website, make it not async and load as early as you can:

```
<script type="text/javascript" src="//s.whyrify.com/w/whyrify.min.js" />
```

Now all scripts marked with `type="text/whyrify"` will run by `whyrify.min.js`, eventually fail with controlled chance.
Additionally you can name the feature/attribute by adding attribute `data-feature="feature-x"`.

For example:

```
<script type="text/whyrify" src="https://www.googletagmanager.com/gtm.js?id='XXXXX" data-feature="GTM" />
```

## Configuration

Using `WHYRIFY_CONFIG` object, you can setup reporting, and fault rate (default to 5%).

```js
window.WHYRIFY_CONFIG = {
    measurementId: "XXXX-XXXX-XXXX-XXXX-XXXX-XXXX",
    chaosChance: 0.5, //0.5%
};
```

## Measure

Finally, you can send conversion events by calling `whyrify.link`, so we can validate experiment using Bayesian stats.

```js
window.whyrify.link("conversion"); //trigger conversion
window.whyrify.link("add-to-cart"); // trigger another conversion
```
