# Charts, maps, and visualizations - Shakespeare and Company Project

This repository is used to publish a static site with interactive
charts, maps, and visualizations associated with the [Shakespeare and Company Project](https://shakespeareandco.princeton.edu/).

They are published primarily for the purpose of embedding them in other publications that don't natively support interactive content.


## Documentation

Each article with figures should have a landing page with a list of figures
and the embed code needed to add those figures to an article. Figures should
be in separate, nested pages that contain only the content to be displayed in an iframe.

Use directories and index.html files to generate clean urls.

Figures that require javascript should provide a static image in a `<noscript>` tag	for fallbck display.

Embed code should use iframes. To make iframes responsive, use 100% width
and an inline style to set an appropriate aspect ratio. Set min and max width
where appropriate.

For accessibility, iframes should have title attributes and the loaded document
should also have an appropriate title.


### Notes

How to make Altair/Vega charts responsive:

```css
canvas.marks {
    max-width: 100%!important;
    height: auto!important;
}
```

(possibly does not need the `!important`)

Recommend setting a min-width of `375px`

