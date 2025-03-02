# Matheus & Nadia's Wedding Website

A beautiful, responsive wedding website built with React and Vite, featuring:

- Multilingual support (English, Portuguese, and Spanish)
- Countdown to the wedding day
- Our story timeline
- Event details
- Photo gallery
- Gift registry with payment options (MBWay, Pix, and Bizum)
- RSVP form
- Admin panel for managing website images, texts, and theme colors

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

### Admin Panel

The website includes a comprehensive admin panel that allows you to manage both images and text content without editing code:

1. Access the admin panel by navigating to `/admin` (e.g., `http://localhost:5173/admin`)
2. Login with the default credentials:
   - Username: `admin`
   - Password: `admin123`
3. From the admin panel, you can:
   - Manage Images: Update any image across the website
   - Edit Texts: Modify all website text in all supported languages
   - Theme Colors: View the color palette and where each color is used throughout the website

> **Security Note**: For a production website, you should change the default admin credentials in `src/contexts/AuthContext.jsx` before deploying.

### Changing Images

From the admin panel's "Manage Images" tab, you can:
- See all images organized by category (Hero, Story, Gifts, Gallery)
- View where each image is used in the website
- Update any image by providing a new URL
- Preview the change before saving
- Reset all images to their default values if needed

### Editing Texts

From the admin panel's "Manage Texts" tab, you can:
- Select any of the supported languages (English, Portuguese, Spanish)
- Choose a section of the website to edit
- Update text values, including headers, descriptions, and dates
- Changes are applied immediately and saved in browser storage
- Reset all texts to their default values if needed

### Changing Colors

From the admin panel's "Cores do Tema" (Theme Colors) tab, you can:
- View the current color palette used throughout the website
- See detailed information about each color including variable name and hex value
- Find examples of where each color is used in different components
- Browse suggested Thailand-inspired color palettes to see previews
- View your history of the last 10 color palettes you've explored
- **Preview colors in real-time** by activating the preview mode to see how the site will look with different color schemes
- **View component examples** with the selected color palette without leaving the admin panel
- Get tips for creating harmonious color combinations

To change colors:
1. Navigate to the "Cores do Tema" tab in the admin panel
2. Toggle on the "Ativar Prévia" switch at the top of the page to enable real-time preview mode
3. Click on any suggested palette or historical palette to apply those colors to the site temporarily
4. Browse the website normally to see how the new colors affect every element
5. Alternatively, use the "Mostrar Prévia" button in the Component Preview section to see a demonstration of key site components with the selected colors, all within the admin panel
6. When you find a palette you like, note the color values to permanently apply them by editing `src/index.css`

The preview mode is temporary and colors will revert back to the original theme when you:
- Toggle off the preview switch
- Navigate away from the admin panel
- Refresh the page

```css
:root {
  --primary-color: #3D2314;
  --secondary-color: #8B5A2B;
  --accent-color: #D4AF37;
  --text-color: #2A2A2A;
  --light-color: #F7F5F0;
  --dark-color: #271409;
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
