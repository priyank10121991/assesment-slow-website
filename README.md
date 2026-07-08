# TrailGear Performance Optimization

## Issues Identified

- Duplicate jQuery
- Unused JavaScript libraries
- Large image assets
- Synchronous XHR
- Rendering large number of reviews
- Inefficient particle animation
- Layout thrashing
- Memory leak due to event listeners
- Product images loading eagerly

## Changes Made

- Removed duplicate jQuery
- Removed unused libraries
- Added lazy loading for images
- Optimized review rendering
- Replaced synchronous request with asynchronous loading
- Optimized particle animation
- Improved event listener management
- Reduced unnecessary DOM updates

## Assumptions

- Rendered only the initial set of reviews for better performance.
- Kept the overall UI unchanged.

## Lighthouse

Before
Performance : XX

After
Performance : XX

## Screenshots

(Add Before & After screenshots)
