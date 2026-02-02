# ASTRAL: NOSTROMO V2

## 🚀 Senior-Level Portfolio Architecture

Modern, scalable, and production-ready portfolio website with sci-fi aesthetics. Built with enterprise-grade architecture and best practices.

---

## 📁 Project Structure

```
astral-portfolio/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation/
│   │   ├── Marquee/
│   │   └── Sections/
│   ├── features/            # Feature modules
│   │   ├── cursor/
│   │   ├── loader/
│   │   ├── particles/
│   │   ├── atmosphere/
│   │   └── tracker/
│   ├── lib/                 # Third-party integrations
│   │   └── AnimationEngine.ts
│   ├── utils/               # Utility functions
│   │   ├── dom.ts
│   │   ├── math.ts
│   │   └── animation.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── constants/           # Configuration & data
│   │   ├── data.ts
│   │   └── config.ts
│   ├── styles/              # Global styles
│   │   ├── main.scss
│   │   └── variables.scss
│   └── main.ts              # Application entry point
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🏗️ Architecture Highlights

### 🎯 **Design Patterns**

- **Component-Based Architecture**: Modular, reusable components
- **Separation of Concerns**: Clear boundaries between features, components, and utilities
- **Singleton Pattern**: Animation engine instance management
- **Factory Pattern**: Dynamic component creation
- **Event Delegation**: Optimized event handling

### 💎 **Code Quality**

- ✅ **TypeScript**: Full type safety
- ✅ **ESLint**: Code quality enforcement
- ✅ **Prettier**: Consistent formatting
- ✅ **Path Aliases**: Clean imports (`@components`, `@utils`, etc.)
- ✅ **SCSS Variables**: Centralized styling constants

### ⚡ **Performance**

- **Code Splitting**: Vendor chunks separation
- **GSAP QuickSetters**: Optimized animations (60fps)
- **Event Delegation**: Reduced memory overhead
- **Canvas Optimization**: Efficient particle rendering
- **Lazy Evaluation**: Deferred initialization

### 🧩 **Modularity**

Each feature is self-contained and can be:
- Independently tested
- Easily removed or replaced
- Reused across projects
- Extended without affecting other modules

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Build Tool** | Vite 5.x |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS + SCSS |
| **Animation** | GSAP 3.x + ScrollTrigger |
| **Smooth Scroll** | Lenis |
| **Icons** | Lucide (npm) |
| **Linting** | ESLint + Prettier |

---

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🎨 Key Features

### 1. **Custom Cursor System**
- Smooth tracking with GSAP
- Interactive states (hover, hold)
- Performance-optimized with `quickSetter`

### 2. **Particle Physics (Custom-Built)**
- 130+ dynamic particles
- Black hole warp effect on mouse hold
- Ambient drift mode
- Distance-based connections
- Optimized canvas rendering

### 3. **Smooth Scrolling (Lenis)**
- Buttery smooth scroll experience
- Synced with GSAP ScrollTrigger
- Customizable easing and duration
- Touch-friendly on mobile

### 4. **Horizontal Scroll Projects**
- GSAP ScrollTrigger pinning
- Smooth snap points
- File system aesthetic
- Grayscale-to-color transitions

### 5. **Motion Tracker**
- Radar-style UI
- Dual-blip eye tracking
- Smooth radial grid animation
- Cinematic sci-fi feel

### 6. **Boot Sequence**
- Terminal-style loading
- Progressive text reveal
- Progress bar animation
- Seamless transition to main content

---

## 🔧 Configuration

### **Animation Settings**
Edit `src/constants/config.ts`:
```typescript
export const ANIMATION_CONFIG = {
  cursor: { ringFollowDuration: 0.15 },
  particles: { count: 130, warpForce: 1200 },
  // ... more configs
}
```

### **Project Data**
Edit `src/constants/data.ts`:
```typescript
export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    title: 'NEBULA',
    category: 'FINTECH',
    // ... project details
  }
]
```

---

## 🎯 Best Practices Implemented

✅ **Type Safety**: Strict TypeScript configuration  
✅ **Immutability**: `as const` for configuration objects  
✅ **Error Handling**: Required element checks with meaningful errors  
✅ **Performance**: RAF optimization, throttle/debounce utilities  
✅ **Accessibility**: Semantic HTML, keyboard navigation support  
✅ **Responsiveness**: Mobile-first approach with breakpoint system  
✅ **Maintainability**: Clear naming, documentation, single responsibility  

---

## 🚀 Production Deployment

```bash
# Build optimized bundle
npm run build

# Output: dist/
# - Minified JavaScript
# - Vendor chunk separation
# - Optimized CSS
# - Source maps (optional)
```

### **Deployment Targets**
- Vercel / Netlify (recommended)
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

---

## 📚 Advanced Usage

### **Adding New Sections**

1. Create component in `src/components/Sections/`
2. Import in `src/main.ts`
3. Mount in app initialization
4. Add scroll triggers if needed

### **Custom Animations**

```typescript
import { AnimationEngine } from '@lib/AnimationEngine';

const engine = AnimationEngine.getInstance();
engine.reveal('.my-element', {
  duration: 2,
  ease: 'power3.out'
});
```

### **Extending Particle System**

```typescript
// src/features/particles/ParticleSystem.ts
// Modify updateParticle() or drawConnections()
```

---

## 🐛 Debugging

Enable source maps in `vite.config.ts`:
```typescript
build: {
  sourcemap: true
}
```

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 👨‍💻 Author

**Senior Full-Stack Developer**  
Enterprise-grade architecture | Performance optimization | Modern web standards

---

## 🔗 Resources

- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [GSAP Docs](https://greensock.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with precision. Engineered for scale. 🚀**
