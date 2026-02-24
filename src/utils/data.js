export const APPS = [
  // Productivity
  { id: 'excalidraw',   icon:'🎨', name:'Excalidraw',      desc:'Virtual whiteboard for sketching hand-drawn diagrams. Open source, works offline.', category:'Productivity',    price:'Free', url:'https://excalidraw.com', score:3,  trust:'green',  installs:'2.1M', rankingScore:96, safetyScore:99, averageRating:4.9, totalReviews:4200, publishedAt:'2024-01-15', developerTrust:98, installVelocity:95, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Canvas', caption:'Infinite whiteboard with hand-drawn style shapes', color:'#6c5ce7' },
      { title:'Shapes & Tools', caption:'Rectangles, arrows, text, and freehand drawing', color:'#a29bfe' },
      { title:'Collaboration', caption:'Real-time multiplayer editing with shared links', color:'#74b9ff' },
      { title:'Export Options', caption:'Export to PNG, SVG, or share via live link', color:'#55efc4' },
    ] },
  { id: 'todoist',      icon:'✅', name:'Todoist',          desc:'Powerful task manager with projects, labels, filters, and natural language input.',  category:'Productivity',    price:'Free', url:'https://todoist.com', score:5,  trust:'green',  installs:'1.8M', rankingScore:93, safetyScore:97, averageRating:4.8, totalReviews:3800, publishedAt:'2024-03-10', developerTrust:96, installVelocity:90, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Task Inbox', caption:'Quick-add tasks with natural language dates', color:'#e17055' },
      { title:'Projects', caption:'Organize tasks into projects with sections', color:'#d63031' },
      { title:'Filters & Labels', caption:'Custom filters to find tasks instantly', color:'#e84393' },
      { title:'Upcoming View', caption:'See all tasks across projects by date', color:'#fd79a8' },
    ] },
  { id: 'notion',       icon:'📝', name:'Notion',           desc:'All-in-one workspace for notes, docs, wikis, and project management.',              category:'Productivity',    price:'Free', url:'https://www.notion.so', score:4,  trust:'green',  installs:'3.5M', rankingScore:97, safetyScore:98, averageRating:4.8, totalReviews:5100, publishedAt:'2024-02-20', developerTrust:97, installVelocity:93, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Workspace', caption:'Pages, databases, and wikis in one place', color:'#2d3436' },
      { title:'Databases', caption:'Tables, boards, calendars, and gallery views', color:'#636e72' },
      { title:'Templates', caption:'Start from 1000+ community templates', color:'#b2bec3' },
      { title:'AI Assistant', caption:'Write, summarize, and brainstorm with AI', color:'#74b9ff' },
    ] },

  // Finance
  { id: 'mint-alt',     icon:'💰', name:'Actual Budget',    desc:'Privacy-first budgeting app. Local-first, open source, sync across devices.',       category:'Finance',         price:'Free', url:'https://actualbudget.org', score:6,  trust:'green',  installs:'180k', rankingScore:82, safetyScore:95, averageRating:4.6, totalReviews:920,  publishedAt:'2024-05-12', developerTrust:88, installVelocity:72, badges:['verified','top_rated'],
    screenshots:[
      { title:'Budget Overview', caption:'Envelope-style budgeting with monthly totals', color:'#00b894' },
      { title:'Transactions', caption:'Import bank transactions or add manually', color:'#00cec9' },
      { title:'Reports', caption:'Spending charts and cash flow analysis', color:'#0984e3' },
      { title:'Accounts', caption:'Track checking, savings, and credit cards', color:'#6c5ce7' },
    ] },
  { id: 'wise',         icon:'💸', name:'Wise',             desc:'Send money internationally with real exchange rates and low fees.',                 category:'Finance',         price:'Free', url:'https://wise.com', score:8,  trust:'green',  installs:'950k', rankingScore:88, safetyScore:94, averageRating:4.7, totalReviews:2800, publishedAt:'2024-04-08', developerTrust:94, installVelocity:82, badges:['trending','verified'],
    screenshots:[
      { title:'Send Money', caption:'Transfer to 80+ countries with real rates', color:'#00b894' },
      { title:'Multi-Currency', caption:'Hold and convert 50+ currencies instantly', color:'#a3cb38' },
      { title:'Rate Alerts', caption:'Get notified when exchange rates hit your target', color:'#ffeaa7' },
      { title:'Activity', caption:'Track all transfers with real-time status', color:'#74b9ff' },
    ] },

  // Health
  { id: 'wger',         icon:'🏃', name:'wger Fitness',     desc:'Open source fitness tracker. Log workouts, manage routines, track nutrition.',      category:'Health',          price:'Free', url:'https://wger.de', score:5,  trust:'green',  installs:'120k', rankingScore:72, safetyScore:93, averageRating:4.4, totalReviews:560,  publishedAt:'2024-06-20', developerTrust:82, installVelocity:58, badges:['verified'],
    screenshots:[
      { title:'Workout Log', caption:'Log exercises with sets, reps, and weight', color:'#e17055' },
      { title:'Routines', caption:'Create and schedule weekly workout plans', color:'#d63031' },
      { title:'Nutrition', caption:'Track calories, protein, carbs, and fats', color:'#00b894' },
      { title:'Progress', caption:'Charts showing strength and body measurements', color:'#0984e3' },
    ] },

  // Developer Tools
  { id: 'stackblitz',   icon:'⚡', name:'StackBlitz',       desc:'Full-stack web IDE running entirely in the browser. Instant dev environments.',     category:'Developer Tools', price:'Free', url:'https://stackblitz.com', score:4,  trust:'green',  installs:'1.2M', rankingScore:94, safetyScore:97, averageRating:4.8, totalReviews:3200, publishedAt:'2024-01-30', developerTrust:96, installVelocity:88, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Code Editor', caption:'VS Code-powered editor with IntelliSense', color:'#1e90ff' },
      { title:'Live Preview', caption:'Instant hot-reload preview as you type', color:'#2d3436' },
      { title:'Terminal', caption:'Full terminal with npm, node, and git', color:'#636e72' },
      { title:'Templates', caption:'Start from React, Vue, Angular, or Next.js', color:'#6c5ce7' },
    ] },
  { id: 'codesandbox',  icon:'📦', name:'CodeSandbox',      desc:'Online code editor and prototyping tool. Instant previews and collaboration.',      category:'Developer Tools', price:'Free', url:'https://codesandbox.io', score:5,  trust:'green',  installs:'890k', rankingScore:90, safetyScore:96, averageRating:4.7, totalReviews:2600, publishedAt:'2024-02-15', developerTrust:95, installVelocity:85, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Sandbox Editor', caption:'Write code with real-time preview panel', color:'#2d3436' },
      { title:'DevBoxes', caption:'Full Linux VM environments in the cloud', color:'#151515' },
      { title:'Collaboration', caption:'Share sandboxes and code together live', color:'#6c5ce7' },
      { title:'Deploy', caption:'One-click deploy to Vercel or Netlify', color:'#0984e3' },
    ] },

  // Entertainment
  { id: 'spotify',      icon:'🎵', name:'Spotify',          desc:'Stream millions of songs, podcasts, and audiobooks. Free tier with ads.',           category:'Entertainment',   price:'Free', url:'https://open.spotify.com', score:3,  trust:'green',  installs:'5.2M', rankingScore:98, safetyScore:98, averageRating:4.8, totalReviews:8400, publishedAt:'2024-01-05', developerTrust:99, installVelocity:97, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Home Feed', caption:'Personalized playlists and daily mixes', color:'#1DB954' },
      { title:'Now Playing', caption:'Full-screen player with lyrics and queue', color:'#191414' },
      { title:'Search', caption:'Browse by genre, mood, charts, and new releases', color:'#535353' },
      { title:'Library', caption:'Your saved songs, albums, and playlists', color:'#282828' },
    ] },
  { id: 'youtube-music',icon:'🎶', name:'YouTube Music',    desc:'Official music streaming from YouTube. Free with ads, background play.',            category:'Entertainment',   price:'Free', url:'https://music.youtube.com', score:4,  trust:'green',  installs:'4.1M', rankingScore:96, safetyScore:97, averageRating:4.6, totalReviews:6200, publishedAt:'2024-01-10', developerTrust:99, installVelocity:95, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Home', caption:'Trending music and personalized recommendations', color:'#FF0000' },
      { title:'Player', caption:'Video and audio modes with background play', color:'#282828' },
      { title:'Explore', caption:'Charts, new releases, and moods & genres', color:'#212121' },
      { title:'Library', caption:'Downloads, playlists, and subscriptions', color:'#181818' },
    ] },

  // Education
  { id: 'duolingo',     icon:'🦉', name:'Duolingo',         desc:'Learn 40+ languages for free with bite-sized lessons and gamification.',            category:'Education',       price:'Free', url:'https://www.duolingo.com', score:3,  trust:'green',  installs:'3.8M', rankingScore:97, safetyScore:98, averageRating:4.7, totalReviews:7100, publishedAt:'2024-01-18', developerTrust:98, installVelocity:94, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Lesson Tree', caption:'Skill tree with progressive difficulty levels', color:'#58CC02' },
      { title:'Practice', caption:'Interactive exercises — match, translate, speak', color:'#89E219' },
      { title:'Leaderboards', caption:'Compete with friends and earn XP streaks', color:'#FF9600' },
      { title:'Stories', caption:'Read and listen to interactive short stories', color:'#CE82FF' },
    ] },
  { id: 'khan-academy', icon:'🎓', name:'Khan Academy',     desc:'Free world-class education. Math, science, computing, and more.',                   category:'Education',       price:'Free', url:'https://www.khanacademy.org', score:2,  trust:'green',  installs:'2.6M', rankingScore:95, safetyScore:99, averageRating:4.9, totalReviews:5500, publishedAt:'2024-02-01', developerTrust:99, installVelocity:88, badges:['verified','top_rated'],
    screenshots:[
      { title:'Course Library', caption:'Math, science, computing, economics & more', color:'#1865f2' },
      { title:'Video Lessons', caption:'Expert-led videos with interactive transcripts', color:'#14bf96' },
      { title:'Practice', caption:'Step-by-step problem solving with hints', color:'#ff914d' },
      { title:'Progress', caption:'Mastery system tracking your learning journey', color:'#9b59b6' },
    ] },

  // Games
  { id: 'wordle',       icon:'🟩', name:'Wordle',           desc:'Guess the 5-letter word in 6 tries. Daily puzzle, share your results.',             category:'Games',           price:'Free', url:'https://www.nytimes.com/games/wordle', score:2,  trust:'green',  installs:'4.5M', rankingScore:97, safetyScore:99, averageRating:4.9, totalReviews:9200, publishedAt:'2024-01-02', developerTrust:99, installVelocity:92, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Game Board', caption:'6 rows of 5 tiles — guess the daily word', color:'#538d4e' },
      { title:'Keyboard', caption:'Color-coded keyboard shows used letters', color:'#3a3a3c' },
      { title:'Statistics', caption:'Track your streak and guess distribution', color:'#818384' },
      { title:'Share Results', caption:'Share your spoiler-free result grid', color:'#b59f3b' },
    ] },
  { id: '2048',         icon:'🔢', name:'2048',             desc:'Slide numbered tiles on a grid to combine them and reach 2048. Addictive classic.', category:'Games',           price:'Free', url:'https://play2048.co', score:2,  trust:'green',  installs:'1.9M', rankingScore:90, safetyScore:99, averageRating:4.8, totalReviews:4800, publishedAt:'2024-03-05', developerTrust:95, installVelocity:78, badges:['verified','top_rated'],
    screenshots:[
      { title:'Game Grid', caption:'4x4 grid — swipe to merge matching tiles', color:'#edc22e' },
      { title:'High Scores', caption:'Track your best tile and high score', color:'#f2b179' },
      { title:'Gameplay', caption:'Strategize to reach 2048 and beyond', color:'#f67c5f' },
      { title:'Game Over', caption:'Final score with option to try again', color:'#edc53f' },
    ] },

  // Security
  { id: 'bitwarden',    icon:'🔐', name:'Bitwarden',        desc:'Open source password manager. End-to-end encrypted, free for personal use.',        category:'Security',        price:'Free', url:'https://vault.bitwarden.com', score:3,  trust:'green',  installs:'1.5M', rankingScore:95, safetyScore:99, averageRating:4.8, totalReviews:4100, publishedAt:'2024-01-22', developerTrust:98, installVelocity:90, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Vault', caption:'All your passwords organized in one vault', color:'#175DDC' },
      { title:'Password Generator', caption:'Create strong unique passwords instantly', color:'#1a3d7c' },
      { title:'Auto-Fill', caption:'One-click login on any website or app', color:'#339af0' },
      { title:'Security Report', caption:'Check for weak, reused, or breached passwords', color:'#0d47a1' },
    ] },
  { id: 'protonpass',   icon:'🛡️', name:'Proton Pass',      desc:'End-to-end encrypted password manager from the makers of ProtonMail.',              category:'Security',        price:'Free', url:'https://pass.proton.me', score:4,  trust:'green',  installs:'620k', rankingScore:86, safetyScore:98, averageRating:4.7, totalReviews:1800, publishedAt:'2024-04-15', developerTrust:96, installVelocity:82, badges:['trending','verified'],
    screenshots:[
      { title:'Logins', caption:'Store and organize all your login credentials', color:'#6d4aff' },
      { title:'Aliases', caption:'Generate email aliases to protect your inbox', color:'#8b5cf6' },
      { title:'Secure Notes', caption:'Encrypted notes for sensitive information', color:'#7c3aed' },
      { title:'Passkeys', caption:'Passwordless login with passkey support', color:'#a78bfa' },
    ] },

  // Business
  { id: 'trello',       icon:'📋', name:'Trello',           desc:'Visual project management with boards, lists, and cards. Free for small teams.',    category:'Business',        price:'Free', url:'https://trello.com', score:4,  trust:'green',  installs:'2.8M', rankingScore:94, safetyScore:97, averageRating:4.7, totalReviews:5600, publishedAt:'2024-01-25', developerTrust:97, installVelocity:86, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Board View', caption:'Drag-and-drop cards across lists', color:'#0079BF' },
      { title:'Card Detail', caption:'Checklists, due dates, attachments, and labels', color:'#00C2E0' },
      { title:'Calendar', caption:'See all due dates in a calendar view', color:'#51E898' },
      { title:'Team Boards', caption:'Collaborate with your team in real time', color:'#FF9F1A' },
    ] },
  { id: 'slack',        icon:'💬', name:'Slack',            desc:'Team messaging and collaboration hub. Channels, threads, and integrations.',        category:'Business',        price:'Free', url:'https://app.slack.com', score:5,  trust:'green',  installs:'3.2M', rankingScore:96, safetyScore:97, averageRating:4.6, totalReviews:6800, publishedAt:'2024-01-08', developerTrust:98, installVelocity:92, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Channels', caption:'Organized conversations by team and topic', color:'#4A154B' },
      { title:'Threads', caption:'Keep discussions focused with threaded replies', color:'#611f69' },
      { title:'Search', caption:'Find any message, file, or person instantly', color:'#36C5F0' },
      { title:'Huddles', caption:'Quick audio calls without leaving Slack', color:'#2EB67D' },
    ] },

  // Food & Cooking
  { id: 'mealime',      icon:'🥗', name:'Mealime',          desc:'Meal planning made simple. Personalized recipes and auto grocery lists.',           category:'Food & Cooking',  price:'Free', url:'https://www.mealime.com', score:5,  trust:'green',  installs:'380k', rankingScore:78, safetyScore:94, averageRating:4.6, totalReviews:1200, publishedAt:'2024-06-01', developerTrust:85, installVelocity:65, badges:['verified','top_rated'],
    screenshots:[
      { title:'Meal Plan', caption:'Drag recipes into your weekly meal plan', color:'#27ae60' },
      { title:'Recipes', caption:'Step-by-step cooking instructions with photos', color:'#2ecc71' },
      { title:'Grocery List', caption:'Auto-generated shopping list from your plan', color:'#f39c12' },
      { title:'Preferences', caption:'Set dietary needs — vegan, keto, gluten-free', color:'#e74c3c' },
    ] },
  { id: 'cookpad',      icon:'👨‍🍳', name:'Cookpad',          desc:'Community-driven recipe sharing. Millions of home-cooked recipes from real cooks.', category:'Food & Cooking',  price:'Free', url:'https://cookpad.com', score:6,  trust:'green',  installs:'520k', rankingScore:80, safetyScore:93, averageRating:4.5, totalReviews:1500, publishedAt:'2024-05-18', developerTrust:86, installVelocity:68, badges:['verified'],
    screenshots:[
      { title:'Recipe Feed', caption:'Browse recipes shared by home cooks worldwide', color:'#f57f17' },
      { title:'Cooking Mode', caption:'Step-by-step with timers and voice control', color:'#e65100' },
      { title:'My Cookbooks', caption:'Save and organize your favorite recipes', color:'#ff8f00' },
      { title:'Share Recipe', caption:'Upload your own recipes with photos', color:'#ef6c00' },
    ] },

  // Social
  { id: 'mastodon',     icon:'🐘', name:'Mastodon',         desc:'Decentralized social network. No ads, no algorithms, no corporate surveillance.',   category:'Social',          price:'Free', url:'https://mastodon.social', score:5,  trust:'green',  installs:'890k', rankingScore:84, safetyScore:96, averageRating:4.5, totalReviews:2400, publishedAt:'2024-03-12', developerTrust:92, installVelocity:74, badges:['verified','top_rated'],
    screenshots:[
      { title:'Home Timeline', caption:'Posts from people you follow, chronologically', color:'#6364FF' },
      { title:'Explore', caption:'Trending posts, hashtags, and news', color:'#563ACC' },
      { title:'Notifications', caption:'Mentions, boosts, and new followers', color:'#858AFA' },
      { title:'Profile', caption:'Your posts, media, and followers list', color:'#2F0C7A' },
    ] },

  // Shopping
  { id: 'honey',        icon:'🍯', name:'Honey by PayPal',  desc:'Automatically find and apply coupon codes at checkout. Save money effortlessly.',   category:'Shopping',        price:'Free', url:'https://www.joinhoney.com', score:7,  trust:'green',  installs:'1.1M', rankingScore:86, safetyScore:92, averageRating:4.5, totalReviews:3200, publishedAt:'2024-04-20', developerTrust:93, installVelocity:78, badges:['trending','verified'],
    screenshots:[
      { title:'Apply Coupons', caption:'Automatically tests all available codes', color:'#FF6801' },
      { title:'Savings', caption:'Track total savings across all your purchases', color:'#f59e0b' },
      { title:'Droplist', caption:'Track price drops on items you want', color:'#ec4899' },
      { title:'Rewards', caption:'Earn Honey Gold for cash back on purchases', color:'#fbbf24' },
    ] },

  // Travel
  { id: 'google-maps',  icon:'🗺️', name:'Google Maps',      desc:'Navigate the world with real-time traffic, transit, and offline maps.',              category:'Travel',          price:'Free', url:'https://www.google.com/maps', score:3,  trust:'green',  installs:'6.1M', rankingScore:99, safetyScore:98, averageRating:4.8, totalReviews:12000,publishedAt:'2024-01-01', developerTrust:99, installVelocity:98, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Map View', caption:'Satellite, terrain, and street-level imagery', color:'#4285F4' },
      { title:'Navigation', caption:'Turn-by-turn driving, walking, and cycling', color:'#34A853' },
      { title:'Transit', caption:'Real-time bus, train, and subway schedules', color:'#FBBC04' },
      { title:'Explore', caption:'Find restaurants, shops, and attractions nearby', color:'#EA4335' },
    ] },

  // Music
  { id: 'soundtrap',    icon:'🎹', name:'Soundtrap',        desc:'Online music studio by Spotify. Record, mix, and collaborate on music for free.',   category:'Music',           price:'Free', url:'https://www.soundtrap.com', score:5,  trust:'green',  installs:'420k', rankingScore:79, safetyScore:95, averageRating:4.5, totalReviews:1100, publishedAt:'2024-05-25', developerTrust:94, installVelocity:62, badges:['verified'],
    screenshots:[
      { title:'Studio', caption:'Multi-track editor with loops and instruments', color:'#1DB954' },
      { title:'Instruments', caption:'Synths, drums, and virtual instruments', color:'#191414' },
      { title:'Loops Library', caption:'Thousands of royalty-free loops and beats', color:'#535353' },
      { title:'Collaborate', caption:'Invite friends to produce together in real time', color:'#282828' },
    ] },

  // Photography
  { id: 'photopea',     icon:'📸', name:'Photopea',         desc:'Free online photo editor. Supports PSD, XCF, Sketch, XD, and CDR formats.',        category:'Photography',     price:'Free', url:'https://www.photopea.com', score:4,  trust:'green',  installs:'1.8M', rankingScore:92, safetyScore:96, averageRating:4.7, totalReviews:3900, publishedAt:'2024-02-10', developerTrust:93, installVelocity:86, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Editor', caption:'Photoshop-like interface with layers and tools', color:'#18A0FB' },
      { title:'Layers Panel', caption:'Full layer support with blending modes', color:'#2c3e50' },
      { title:'Filters', caption:'Blur, sharpen, color adjustments, and effects', color:'#8e44ad' },
      { title:'Export', caption:'Save as PSD, PNG, JPG, SVG, GIF, and PDF', color:'#16a085' },
    ] },
  { id: 'squoosh',      icon:'🖼️', name:'Squoosh',          desc:'Image compression app by Google. Resize and optimize images right in the browser.', category:'Photography',     price:'Free', url:'https://squoosh.app', score:2,  trust:'green',  installs:'680k', rankingScore:85, safetyScore:99, averageRating:4.8, totalReviews:2100, publishedAt:'2024-03-20', developerTrust:99, installVelocity:72, badges:['verified','top_rated'],
    screenshots:[
      { title:'Compare', caption:'Side-by-side before/after quality comparison', color:'#4285F4' },
      { title:'Compress', caption:'Choose WebP, AVIF, JPEG, or PNG output', color:'#34A853' },
      { title:'Resize', caption:'Resize with fit, fill, or exact dimensions', color:'#FBBC04' },
      { title:'Results', caption:'See file size reduction percentage instantly', color:'#EA4335' },
    ] },

  // Weather
  { id: 'windy',        icon:'🌤️', name:'Windy',            desc:'Detailed weather forecasts with interactive radar maps. Used by pilots and sailors.',category:'Weather',         price:'Free', url:'https://www.windy.com', score:4,  trust:'green',  installs:'1.4M', rankingScore:91, safetyScore:96, averageRating:4.7, totalReviews:3600, publishedAt:'2024-02-28', developerTrust:94, installVelocity:80, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Wind Map', caption:'Animated wind patterns across the globe', color:'#1565c0' },
      { title:'Radar', caption:'Rain, snow, temperature, and cloud layers', color:'#0d47a1' },
      { title:'Forecast', caption:'Hourly and 10-day detailed forecasts', color:'#42a5f5' },
      { title:'Alerts', caption:'Severe weather warnings and notifications', color:'#ef5350' },
    ] },

  // News
  { id: 'hackernews',   icon:'📰', name:'Hacker News',      desc:'Tech news and discussion from Y Combinator. Top stories, comments, and jobs.',     category:'News',            price:'Free', url:'https://news.ycombinator.com', score:3,  trust:'green',  installs:'720k', rankingScore:83, safetyScore:97, averageRating:4.6, totalReviews:1900, publishedAt:'2024-04-02', developerTrust:96, installVelocity:70, badges:['verified','top_rated'],
    screenshots:[
      { title:'Top Stories', caption:'Ranked tech news and startup discussions', color:'#FF6600' },
      { title:'Comments', caption:'Threaded discussions with expert insights', color:'#f5f5dc' },
      { title:'Ask HN', caption:'Community questions and advice threads', color:'#ff851b' },
      { title:'Jobs', caption:'Startup job postings from YC companies', color:'#e67e22' },
    ] },

  // Sports
  { id: 'strava',       icon:'🏋️', name:'Strava',           desc:'Track running, cycling, and workouts. Compete with friends and join challenges.',   category:'Sports',          price:'Free', url:'https://www.strava.com', score:5,  trust:'green',  installs:'2.4M', rankingScore:94, safetyScore:96, averageRating:4.7, totalReviews:5200, publishedAt:'2024-01-28', developerTrust:96, installVelocity:89, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Activity Feed', caption:'See runs, rides, and workouts from friends', color:'#FC4C02' },
      { title:'GPS Tracking', caption:'Map your route with pace and elevation', color:'#2d3436' },
      { title:'Segments', caption:'Compete on popular routes and earn crowns', color:'#e17055' },
      { title:'Challenges', caption:'Monthly challenges and club competitions', color:'#ff7675' },
    ] },

  // Utilities
  { id: 'speedtest',    icon:'🔧', name:'Speedtest by Ookla',desc:'Test your internet speed — download, upload, ping, and jitter.',                  category:'Utilities',       price:'Free', url:'https://www.speedtest.net', score:3,  trust:'green',  installs:'3.1M', rankingScore:95, safetyScore:97, averageRating:4.7, totalReviews:6400, publishedAt:'2024-01-12', developerTrust:97, installVelocity:90, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Speed Test', caption:'One-tap download and upload speed test', color:'#141526' },
      { title:'Results', caption:'Download, upload, ping, and jitter metrics', color:'#1c1d3b' },
      { title:'History', caption:'Track speed over time with detailed logs', color:'#6c5ce7' },
      { title:'Network Info', caption:'See ISP, server, and connection details', color:'#a29bfe' },
    ] },
  { id: 'clipdrop',     icon:'✂️', name:'Clipdrop',         desc:'AI-powered tool to remove backgrounds, upscale images, and clean up photos.',       category:'Utilities',       price:'Free', url:'https://clipdrop.co', score:5,  trust:'green',  installs:'580k', rankingScore:82, safetyScore:94, averageRating:4.6, totalReviews:1600, publishedAt:'2024-05-05', developerTrust:90, installVelocity:75, badges:['verified','top_rated'],
    screenshots:[
      { title:'Remove BG', caption:'AI background removal in one click', color:'#7c3aed' },
      { title:'Upscale', caption:'Enhance image resolution with AI upscaling', color:'#8b5cf6' },
      { title:'Cleanup', caption:'Remove objects and blemishes from photos', color:'#a78bfa' },
      { title:'Relight', caption:'AI relighting to change photo lighting', color:'#c4b5fd' },
    ] },

  // Communication
  { id: 'telegram',     icon:'📧', name:'Telegram',         desc:'Fast, secure messaging with cloud sync. Supports groups, channels, and bots.',      category:'Communication',   price:'Free', url:'https://web.telegram.org', score:4,  trust:'green',  installs:'4.8M', rankingScore:98, safetyScore:96, averageRating:4.7, totalReviews:9800, publishedAt:'2024-01-03', developerTrust:97, installVelocity:96, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Chats', caption:'All conversations with cloud sync across devices', color:'#0088cc' },
      { title:'Channels', caption:'Subscribe to news, updates, and communities', color:'#179cde' },
      { title:'Groups', caption:'Groups up to 200,000 members with admin tools', color:'#40b3e0' },
      { title:'Stickers', caption:'Animated stickers, GIFs, and custom emoji', color:'#5cc3ed' },
    ] },

  // Lifestyle
  { id: 'pinterest',    icon:'📌', name:'Pinterest',        desc:'Discover recipes, home ideas, style inspiration, and more. Save and organize pins.', category:'Lifestyle',       price:'Free', url:'https://www.pinterest.com', score:5,  trust:'green',  installs:'2.9M', rankingScore:95, safetyScore:96, averageRating:4.6, totalReviews:6100, publishedAt:'2024-01-15', developerTrust:97, installVelocity:91, badges:['trending','verified','top_rated'],
    screenshots:[
      { title:'Home Feed', caption:'Personalized pins based on your interests', color:'#E60023' },
      { title:'Search', caption:'Visual search with camera lens and filters', color:'#c92a2a' },
      { title:'Boards', caption:'Save and organize pins into themed boards', color:'#bd081c' },
      { title:'Shopping', caption:'Shop products directly from pins you love', color:'#ad081c' },
    ] },
]

export const CATEGORIES = ['All', 'Productivity', 'Finance', 'Health', 'Developer Tools', 'Entertainment', 'Education', 'Games', 'Security', 'Business', 'Food & Cooking', 'Social', 'Shopping', 'Travel', 'Music', 'Photography', 'Weather', 'News', 'Sports', 'Utilities', 'Communication', 'Lifestyle']

export const SCAN_STEPS = [
  { pct:8,  label:'Initializing sandbox',       cls:'info', text:'[init] Pulling node:20-alpine...' },
  { pct:18, label:'Installing dependencies',    cls:'info', text:'[build] npm ci — 47 packages' },
  { pct:30, label:'Building PWA bundle',        cls:'ok',   text:'[build] ✓ Built in 34s — 2.1MB' },
  { pct:40, label:'Generating SBOM',            cls:'info', text:'[sbom] 47 packages inventoried' },
  { pct:50, label:'CVE dependency scan',        cls:'warn', text:'[cve] ⚠ lodash@4.17.20 medium CVE' },
  { pct:60, label:'Static artifact analysis',   cls:'ok',   text:'[sast] ✓ No miners or hidden iframes' },
  { pct:70, label:'Secrets detection',          cls:'ok',   text:'[secrets] ✓ No credentials found' },
  { pct:80, label:'Dynamic sandbox run',        cls:'ok',   text:'[dast] ✓ 0 outbound calls detected' },
  { pct:90, label:'Policy compliance',          cls:'ok',   text:'[policy] ✓ Privacy URL + email verified' },
  { pct:97, label:'Reputation check',           cls:'ok',   text:'[rep] ✓ Publisher clean, 0 strikes' },
  { pct:100,label:'Pipeline complete',          cls:'ok',   text:'[done] Risk score: 12/100 → ALLOW ✅' },
]

export const PIPELINE_STAGES = [
  { num:'01', title:'Pre-Build Static Intake',     desc:'File validation, secrets scan, malware signatures', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ No binary blobs detected' },
      { sev:'pass', msg:'✓ No API keys or private keys in source' },
      { sev:'pass', msg:'✓ No known malware signatures matched' },
    ]},
  { num:'02', title:'Sandboxed Build + SBOM',      desc:'Docker sandbox, SBOM generation, CVE check', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ Build succeeded in 34s (React 18)' },
      { sev:'pass', msg:'✓ 47 dependencies inventoried, 0 critical CVEs' },
      { sev:'medium', msg:'⚠ lodash@4.17.20 — 1 medium CVE (no RCE path)' },
    ]},
  { num:'03', title:'Post-Build Artifact Analysis', desc:'Hidden iframes, redirect chains, clipboard hijack, crypto-miners', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ No hidden iframes or drive-by patterns' },
      { sev:'pass', msg:'✓ No crypto-miner bytecode found' },
      { sev:'pass', msg:'✓ Obfuscation score: 0.12 (normal minification)' },
    ]},
  { num:'04', title:'Dynamic Sandbox Analysis',    desc:'Headless browser — network calls, fingerprinting, redirects', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ 0 outbound network calls during 60s session' },
      { sev:'pass', msg:'✓ No device fingerprinting detected' },
      { sev:'pass', msg:'✓ No unexpected permission prompts' },
    ]},
  { num:'05', title:'Policy & Compliance',         desc:'Privacy policy, ToS, contact, category-specific rules', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ Privacy policy URL verified and live' },
      { sev:'pass', msg:'✓ Contact email validated' },
      { sev:'pass', msg:'✓ No restricted health/finance claims in copy' },
    ]},
  { num:'06', title:'Reputation & History',        desc:'Publisher age, prior strikes, version history, report rate', badge:'pass',
    findings:[
      { sev:'pass', msg:'✓ Publisher account: 8 months, 0 strikes' },
      { sev:'pass', msg:'✓ 3 prior clean versions on record' },
      { sev:'pass', msg:'✓ User report rate: 0.00%' },
    ]},
]
