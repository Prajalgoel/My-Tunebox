A dynamic, responsive music player built from scratch with vanilla JavaScript, Tailwind CSS, and custom CSS animations.

Clone the repo and run it locally:
1.git clone https://github.com/yourusername/TuneBox.git
2.cd TuneBox
3.open http://localhost:3000

🔍 Key Highlights
=>Auto-Discovery & Metadata Parsing
 • Fetches the /songs/ directory structure on load
 • Automatically parses track names, artists, thumbnails, and assigns unique IDs
=>Library Management
 • One-click “+” / “✓” to add or remove songs from your personal Library
 • Live song-count indicator and collapsible Library section
 • Intelligent “deleted songs” fallback to keep your Library organized
=>Popular Songs & Artists Carousels
 • Smooth, horizontally scrollable cards with hover-revealed play buttons
 • Shuffle buttons that instantly randomize play order and highlight active state
=>Deep Album Browsing
 • Click any artist card to inject their full tracklist into the sidebar
 • Expand/collapse per-album playlists and remove them with the “×” button
=>Rich Playback Controls
 • Play/pause (click or Space-bar), Next/Previous track, Loop and Shuffle modes
 • Intelligent shuffle logic: non-repeating random order until all tracks have played
=>Interactive Seek & Volume
 • Click-to-seek progress bar with draggable knob and live timestamp updates
 • Volume slider plus mute/unmute toggle, with dynamic icon feedback
 • Animated waveform visualizer that pulses during playback
=>Mobile-First & Dark-Mode UI
 • Hamburger menu on narrow viewports to toggle the sidebar
 • Custom dark scrollbars, smooth transitions, hover scale effects on cards
 • Tailwind-powered responsive design with consistent theming

🛠 Under the Hood
 • HTML5 Audio API for robust playback events
 • Fetch API driven directory traversal
 • Vanilla JS for all DOM manipulation and state management
 • Tailwind CSS plus bespoke CSS keyframe animations

 Tech Stack=>
1.JavaScript (ES6+)
2.HTML5 Audio API
3.Fetch API
4.Tailwind CSS
5.Custom CSS animations

