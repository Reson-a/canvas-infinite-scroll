# Canvas Infinte Scroll

Using Double-buffered canvas to optimize rendering performance

## Usage

``` import InfiniteScrollCtx from './src/Index.ts'
    class SimpleSheet extends InfiniteScrollCtx {
      paintContent(ctx, rect, posX, posY) {
          // Implement your own method
      }
    }

    const canvas = document.getElementById('canvas')
    let sheet = new SimpleSheet(canvas)
    sheet.paint()
    canvas.addEventListener('mousewheel', e => {
      e.stopPropagation()
      sheet.moveBy(e.deltaX, e.deltaY)
    })
```

## Example

```npm run dev```


