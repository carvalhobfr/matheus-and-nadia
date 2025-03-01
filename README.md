# Matheus & Nadia's Wedding Website

A beautiful, responsive wedding website built with React and Vite, featuring:

- Multilingual support (English, Portuguese, and Spanish)
- Countdown to the wedding day
- Our story timeline
- Event details
- Photo gallery
- Gift registry with payment options (MBWay, Pix, and Bizum)
- RSVP form

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/wedding-website.git
cd wedding-website
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Customization

### Changing Content

Most of the website content can be modified in the translation files:

- Edit `src/i18n.js` to update text in all languages

### Adding Real Images

- Replace the placeholder in `src/assets/hero-bg.jpg` with your own hero image
- Add real photos to the gallery by updating the `placeholderImages` array in `src/components/Gallery.jsx`

### Changing Colors

- Edit the CSS variables in `src/index.css` to change the color scheme

```css
:root {
  --primary-color: #FF6B6B;
  --secondary-color: #4ECDC4;
  --accent-color: #FFE66D;
  /* ... other variables */
}
```

## Deployment

Build the project for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, which you can deploy to any static hosting service like Netlify, Vercel, or GitHub Pages.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Styled with Bootstrap
- Icons from Font Awesome
- Animations with AOS
- Internationalization with i18next
