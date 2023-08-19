# Graphics2D Plugin Strategy

## Rendering
- Support having multiple canvases, maybe have a way to assign a Layer to a canvas and have graphics objects target a layer to be rendered on
  - support rendering to offscreen canvas and copying framebuffer
- only draw when frame is dirty
- support options for applying effects when clearing canvas, such as filling with partially-transparent background
- support clipping effects, maybe consider using for lighting effects?
- support options for turning `context.imageSmoothingEnabled` off
- needs information from other components on:
  - entity transform
  - entity size
- when components are added, they should find their target layer as determined by the Entity Hierarchy
- should have option to draw rectangles around all sprites for debugging purposes
  - could also implement this in an HTML plugin separate from this one so that we can intercept clicks

### Components
- sprite
  - imageAsset / Animation
- shapes:
  - fill: boolean
  - fillStyle: string
  - subtypes:
    - rectangle
      - x1
      - y1
      - x2
      - y2
    - circle
      - x
      - y
      - raduis
- layer
  - @TODO figure out how to have this target a particular canvas. This can be a later addition given that we're going to default to the main canvas normally

## Reference
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
  - MDN Guide on Canvas Tutorial. Contains good ideas and best practices