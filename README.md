# Masskan Murima Nexus - Property Management Platform

A comprehensive React-based property management platform built with modern web technologies.

## 🏠 Features

- **Property Listings**: Browse and manage various types of properties
- **Airbnb Integration**: Short-term rental listings and booking
- **Marketplace**: Buy and sell items locally
- **Moving Services**: Connect with local movers and logistics
- **Office Spaces**: Commercial property management
- **Admin Dashboard**: Complete admin panel for management
- **User Authentication**: Secure login and user management
- **Supabase Integration**: Real-time database and backend services

## 🚀 Technologies Used

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI components
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context + custom hooks
- **Development**: ESLint, TypeScript, Hot Module Replacement

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account (for full functionality)

### Local Development
```bash
# Clone the repository
git clone https://github.com/JimnaSafari/newflowmasskan.git
cd newflowmasskan

# Install dependencies
bun install  # or npm install

# Start development server
bun run dev  # or npm run dev
```

The app will be available at `http://localhost:8082`

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build` or `bun run build`
3. Publish directory: `masskan-murima-nexus-main/dist`
4. The `_redirects` file will handle SPA routing automatically

### Vercel
1. Import your GitHub repository
2. Vercel will automatically detect the `vercel.json` configuration
3. Deploy - no additional configuration needed

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to "Deploy from a branch"
3. Select branch and `/docs` or root folder
4. The `404.html` file handles SPA routing for GitHub Pages

## 🛠️ Build Commands

```bash
# Development
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
masskan-murima-nexus-main/
├── public/                 # Static assets
│   ├── _redirects         # Netlify redirects
│   └── 404.html           # GitHub Pages SPA fallback
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── data/             # Static data files
│   └── integrations/     # Supabase configuration
├── vercel.json           # Vercel deployment config
└── README.md
```

## 🔒 Authentication

The app uses Supabase Authentication with support for:
- Email/password login
- Social auth providers (Google, etc.)
- Role-based permissions (User, Moderator, Admin)

## 🗄️ Database Schema

Tables include:
- profiles, properties, bookings, marketplace_items
- Moving services, quotes, payments, admin logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 📞 Contact

For support or inquiries, please contact the development team.
