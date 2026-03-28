// CDN base URL — images served from public/cdn/ (works in both dev and production)
export const CDN = '/cdn'
export const LOGO_PATH = '/logo/shunmuga-steel-logo.png'

export const cdnImg = (filename) => `${CDN}/${filename}`

// Product image map — maps product slugs to their CDN filenames
export const PRODUCT_IMAGES = {
  'hr-coils': 'hot-rolled-coils-sheets-bannerb1f5.jpg',
  'hr-sheets': 'hot-rolled-coils-sheets-bannerc5c5.jpg',
  'cr-coils': 'cold-rolled-steel072e.jpg',
  'cr-sheets': 'cold-rolled-steel-12ba9.jpg',
  'gp-sheets': 'galvanized-steel-sheets47fe.png',
  'gp-coils': 'gpsheetcoilc6bd.jpg',
  'gc-sheets': 'galvanized-corrugated-sheets7d36.jpg',
  'ppgl-colour-coils': 'Color-Coated-Coilsb58b.jpg',
  'colour-coils': 'color-coilb85d.png',
  'gp-slitted-coil': 'gp-slit-coil-952cf2f.jpg',
  'cr-slitted-coil': '0-25mm-cold-rolled-coil-1000x1000cf88.jpg',
  'decking-sheets': 'decking-sheets-17e37.jpg',
  'puf-panels': 'PUF-Panels8be3.png',
  'upvc-sheets': 'UPVC-Sheet46e3.png',
  'polycarbonate-sheets': 'polycarbonate-sheets-1b014.jpg',
  'purlin': 'purlinc517.jpg',
  'roofing-screws': 'screws1580.jpg',
  'turbo-ventilator': 'Turbo-Fan12e6.jpg',
  'roofing-accessories': 'roofing-accessories-types0572.jpg',
}

export const BRAND_LOGOS = {
  SAIL: 'SAIL_LOGO_NEW3c71.png',
  AMNS: 'amnse3b1.png',
  JSW: 'jsw59f5.png',
  Evonith: 'evonith310e.png',
}
