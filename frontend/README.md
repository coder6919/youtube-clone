# 🎨 YouTube Clone - Frontend

The client-side application built with React (Vite) and Tailwind CSS. It focuses on a responsive, high-performance user experience with optimistic UI updates.

### 📦 External Packages & Justification ###

### react-router-dom

Purpose: Handles client-side routing (Video Page, Channel Page, Search) without page reloads.

### axios

Purpose: Handles HTTP requests. Configured with an interceptor to automatically attach JWT tokens to protected requests.

### plyr-react

Purpose: Provides a customizable, accessible video player with "YouTube-like" features (Speed, Theater mode).

### react-icons

Purpose: Provides vector icons (FaTrash, FaEdit, BiLike) to keep the app lightweight compared to image icons.

### react-toastify

Purpose: Displays non-intrusive toast notifications for success/error messages (e.g., "Video Uploaded").

### date-fns

Purpose: (Optional) Used for formatting dates (e.g., "2 days ago") if implemented.

# 🗂️ Folder Structure ###

```src/
├── assets/            # Static images (Logos)
├── components/        # Reusable UI Elements
│   ├── Navbar.jsx     # Search bar, User Avatar, Logout logic
│   ├── Sidebar.jsx    # Collapsible navigation menu
│   ├── VideoCard.jsx  # Thumbnail display component
│   └── CommentList.jsx# Handles CRUD operations for comments
├── pages/             # Full Page Views
│   ├── Home.jsx       # Video Grid with Category Filters & Search
│   ├── VideoDetail.jsx# Video Player, Description, Like/Dislike logic
│   ├── Channel.jsx    # Channel Banner, Stats, and "Manage Video" dashboard
│   ├── Login.jsx      # Authentication forms
│   └── CreateChannel.jsx # Channel initialization form
├── utils/
│   └── axios.js       # Pre-configured Axios instance with Base URL
├── App.jsx            # Route definitions and Layout Shell
└── main.jsx           # Entry point
```

🌟 Key Implementation Details

# 1. Optimistic UI Updates ###

For Likes, Dislikes, and Views, the frontend updates the UI state immediately when the user clicks, without waiting for the database response. This makes the app feel instant. If the API call fails, the state reverts automatically.

# 2. Cloudinary Upload Widget ###

We use a custom file handler in Channel.jsx that sends FormData to our backend. The backend uploads to Cloudinary and returns a secure https URL, which is then rendered immediately in the form for preview.

# 3. The Video Player (Plyr) ###

Instead of the native HTML5 <video> tag, we wrapped plyr-react in a useMemo hook. This ensures the player doesn't reload or reset playback when the user interacts with other parts of the page (like hitting the Like button).

# 4. Search & Filter Logic###

The Home.jsx component uses useSearchParams to manage URL state. It intelligently clears the search query when a user clicks a category filter to prevent conflicting logic.

# 🚀 Running Locally ###

### Install dependencies
npm install

### Start Development Server
npm run dev
