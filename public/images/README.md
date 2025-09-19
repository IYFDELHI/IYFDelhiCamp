# Camp Images Directory

Place your actual Braj camp photos in this directory. For best results, use high-quality images with the following specifications:

- Format: JPG or PNG
- Size: 1920x1080 pixels (16:9 aspect ratio)
- File naming: camp1.jpg, camp2.jpg, camp3.jpg, etc.

After adding your images, update the Slider component in `src/components/Slider.tsx` to use your local images:

```javascript
const images = [
  '/images/camp1.jpg',
  '/images/camp2.jpg',
  '/images/camp3.jpg'
];
```

This will replace the placeholder Unsplash images with your actual camp photos.