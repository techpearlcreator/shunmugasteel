export const CDN = '/cdn'
export const LOGO_PATH = '/logo/new-SS-logo.webp'

// Automatically serve .webp if a WebP version exists (all images have been converted)
export const cdnImg = (filename) =>
  `${CDN}/${filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`

export const PRODUCT_IMAGES = {
  'hr-coils':             'hot-rolled-coils-sheets-bannerb1f5.webp',
  'hr-sheets':            'hot-rolled-coils-sheets-bannerc5c5.webp',
  'cr-coils':             'cold-rolled-steel072e.webp',
  'cr-sheets':            'cold-rolled-steel-12ba9.webp',
  'gp-sheets':            'galvanized-steel-sheets47fe.webp',
  'gp-coils':             'gpsheetcoilc6bd.webp',
  'gc-sheets':            'galvanized-corrugated-sheets7d36.webp',
  'ppgl-colour-coils':    'Color-Coated-Coilsb58b.webp',
  'colour-coils':         'color-coilb85d.webp',
  'gp-slitted-coil':      'gp-slit-coil-952cf2f.webp',
  'cr-slitted-coil':      '0-25mm-cold-rolled-coil-1000x1000cf88.webp',
  'decking-sheets':       'decking-sheets-17e37.webp',
  'puf-panels':           'PUF-Panels8be3.webp',
  'upvc-sheets':          'UPVC-Sheet46e3.webp',
  'polycarbonate-sheets': 'polycarbonate-sheets-1b014.webp',
  'purlin':               'purlinc517.webp',
  'roofing-screws':       'screws1580.webp',
  'turbo-ventilator':     'Turbo-Fan12e6.webp',
  'roofing-accessories':  'roofing-accessories-types0572.webp',
}

export const BRAND_LOGOS = {
  SAIL:    'SAIL_LOGO_NEW3c71.webp',
  AMNS:    'amnse3b1.webp',
  JSW:     'jsw59f5.webp',
  Evonith: 'evonith310e.webp',
}
