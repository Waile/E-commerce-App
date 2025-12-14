# E-commerce App

This is a React Native shopping app I built for the Xihawks assessment. It's a full-featured e-commerce experience where you can browse products, search and filter by category, manage your cart, and complete checkout with a simple form.

## What's Inside

**Main Features:**
- Browse products in a grid layout
- Search products by name
- Filter by categories
- View product details with image gallery (swipe through multiple images)
- Add items to cart and adjust quantities
- Checkout form with validation
- Pull down to refresh products
- Your cart saves automatically even if you close the app

**Tech I Used:**
- TypeScript (because type safety matters)
- Redux Toolkit (makes state management way cleaner)
- React Navigation (bottom tabs + stack navigation)
- DummyJSON API for product data
- AsyncStorage to persist the cart

## Dependencies

- React Native 0.83.0
- TypeScript 5.8.3
- Redux Toolkit 2.5.0
- React Navigation 7.x
- Axios 1.7.9
- AsyncStorage 2.1.0

## API

I'm using the DummyJSON API (https://dummyjson.com) because it has good product data with images, ratings, and supports search/filtering out of the box. No auth needed which keeps things simple.

## Project Structure

```
src/
├── components/       # Reusable stuff like ProductCard, SearchBar, etc.
├── screens/          # Main screens (ProductList, ProductDetail, Cart, Checkout)
├── navigation/       # Tab and stack navigators
├── store/            # Redux setup with products and cart slices
├── services/         # API calls to DummyJSON
├── types/            # TypeScript interfaces
├── theme/            # Colors and spacing constants
├── context/          # Theme context for dark/light mode
└── hooks/            # Custom hooks
```

## How to Run

**Prerequisites:**
- Node.js (v20 or higher)
- React Native dev environment setup
- Android Studio or Xcode

**Setup:**

1. Clone and install:
```bash
git clone <repo-url>
cd EcommerceApp
npm install
```

2. For iOS (Mac only):
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

**Run it:**

```bash
# Android
npm run android

# iOS
npm run ios

# Or start Metro manually
npm start
```

## Design Decisions

**Why Redux Toolkit?**
I went with Redux over Context API because the cart updates frequently and Redux handles that better. Plus the DevTools are really helpful for debugging. The store has two slices - one for products (fetching, search, filters) and one for cart (with AsyncStorage persistence).

**Navigation:**
Bottom tabs for Products and Cart, with stack navigators nested inside for detail screens. Pretty standard mobile app pattern.

**Components:**
I tried to keep components small and reusable. Things like ProductCard and SearchBar are used in multiple places. Theme colors are in one file so they're easy to change.

**Error Handling:**
Network errors show a friendly message with a retry button. Form validation gives immediate feedback. Loading spinners show up when fetching data.

## Notable Features

**Cart Persistence:**
Your cart automatically saves to AsyncStorage whenever you add/remove items. When you reopen the app, everything's still there.

**Image Gallery:**
Product details show all available images. You can tap thumbnails or swipe through them.

**Search & Filtering:**
Search works in real-time and the API handles it server-side. Category filtering is instant. If you clear the search, products automatically restore.

**Form Validation:**
The checkout form checks for valid email format, proper phone numbers (11+ digits), and makes sure all required fields are filled.

**Dark/Light Mode:**
Toggle between themes using the sun/moon icon in the header. Your preference is saved.

## Building for Production

**Android APK:**
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

**iOS:**
Open `ios/EcommerceApp.xcworkspace` in Xcode and archive for release.

## Time Spent

Roughly 11-12 hours total:
- Initial setup and architecture: ~1 hour
- Redux store and API integration: ~2 hours
- Building components: ~2 hours
- Implementing screens: ~3 hours
- Dark mode and theme system: ~1.5 hours
- Testing and fixes: ~2 hours

## What Could Be Added

- User authentication
- Order history
- Product favorites
- Real payment integration
- More comprehensive tests
- Animations and transitions

## Notes

- This is a demo app - no real payment processing
- Products come from DummyJSON API
- Cart only saves locally (no backend)
- No login required

## Troubleshooting

If something's not working:
- Make sure Node is v20+
- Run `npm install` again
- Check that Metro bundler is running
- Verify your emulator/device is connected
- Try `npm start -- --reset-cache`

---

Built for the Xihawks React Native Developer Assessment
