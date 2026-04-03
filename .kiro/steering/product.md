# Product Overview

WorldBlog is a full-stack blog/social platform where users can create, share, and review location-based posts (travel, places, experiences). Users can register, log in, follow other users, create posts with ratings and images, like posts, and leave rated comments.

The app is bilingual (Spanish-dominant UI with English backend logs/docs) and is deployed via Docker Compose with a React SPA frontend and a Flask REST API backend backed by MongoDB.

## Core Features
- User authentication (register/login) with JWT stored in httpOnly cookies
- User profiles with follow/unfollow functionality
- Posts with name, location, review text, rating (0-10), and image URL
- Like/unlike posts
- Comments with content and rating on posts
- QR code generation and social sharing
- Google Maps integration for locations
