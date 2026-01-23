import {hydrogenPreset} from '@shopify/hydrogen/react-router-preset';
import {vercelPreset} from '@vercel/react-router/vite';

/**
 * React Router 7.9.x Configuration for Hydrogen
 *
 * This configuration uses the official Hydrogen preset to provide optimal
 * React Router settings for Shopify Oxygen deployment. The preset enables
 * validated performance optimizations while ensuring compatibility.
 *
 * The Vercel preset is added for Vercel deployment support.
 */
export default {
  presets: [hydrogenPreset(), vercelPreset()],
};

/** @typedef {import('@react-router/dev/config').Config} Config */
