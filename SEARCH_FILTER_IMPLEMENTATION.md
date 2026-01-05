# Search and Filter Implementation

## Overview
This document describes the search and filter functionality implemented for the Trip Planner home page.

## Features Implemented

### Backend (FastAPI)
**File**: `backend/app/routers/trips.py`

Enhanced the `/trips` endpoint with the following query parameters:

- **`search`** (string, optional): Search trips by name or description (case-insensitive)
- **`min_price`** (float, optional): Filter trips with price >= min_price
- **`max_price`** (float, optional): Filter trips with price <= max_price
- **`min_rating`** (float, optional): Filter trips with rating >= min_rating

**Example API Calls:**
```bash
# Search for beach trips
GET /trips?search=beach

# Filter by price range
GET /trips?min_price=100&max_price=1000

# Filter by minimum rating
GET /trips?min_rating=4

# Combined filters
GET /trips?search=mountain&min_price=500&max_price=2000&min_rating=4.5
```

### Frontend (React + TypeScript)
**File**: `frontend/src/pages/HomePage.tsx`

#### UI Components

1. **Search Bar**
   - Full-width search input with icon
   - Debounced search (300ms delay) for better performance
   - Searches in both trip name and description
   - Modern glassmorphism design with backdrop blur

2. **Filter Toggle Button**
   - Shows/hides the filter panel
   - Visual feedback when filters are active
   - Smooth animations

3. **Filter Panel**
   - **Price Range Filter**
     - Min/Max price input fields
     - Interactive range slider
     - Real-time price display
   - **Rating Filter**
     - Quick-select buttons (All, 1+, 2+, 3+, 4+, 5+)
     - Visual highlighting of selected rating
   - Slide-down animation on open

4. **Clear Filters Button**
   - Only appears when filters are active
   - Resets all filters to default values
   - Red accent for visibility

5. **Results Display**
   - Loading spinner during data fetch
   - Trip count display
   - Empty state with helpful message
   - Responsive grid layout (1/2/3 columns)

#### Design Features

- **Premium Aesthetics**
  - Gradient backgrounds (blue → indigo → purple)
  - Glassmorphism effects with backdrop blur
  - Smooth hover animations
  - Modern rounded corners (2xl)
  - Shadow effects for depth

- **Interactive Elements**
  - Card hover effects (lift + shadow)
  - Image zoom on hover
  - Gradient text for headings
  - Rating badges with star icons
  - Gradient buttons

- **Responsive Design**
  - Mobile-first approach
  - Breakpoints: sm (640px), md (768px), lg (1024px)
  - Adaptive grid layouts
  - Touch-friendly controls

## Technical Implementation

### State Management
```typescript
interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}
```

### Debouncing
- Filters are debounced with 300ms delay
- Prevents excessive API calls during typing
- Improves performance and user experience

### API Integration
- Uses Axios for HTTP requests
- Query parameters built dynamically
- Error handling with console logging
- Loading states for better UX

## CSS Animations
**File**: `frontend/src/index.css`

Custom `slideDown` animation for filter panel:
- Smooth opacity transition
- Subtle vertical movement
- 300ms duration with ease-out timing

## Icons
Using `lucide-react` for modern, consistent icons:
- `Search` - Search input
- `SlidersHorizontal` - Filter toggle
- `X` - Clear filters
- `Star` - Rating display
- `DollarSign` - Price filter

## User Experience Highlights

1. **Instant Feedback**
   - Real-time search results
   - Visual filter states
   - Loading indicators

2. **Clear Communication**
   - Results count display
   - Empty state messaging
   - Filter status visibility

3. **Easy Reset**
   - One-click clear all filters
   - Visible when filters active
   - Returns to default state

4. **Smooth Interactions**
   - Debounced search
   - Animated transitions
   - Hover effects

## Testing the Features

1. **Start the backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   yarn dev
   ```

3. **Test scenarios:**
   - Search for trips by name
   - Filter by price range
   - Filter by minimum rating
   - Combine multiple filters
   - Clear all filters
   - Test empty states

## Future Enhancements

Potential improvements:
- Sort options (price, rating, name)
- Date range filters
- Destination/location filters
- Save filter preferences
- URL query parameters for shareable links
- Advanced search with multiple keywords
- Filter by trip duration
- Category/tags filtering
