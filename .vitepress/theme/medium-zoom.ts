import mediumZoom from 'medium-zoom'

let zoom: ReturnType<typeof mediumZoom> | null = null

export function initMediumZoom() {
  if (zoom) zoom.detach()

  zoom = mediumZoom('.vp-doc img:not(.medium-zoom-image)', {
    background: 'rgba(0, 0, 0, 0.85)',
    margin: 24,
  })

  zoom.attach()
}
