import localFont from 'next/font/local';

// Marcellus Font
export const marcellus = localFont({
  src: './fonts/Marcellus-Regular.ttf',
  variable: '--font-marcellus',
  display: 'swap',
});

// Metropolis Font Family (all weights and styles)
export const metropolis = localFont({
  src: [
    {
      path: './fonts/METROPOLIS-THIN.TTF',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-THINITALIC.TTF',
      weight: '100',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-EXTRALIGHT.TTF',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-EXTRALIGHTITALIC.TTF',
      weight: '200',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-LIGHT.TTF',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-LIGHTITALIC.TTF',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-REGULAR.TTF',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-REGULARITALIC.TTF',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-MEDIUM.TTF',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-MEDIUMITALIC.TTF',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-SEMIBOLD.TTF',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-SEMIBOLDITALIC.TTF',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-BOLD.TTF',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-BOLDITALIC.TTF',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-EXTRABOLD.TTF',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-EXTRABOLDITALIC.TTF',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/METROPOLIS-BLACK.TTF',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/METROPOLIS-BLACKITALIC.TTF',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-metropolis',
  display: 'swap',
});