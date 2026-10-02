# InternIQ - React Landing Page

A modern, responsive React landing page for InternIQ, an AI-powered internship matching platform.

## 📁 Project Structure

```
interniq-react/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Steps.jsx
│   │   ├── Stats.jsx
│   │   ├── CTA.jsx
│   │   ├── Footer.jsx
│   │   ├── LoginModal.jsx
│   │   ├── SignupModal.jsx
│   │   └── styles/
│   │       ├── Navbar.css
│   │       ├── Hero.css
│   │       ├── Features.css
│   │       ├── Steps.css
│   │       ├── Stats.css
│   │       ├── CTA.css
│   │       ├── Footer.css
│   │       └── Modal.css
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory:**
```bash
cd interniq-react
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 🎯 Features Implemented

✅ **Responsive Design** - Works on all devices (mobile, tablet, desktop)
✅ **Smooth Navigation** - Sticky navbar with smooth scrolling
✅ **Hero Section** - Search bar, chips, social proof, preview card
✅ **Features Section** - AI capabilities showcase
✅ **How It Works** - 4-step process cards
✅ **Stats Counter** - Animated counters (intersection observer)
✅ **Call To Action** - Prominent CTA section
✅ **Login/Signup Modals** - Fully functional with form validation
✅ **Footer** - Complete footer with links and socials

## 🎨 Design

- **Color Scheme**: Blue (#2563eb), Purple (#4f46e5), Light backgrounds
- **Typography**: Plus Jakarta Sans font family
- **Animations**: Smooth transitions, fade-ins, slide animations
- **Icons**: SVG-based icons
- **Layout**: Grid-based responsive layouts

## 🔧 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **CSS3** - Styling (no external CSS frameworks)
- **JavaScript (ES6+)** - Logic

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Authentication

Login and Signup forms are functional with:
- Email validation
- Password confirmation
- Remember me option
- Form switching between Login and Signup

Note: Currently uses local alerts. Connect to backend API for real authentication.

## 📈 Performance

- Lazy loading with Intersection Observer
- Optimized animations using CSS
- Efficient component re-renders
- No unnecessary dependencies

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ using React + Vite**
