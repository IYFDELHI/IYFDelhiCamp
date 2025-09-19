# ISKON Youth Forum - Braj Camps Website

A modern, aesthetic website for ISKON Youth Forum's Braj Camps with Razorpay integration.

## Features

- Responsive design with modern aesthetic
- Homepage with image slider
- About page with camp information
- Registration page with Razorpay payment integration
- Mobile-friendly layout
- Glassmorphism and neumorphism design elements

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory with your Razorpay credentials:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. Add your camp images:
   - Place your high-quality camp photos in the `public/images` directory
   - Recommended size: 1920x1080 pixels (16:9 aspect ratio)
   - Update the image paths in `src/components/Slider.tsx` to use your local images

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

To deploy this website, you can use Vercel, Netlify, or any other hosting platform that supports Next.js.

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Razorpay for payment processing

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── razorpay/
│   │   └── verify-payment/
│   ├── about/
│   ├── register/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── Slider.tsx
└── styles/
    └── globals.css
```

## Customization

To customize the website:

1. Replace placeholder images with actual camp photos
2. Update content in the About and Registration pages
3. Modify color scheme in `globals.css`
4. Adjust styling to match your brand guidelines

## Payment Integration

The website uses Razorpay for payment processing. To enable real payments:

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Obtain your API keys from the Razorpay dashboard
3. Update the environment variables with your actual keys
4. Test the integration with Razorpay's test mode
5. Switch to live mode when ready

## Design Elements

This website incorporates premium UI design elements:

- **Glassmorphism**: Translucent UI elements with blur effects
- **Neumorphism**: Soft, extruded plastic design elements
- **Modern Aesthetic**: Clean, professional appearance without flashy effects
- **Responsive Design**: Works on all device sizes

## Support

For any issues or questions, please contact the development team.