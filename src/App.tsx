/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Minus, 
  X, 
  Check, 
  ChevronRight, 
  Pizza as PizzaIcon, 
  MapPin, 
  Utensils, 
  Timer, 
  Sparkles,
  Search,
  ExternalLink,
  Plug,
  Phone,
  Mail
} from 'lucide-react';

// Selected menu pizza cards representation
interface PizzaMenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  attributes: string[];
  image: string;
  origin: string;
}

const MENU_ITEMS: PizzaMenuItem[] = [
  {
    id: 'diavola',
    name: 'Diavola Rustica',
    price: '$24',
    description: 'Spicy salame, nduja sausage paste, fior di latte, hot honey glaze, wild mountain oregano.',
    attributes: ['Spicy', 'Chef Special'],
    image: "/diavola.avif",
    origin: 'Calabrian Hills, IT'
  },
  {
    id: 'tartufo',
    name: 'Tartufo Bianco',
    price: '$28',
    description: 'Black truffle crema, wild forest mushrooms, fresh burrata ball, caramelised cipollini onions.',
    attributes: ['V', 'White Base'],
    image: "/tartufo.avif",
    origin: 'Umbrian Woods, IT'
  },
  {
    id: 'marinara',
    name: 'Saporita Marinara',
    price: '$19',
    description: 'Double San Marzano tomatoes, shaved heirloom garlic, saltwater anchovies, capers, wild black olives.',
    attributes: ['Dairy-Free', 'Robust'],
    image: "/marinara.avif",
    origin: 'Amalfi Coast, IT'
  },
  {
    id: 'fichi',
    name: 'Fig & Prosciutto Crudo',
    price: '$26',
    description: 'White base crust, sweet mission figs, 24-month aged Prosciutto di Parma, arugula, goat cheese crumble.',
    attributes: ['Seasonal', 'Sweet & Savory'],
    image: "/fichi.avif",
    origin: 'Emilia-Romagna, IT'
  },
  {
    id: 'margherita',
    name: 'Margherita D.O.P.',
    price: '$21',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, hand-torn basil, extra virgin olive oil.',
    attributes: ['V', 'DOP', 'Traditional'],
    image: "/margherita.avif",
    origin: 'Campania Region, IT'
  },
  {
    id: 'quattro',
    name: 'Quattro Formaggi Dolce',
    price: '$25',
    description: 'Gorgonzola dolce, fresh fior di latte, aged pecorino romano, toasted walnuts, local organic honey crumble.',
    attributes: ['V', 'White Base', 'Sweet & Savory'],
    image: "/quattro.avif",
    origin: 'Lazio Region, IT'
  },
  {
    id: 'seafood',
    name: 'Frutti di Mare Nero',
    price: '$32',
    description: 'Artisan sea salt sourdough, sweet tiger prawns, calamari rings, garlic butter infusion, fresh parsley zest.',
    attributes: ['Premium', 'Seafood'],
    image: "/seafood.avif",
    origin: 'Sicily Coastline, IT'
  },
  {
    id: 'vesuvio',
    name: 'Vesuvio Carne',
    price: '$27',
    description: 'Crushed San Marzano tomatoes, wild boar nduja paste, smoked provola cheese, fire-roasted sweet peppers.',
    attributes: ['Spicy', 'Hearty'],
    image: "/vesuvio.avif",
    origin: 'Mount Vesuvio, IT'
  },
  {
    id: 'verde',
    name: 'Verde Selvaggia',
    price: '$23',
    description: 'House-made wild ramp pesto, shaved asparagus curls, zucchini blossoms, toasted pine nuts, cold-pressed olive oil.',
    attributes: ['V', 'Pesto Base', 'Fresh'],
    image: "/verde.avif",
    origin: 'Piedmont Valleys, IT'
  }
];

export default function App() {
  // Current UTC reservation initial values based on current time (June 4, 2026)
  const [selectedDate, setSelectedDate] = useState<string>("Thu, 04 Jun 2026");
  const [selectedTime, setSelectedTime] = useState<string>("07:30 PM");
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  
  // Interaction States
  const [openedDropdown, setOpenedDropdown] = useState<'date' | 'time' | 'guests' | null>(null);
  const [activeMenuIdx, setActiveMenuIdx] = useState<number>(4);
  const [displayedMenuIdx, setDisplayedMenuIdx] = useState<number>(4);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [showMenuDrawer, setShowMenuDrawer] = useState<boolean>(false);
  const [showBookingSuccessModal, setShowBookingSuccessModal] = useState<boolean>(false);
  
  const lastWheelTime = React.useRef<number>(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  
  // Drag/Swipe Gesture tracking
  const isDragging = React.useRef<boolean>(false);
  const startX = React.useRef<number>(0);
  const dragThreshold = 40; // minimum movement to switch cards

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    
    if (Math.abs(diff) > dragThreshold) {
      if (diff > 0) {
        setActiveMenuIdx((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : prev));
      } else {
        setActiveMenuIdx((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = e.clientX;
    const diff = startX.current - endX;
    
    if (Math.abs(diff) > dragThreshold) {
      if (diff > 0) {
        setActiveMenuIdx((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : prev));
      } else {
        setActiveMenuIdx((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
  };

  // 1. Text Cross-fade effect when selected card changes
  useEffect(() => {
    if (activeMenuIdx !== displayedMenuIdx) {
      setFadeState('fade-out');
      const timer = setTimeout(() => {
        setDisplayedMenuIdx(activeMenuIdx);
        setFadeState('fade-in');
      }, 200); // quick & smooth cross-fade duration
      return () => clearTimeout(timer);
    }
  }, [activeMenuIdx, displayedMenuIdx]);

  // 2. Wheel Scrolling directly over the carousel with fine-tuned cooldown
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      const now = Date.now();
      // Ensure we have a smooth, controlled flow through cards or ignore too fast spikes
      if (now - lastWheelTime.current < 450) {
        e.preventDefault();
        return;
      }
      
      const threshold = 12;
      const dx = Math.abs(e.deltaX);
      const dy = Math.abs(e.deltaY);
      
      if (dx > threshold || dy > threshold) {
        e.preventDefault();
        if (e.deltaX > threshold || e.deltaY > threshold) {
          setActiveMenuIdx((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : prev));
          lastWheelTime.current = now;
        } else if (e.deltaX < -threshold || e.deltaY < -threshold) {
          setActiveMenuIdx((prev) => (prev > 0 ? prev - 1 : prev));
          lastWheelTime.current = now;
        }
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelNative);
    };
  }, []);

  // 3. Keep the active card centered in view smoothly on activeMenuIdx changes
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    
    const innerContainer = container.children[0] as HTMLElement;
    if (!innerContainer) return;
    const activeChild = innerContainer.children[activeMenuIdx] as HTMLElement;
    if (!activeChild) return;
    
    const containerWidth = container.offsetWidth;
    const childWidth = activeChild.offsetWidth;
    const childOffsetLeft = activeChild.offsetLeft;
    
    const targetScrollLeft = childOffsetLeft - (containerWidth / 2) + (childWidth / 2);
    
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  }, [activeMenuIdx]);
  
  // Booking Customizations inside confirmation modal
  const [tablePreference, setTablePreference] = useState<string>("Woodfire Oven Seat");
  const [preOrderedPizza, setPreOrderedPizza] = useState<string>("margherita");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  // Generating beautiful upcoming booking date selections
  const availableDates = [
    { day: "Thu", dateStr: "04 Jun 2026", label: "Thu, 04 Jun (Today)" },
    { day: "Fri", dateStr: "05 Jun 2026", label: "Fri, 05 Jun" },
    { day: "Sat", dateStr: "06 Jun 2026", label: "Sat, 06 Jun (Weekend)" },
    { day: "Sun", dateStr: "07 Jun 2026", label: "Sun, 07 Jun (Weekend)" },
    { day: "Mon", dateStr: "08 Jun 2026", label: "Mon, 08 Jun" },
    { day: "Tue", dateStr: "09 Jun 2026", label: "Tue, 09 Jun" },
    { day: "Wed", dateStr: "10 Jun 2026", label: "Wed, 10 Jun" },
  ];

  const availableTimes = [
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", 
    "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", 
    "09:00 PM", "09:30 PM", "10:00 PM"
  ];

  // Dynamically change Wait Time status indicator based on guest size & date
  const getWaitTimeText = () => {
    const totalGuests = adultsCount + childrenCount;
    if (totalGuests >= 6) return "35-45 MINS";
    if (totalGuests >= 4) return "20-25 MINS";
    if (selectedTime.startsWith("07") || selectedTime.startsWith("08")) return "15-20 MINS";
    return "5-10 MINS";
  };

  const getGuestsSummaryText = () => {
    const totalGuests = adultsCount + childrenCount;
    const adultsText = `${adultsCount} Adult${adultsCount > 1 ? 's' : ''}`;
    const childrenText = childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}` : '';
    return `${adultsText}${childrenText}`;
  };

  // Close any opened dropdowns on click outside (fallback helper)
  const closeAllDropdowns = () => {
    setOpenedDropdown(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenedDropdown(null);
    setShowBookingSuccessModal(true);
  };

  return (
    <div id="app-root" className="relative w-full min-h-screen bg-black text-white font-jakarta flex flex-col justify-between overflow-x-hidden selection:bg-[#EBE3D5] selection:text-black">
      
      {/* Hero Section Container with its own isolated local video background */}
      <div id="hero-wrapper" className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Autoplay Infinite Loop Video Wrapper */}
        <div id="bg-video-wrapper" className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/hero.mp4"
            className="w-full h-full object-cover opacity-85"
            style={{ clipPath: 'inset(0% 0% 6% 0%)' }}
          />
          {/* Cinematic ambient overlay for supreme readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-[#050505]/95 z-10" />
        </div>

        {/* Structural Decorative Grid Lines (From Immersive UI theme) */}
        <div id="grid-lines" className="absolute inset-0 grid grid-cols-4 pointer-events-none z-10">
          <div className="border-r border-white/5"></div>
          <div className="border-r border-white/5"></div>
          <div className="border-r border-white/5"></div>
          <div></div>
        </div>

        {/* Top Navigation Bar */}
        <header id="nav-header" className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-5 sm:py-6 border-b border-white/5 bg-black/10 backdrop-blur-sm">
        {/* The Pizza Plug Typography Logo with custom stylized Plug design */}
        <div id="brand-logo" className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.25)] group-hover:border-red-500 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all duration-300">
            <Plug className="w-4 h-4 text-red-500 group-hover:text-red-400 group-hover:rotate-12 transition-all duration-300" />
          </div>
          <div className="flex flex-col items-start leading-[0.8] select-none">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.25em] text-red-500 font-syne transition-colors duration-300 group-hover:text-white">THE PIZZA</span>
            <span className="text-[17px] font-black uppercase font-bebas text-[#EBE3D5] tracking-widest leading-none mt-0.5 transition-transform duration-300 group-hover:translate-x-0.5">PLUG</span>
          </div>
        </div>

        {/* Central Nav Links */}
        <nav id="nav-links" className="hidden md:flex items-center gap-1 sm:gap-4 text-xs font-semibold uppercase tracking-widest text-[#EBE3D5]/50">
          <button 
            id="nav-link-home"
            className="px-5 py-2 hover:text-white transition-all cursor-pointer font-syne flex items-center gap-1.5 focus:outline-none"
            onClick={() => { setShowMenuDrawer(false); closeAllDropdowns(); }}
          >
            Home
          </button>
          
          {/* Active outline pill menu as requested by layout reference image */}
          <button 
            id="nav-link-menu"
            className="px-5 py-2 border border-[#EBE3D5]/35 text-[#EBE3D5] rounded-full hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer font-syne focus:outline-none flex items-center gap-1.5"
            onClick={() => {
              const el = document.getElementById('menu-carousel-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <PizzaIcon className="w-3.5 h-3.5" />
            Menu
          </button>
          
          <button 
            id="nav-link-contact"
            className="px-5 py-2 hover:text-white transition-all cursor-pointer font-syne focus:outline-none"
            onClick={() => {
              const el = document.getElementById('footer-strip');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact
          </button>
        </nav>

        {/* Action Button - Immersive UI Style */}
        <div id="header-action">
          <button 
            id="order-now-btn"
            className="px-5 py-2 border border-[#EBE3D5]/20 text-xs text-[#EBE3D5] uppercase tracking-widest hover:bg-[#EBE3D5] hover:text-black hover:border-[#EBE3D5] transition-all duration-300 font-syne cursor-pointer"
            onClick={() => setShowMenuDrawer(true)}
          >
            Order Now
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <main id="main-content" className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 w-full max-w-7xl mx-auto py-10">
        
        {/* Floating Top Tagline */}
        <div id="origin-tagline" className="mb-4 animate-fade-in text-center">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.5em] text-white/45 block font-syne">
            EST. 2012 &bull; NEW YORK CITY &bull; SOURDOUGH TRADITION
          </span>
        </div>

        {/* Large Aesthetic Central Text Alignment - "THE PIZZA PLUG" (With plain black backdrop styling) */}
        <div id="hero-display-group" className="relative w-full text-center flex flex-col items-center justify-center my-auto py-2 select-none">
          {/* Top massive overlay letters */}
          <h1 
            id="giant-text-urban"
            className="text-[10vw] sm:text-[6.5vw] font-bebas leading-[0.85] tracking-[0.08em] text-[#EBE3D5] hover:text-white transition-colors duration-500 ease-in-out cursor-default"
          >
            THE PIZZA
          </h1>
          
          {/* Authentic middle subtitle/break spacing (replaces background pizza visuals) */}
          <div id="tagline-container" className="h-8 sm:h-12 flex flex-col items-center justify-center gap-1 my-1">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
            <span className="font-playfair italic text-white/50 text-xs sm:text-sm tracking-[0.2em] hover:text-red-500 transition-colors duration-300">
              The Woodfire Craft Plug
            </span>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
          </div>

          {/* Bottom massive overlay letters */}
          <h1 
            id="giant-text-good"
            className="text-[11vw] sm:text-[8vw] font-bebas leading-[0.85] tracking-[0.12em] text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.35)] hover:text-white transition-colors duration-500 ease-in-out cursor-default"
          >
            PLUG
          </h1>
        </div>

        {/* Decorative elements - Subtle CTA hint */}
        <div id="view-menu-hint" className="mt-2 mb-6">
          <button 
            id="explore-menu-btn"
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#EBE3D5]/60 hover:text-white transition-colors group cursor-pointer"
            onClick={() => setShowMenuDrawer(true)}
          >
            <span>Explore Pizza Selections</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Bottom Booking Strip Container (As laid out in reference image but optimized) */}
        <div id="booking-container" className="relative w-full max-w-2xl mt-4 px-4 sm:px-0 flex flex-col items-center gap-6">
          <form 
            id="reservation-form"
            onSubmit={handleBookingSubmit}
            className="w-full bg-black/50 backdrop-blur-md border border-red-500/40 rounded-2xl sm:rounded-full p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-2 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.45)] transition-all duration-300 relative"
          >
            {/* OPEN SCHEDULE FIELD */}
            <div 
              id="booking-open-field"
              className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl sm:rounded-full transition-colors cursor-default"
            >
              <Utensils className="w-4 h-4 text-red-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[8px] uppercase tracking-wider text-[#EBE3D5]/60 font-syne font-bold leading-tight">Open</span>
                <span className="text-[11px] font-bold tracking-tight text-white/90 whitespace-nowrap">Monday &ndash; Sunday</span>
              </div>
            </div>

            {/* Vertical Splitter (Desktop format) */}
            <div className="hidden sm:block w-[1px] h-6 bg-red-500/20"></div>

            {/* HOURS FIELD */}
            <div 
              id="booking-time-field"
              className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl sm:rounded-full transition-colors cursor-default"
            >
              <Clock className="w-4 h-4 text-red-500 shrink-0 select-none animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[8px] uppercase tracking-wider text-[#EBE3D5]/60 font-syne font-bold leading-tight">Hours</span>
                <span className="text-[11px] font-mono font-bold tracking-tight text-white/90 whitespace-nowrap">10:00 AM - 01:00 AM</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              id="booking-submit-btn"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-[9px] uppercase tracking-[0.2em] rounded-lg sm:rounded-full px-6 py-2.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.7)]"
            >
              <span>Book Table</span>
            </button>
          </form>

          {/* Live Table Queue indicator placed nicely at the bottom of the hero section */}
          <div id="hero-wait-indicator" className="flex items-center gap-3.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 shadow-[0_0_15px_rgba(0,0,0,0.6)]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 pulse-glow"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest text-[#EBE3D5]/60 font-syne font-bold leading-none">Live Table Queue</span>
              <span className="text-xs font-mono font-bold text-white leading-none">{getWaitTimeText()} WAIT</span>
            </div>
          </div>
        </div>
      </main>
    </div>

      {/* Carousel Menu Section */}
      <section 
        id="menu-carousel-section" 
        className="relative w-full min-h-screen bg-black flex flex-col justify-end pt-24 sm:pt-32 pb-8 sm:pb-12 px-6 sm:px-12 border-t border-white/5 overflow-hidden z-10 animate-fade-in"
      >
        {/* Plain Background layer with selected item image fading in the backdrop */}
        <div className="absolute inset-0 z-0 transition-all duration-700 pointer-events-none select-none">
          {/* Fade in selected pizza backdrop illustration with super high clarity and visibility */}
          {MENU_ITEMS.map((item, idx) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                activeMenuIdx === idx ? 'opacity-85' : 'opacity-0'
              }`}
            />
          ))}
          {/* Pure dark red gradient background on the left so the text description remains highly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c0202]/95 via-[#1c0202]/65 to-transparent z-10" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col justify-between h-full min-h-[75vh]">
          
          {/* Header Row: Info Details Section with Smooth Kinetics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-6 mt-4">
            {/* Cross-fading Left-side info details */}
            <div className={`lg:col-span-8 flex flex-col items-start text-left select-none transition-all duration-300 transform ${
              fadeState === 'fade-in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              {/* Decorative tag/category indicator */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-5 h-[2px] bg-red-500 rounded animate-pulse"></span>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-syne font-bold text-red-500">
                  {MENU_ITEMS[displayedMenuIdx].origin}
                </span>
              </div>

              {/* Massive name title - reduced font size for exceptional elegance */}
              <h2 className="text-2xl sm:text-4xl font-black uppercase font-bebas tracking-wide text-[#EBE3D5] leading-[0.95] mb-3">
                {MENU_ITEMS[displayedMenuIdx].name}
              </h2>

              {/* Price and characteristics info bar */}
              <div className="flex items-center gap-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1">
                <span className="font-mono text-xs sm:text-sm font-black text-red-400">
                  {MENU_ITEMS[displayedMenuIdx].price}
                </span>
                <span className="w-[1px] h-3 bg-red-500/30"></span>
                <div className="flex gap-2">
                  {MENU_ITEMS[displayedMenuIdx].attributes.map((attr, i) => (
                    <span 
                      key={i} 
                      className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#EBE3D5]/80 font-syne font-bold"
                    >
                      {attr}{i < MENU_ITEMS[displayedMenuIdx].attributes.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Narrative/Description */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans font-medium tracking-wide max-w-lg mb-5">
                {MENU_ITEMS[displayedMenuIdx].description}
              </p>

              {/* Fast CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPreOrderedPizza(MENU_ITEMS[displayedMenuIdx].id);
                    setShowBookingSuccessModal(true);
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-lg transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pre-order</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('reservation-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 border border-[#EBE3D5]/20 hover:border-white text-[#EBE3D5] hover:text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-lg transition-all duration-300 cursor-pointer"
                >
                  Reserve Table
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row/Section: Scrollable Carousel list centered natively */}
          <div className="w-full relative mt-8 sm:mt-16">
            <div 
              ref={carouselRef}
              className="w-full overflow-x-auto scrollbar-none pb-6 pt-6 select-none cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <div className="flex gap-4 sm:gap-6 min-w-max px-[35vw] sm:px-[45vw]">
                {MENU_ITEMS.map((item, idx) => {
                  const isActive = activeMenuIdx === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveMenuIdx(idx)}
                      className={`relative w-28 sm:w-36 h-40 sm:h-48 rounded-xl overflow-hidden shrink-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer select-none origin-bottom ${
                        isActive 
                          ? 'ring-2 ring-red-500 shadow-[0_0_22px_rgba(239,68,68,0.7)] scale-105 z-10 translate-y-[-2px] opacity-100' 
                          : 'opacity-30 hover:opacity-55 scale-95 z-0'
                      }`}
                    >
                      {/* Pizza photo */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover pointer-events-none select-none"
                        draggable="false"
                      />
                      
                      {/* High quality bottom fade gradient so label is clean */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent z-10" />

                      {/* Custom content details on individual cards */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 flex flex-col items-start text-left font-sans">
                        <span className="text-[7px] uppercase tracking-widest text-[#EBE3D5]/70 block font-syne font-bold mb-0.5">
                          {item.origin.split(',')[0]}
                        </span>
                        <h3 className="text-sm sm:text-base font-black uppercase font-bebas text-white tracking-wide leading-none">
                          {item.name.replace(' D.O.P.', '')}
                        </h3>
                        <div className="mt-1 flex items-center justify-between w-full">
                          <span className="text-[8px] font-mono font-bold text-red-400 bg-black/40 px-1.5 py-0.5 rounded border border-red-500/25">
                            {item.price}
                          </span>
                          <span className="text-[7px] uppercase tracking-wider text-[#EBE3D5]/50 font-syne">
                            Select
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Outer Click helper overlay when dropdown is active */}
      {openedDropdown && (
        <div 
          id="click-outside-backdrop"
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={closeAllDropdowns}
        />
      )}

      {/* Footer Strip Section (Immersive UI Layout guidelines) */}
      <footer id="footer-section" className="relative z-10 w-full border-t border-white/10 bg-black/80 backdrop-blur-md pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
          {/* Column 1: Brand & Slogan */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-black border border-red-500/40">
                <Plug className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className="font-bebas text-lg uppercase tracking-wider text-[#EBE3D5]">THE PIZZA PLUG</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed max-w-xs font-sans">
              Born in the fires of Naples, customized in the heart of Soho. Hand-crafted 48-hour sourdough base, cooked at 900°F.
            </p>
          </div>

          {/* Column 2: Contact Block */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] uppercase tracking-widest text-[#EBE3D5]/60 font-syne font-bold">REACH US</span>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-white/75">
              <a href="mailto:hello@thepizzaplug.co" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-red-500/80" />
                <span>hello@thepizzaplug.co</span>
              </a>
              <a href="tel:+12125557584" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-red-500/80" />
                <span>+1 (212) 555-PLUG</span>
              </a>
            </div>
          </div>

          {/* Column 3: Location Block */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] uppercase tracking-widest text-[#EBE3D5]/60 font-syne font-bold">LOCATION</span>
            <div className="flex items-start gap-2 text-[11px] text-white/75 font-sans leading-relaxed">
              <MapPin className="w-4 h-4 text-red-500/80 shrink-0 mt-0.5" />
              <div>
                <span>142 Prince St</span>
                <span className="block text-white/50">Soho, New York, NY 10012</span>
              </div>
            </div>
          </div>

          {/* Column 4: Hours Block */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] uppercase tracking-widest text-[#EBE3D5]/60 font-syne font-bold">HOURS</span>
            <div className="flex items-start gap-2 text-[11px] text-white/75 font-sans leading-relaxed">
              <Clock className="w-3.5 h-3.5 text-red-500/80 shrink-0 mt-0.5" />
              <div>
                <span>Monday &ndash; Sunday</span>
                <span className="block font-mono text-red-400 text-[10px] mt-0.5">10:00 AM &ndash; 01:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dividerline with copy and social icons */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[9px] uppercase tracking-[0.15em] text-white/30 font-sans text-center sm:text-left">
            &copy; {new Date().getFullYear()} The Pizza Plug &bull; Naples Inspired, New York Bound.
          </div>
          <div className="flex gap-4 items-center">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-white transition-colors" aria-label="Instagram">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-white transition-colors" aria-label="Twitter">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE COMPONENT: MENU DRAWER */}
      {showMenuDrawer && (
        <div id="menu-drawer-backdrop" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-end animate-fade-in">
          {/* Main Drawer Shell */}
          <div 
            id="menu-drawer-shell"
            className="w-full max-w-lg bg-zinc-980 border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <PizzaIcon className="w-5 h-5 text-[#9A1F1F]" />
                  <h2 className="text-2xl font-bebas tracking-wider text-[#EBE3D5]">WOOD-FIRED SELECTION</h2>
                </div>
                <button 
                  id="close-menu-drawer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  onClick={() => setShowMenuDrawer(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs text-white/50 mb-6 italic font-playfair">
                Our dough undergoes a rigorous 48-hour fermentation cycle utilizing pure natural sourdough starter, baked inside custom hand-built clay brick ovens running at 900&deg;F.
              </p>

              {/* Pizza Cards */}
              <div id="pizza-recipe-list" className="flex flex-col gap-4">
                {MENU_ITEMS.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 bg-zinc-900/40 hover:bg-zinc-900/80 rounded-xl border border-white/5 hover:border-white/15 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-sm font-extrabold uppercase font-syne tracking-wide text-[#EBE3D5] group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-mono text-sm leading-none font-bold text-[#9A1F1F] bg-[#9A1F1F]/10 px-2 py-1 rounded">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-xs text-white/50 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Attributes tags */}
                    <div className="flex gap-1.5 flex-wrap">
                      {item.attributes.map((attr, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9px] uppercase tracking-wider bg-white/5 text-white/40 px-2 py-0.5 rounded"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Banner footer block */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-syne font-bold">Kitchen Capacity</span>
                  <p className="text-xs text-[#EBE3D5]/80">900&deg;F active wood ovens &bull; Fresh batches hourly</p>
                </div>
                <button
                  className="px-5 py-2.5 bg-[#9A1F1F] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-widest transition-all rounded-lg cursor-pointer"
                  onClick={() => {
                    setShowMenuDrawer(false);
                    setOpenedDropdown(null);
                  }}
                >
                  Book Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE COMPONENT: BOOKING SUCCESS TICKET CONFIRMATION MODAL */}
      {showBookingSuccessModal && (
        <div id="booking-modal-backdrop" className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="ticket-container" 
            className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Header branding */}
            <div className="bg-red-950/90 border-b border-red-500/20 p-6 text-center relative shadow-[0_4px_20px_rgba(239,68,68,0.15)]">
              <button 
                id="close-ticket"
                className="absolute top-4 right-4 text-white/60 hover:text-white"
                onClick={() => setShowBookingSuccessModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] uppercase tracking-[0.4em] text-red-400 block font-syne font-bold mb-1">RESERVATION SECURED</span>
              <h2 className="text-3xl font-bebas uppercase tracking-wide text-[#EBE3D5]">THE PIZZA PLUG</h2>
              <p className="text-2xs text-white/50 lowercase mt-1 font-mono">code: TPP-PLUG-{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>

            {/* Ticket Information Section */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Core Reservation Info block */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">DATE</span>
                  <span className="text-xs font-mono font-bold text-[#EBE3D5]">{selectedDate.replace(', 2026', '')}</span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">ARRIVING</span>
                  <span className="text-xs font-mono font-bold text-[#EBE3D5]">{selectedTime}</span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 block mb-1">PARTY</span>
                  <span className="text-xs font-mono font-bold text-[#EBE3D5]">{getGuestsSummaryText()}</span>
                </div>
              </div>

              {/* Custom interactive ticket features! */}
              <div className="space-y-4 border-t border-b border-white/10 py-5">
                {/* 1. Seat Customizer */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-white/45 block mb-2 font-syne font-bold">Table Seat Preference</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: "Woodfire Oven Seat", label: "By the Brick Oven" },
                      { key: "Window Boulevard", label: "Soho Window Seat" },
                      { key: "Chef Counter", label: "At Chef's Counter" },
                      { key: "Alleyway Lantern", label: "Outdoor Garden" }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`p-2 rounded-lg border text-left transition-all ${
                          tablePreference === opt.key 
                            ? 'bg-[#EBE3D5] text-black border-[#EBE3D5] font-bold' 
                            : 'bg-zinc-900/30 text-white/80 border-white/5 hover:border-white/10'
                        }`}
                        onClick={() => setTablePreference(opt.key)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Sourdough Pre-Order selection (Extremely delightful feature) */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-white/45 block mb-2 font-syne font-bold">Optional Pizza Pre-Order</label>
                  <select 
                    value={preOrderedPizza}
                    onChange={(e) => setPreOrderedPizza(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-[#9A1F1F]"
                  >
                    <option value="">None — Order at the table</option>
                    {MENU_ITEMS.map((pizza) => (
                      <option key={pizza.id} value={pizza.id}>
                        Pre-order: {pizza.name} ({pizza.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Chef Notes */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-white/45 block mb-2 font-syne font-bold">Special Requests / Allergies</label>
                  <input 
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="E.g. Gluten sensitive, celebrating dynamic anniversary..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 placeholder-white/20 focus:outline-none focus:border-[#9A1F1F]"
                  />
                </div>
              </div>

              {/* Status / Confirmation */}
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400">
                <Check className="w-5 h-5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block">No Booking Fee &bull; Instant Confirmation</span>
                  <span className="text-green-400/60 leading-normal">Your table is locked. We sent an SMS reservation receipt to you!</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="w-full py-4 bg-white hover:bg-[#EBE3D5] text-black font-extrabold uppercase text-[10px] tracking-widest text-center transition-colors rounded-xl cursor-pointer"
                onClick={() => setShowBookingSuccessModal(false)}
              >
                Finished — See you there
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
