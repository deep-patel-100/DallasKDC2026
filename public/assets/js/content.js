/* ==========================================================================
   KDC DALLAS 2026 · SITE CONTENT
   --------------------------------------------------------------------------
   Everything a visitor reads on the site lives in this one file.
   Change words, times, colors and links here; app.js builds the page from it.

   Editing rules
   • Keep the punctuation of the file intact: quotes around text, a comma
     after every item, matching { } and [ ] brackets.
   • Times are 24-hour "HH:MM" in the EVENT'S local time (e.g. "15:45" = 3:45 PM).
     Visitors always see event-local times, whatever time zone their phone is in.
   • Colors are names from the palette: teal, yellow, pink, orange, green,
     sky, lavender, red.  (Defined at the top of assets/css/styles.css.)
   • In any text you can write **bold words** between double asterisks.
   • In stories, wrap an answer in double square brackets: [[pillar]].
     Each [[answer]] becomes a tappable blank and is added to the word bank.
   • Icons are file names (without .svg) from assets/img/.
   • After editing, reload the page. If you host it, upload this file again.
   ========================================================================== */

globalThis.KDC_CONTENT = {
  /* ---------------------------------------------------------------- EVENT */
  event: {
    shortName: "KDC Dallas 2026",
    name: "Kids' Diwali Celebration",
    theme: "The Light Within",
    tagline: "Blast off on an astronaut mission to discover the light inside every one of us.",
    date: "2026-10-31",                 // YYYY-MM-DD
    dateLabel: "Saturday, October 31, 2026",
    utcOffset: "-05:00",                // Central Daylight Time on Oct 31, 2026
    timeZoneLabel: "CT",
    gatesOpen: "09:00",                 // countdown counts down to this time
    ends: "17:30",
    venue: "BAPS Shri Swaminarayan Mandir, Dallas, Texas",
    address: "4601 N State Highway 161, Irving, TX 75038",  // verify before launch
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=BAPS%20Shri%20Swaminarayan%20Mandir%20Dallas%20Irving%20TX",
    organization: "BAPS Swaminarayan Sanstha",
    website: "https://www.baps.org",
    websiteLabel: "www.BAPS.org",
    siteUrl: "https://dallaskdc2026.netlify.app/",   // final address (used by Share + calendar). Update if you add a custom domain.
    storageKey: "kdc-dallas-2026"       // change each year so last year's progress doesn't carry over
  },

  /* --------------------------------------------------------- REGISTRATION
     Shown as a banner below the top section. Set show: false to hide it. prices is optional: leave it empty [] or
     add tiles like { amount: "$25", label: "Pre-registration" }. */
  registration: {
    show: true,
    url: "https://form.jotform.com/262546836328163",
    buttonLabel: "Register now",
    heading: "Haven't registered yet?",
    text: "Sign up your young astronauts online before the big day. It only takes a few minutes.",
    prices: []
  },

  /* ---------------------------------------------------------- NAVIGATION
     id must match a section id below. "tab" items also appear in the
     phone's bottom tab bar (keep that to 5). */
  nav: [
    { id: "schedule",  label: "Schedule",  icon: "rocket",              tab: true },
    { id: "map",       label: "Map",       icon: "sun",                 tab: true },
    { id: "mission",   label: "Mission",   icon: "planet-faith",        tab: true },
    { id: "passport",  label: "Passport",  icon: "astronaut",           tab: true },
    { id: "reminders", label: "Reminders", icon: "diya",                tab: false },
    { id: "reels",     label: "Reels",     icon: "camera",              tab: true }
  ],

  /* ---------------------------------------------------------------- HERO */
  hero: {
    logoAlt: "Kids' Diwali Celebration",
    countdownLabel: "Mission launches in",
    liveButton: "What's happening now",
    liveLabel: "Mission in progress!",
    afterLabel: "Thank you for exploring with us!",
    calendarButton: "Add to calendar",
    directionsButton: "Directions",
    shareButton: "Share"
  },

  /* ------------------------------------------------------------ SCHEDULE
     sessions: { start, end }. If a session only has a start time (like
     Mahāpūjā), add "duration" (minutes) to the item. Duration is only used
     to draw the timeline bar and to show "Happening now"; visitors see the
     start time, exactly as printed in the booklet. */
  schedule: {
    eyebrow: "Agenda",
    title: "Astronaut Mission",
    intro: "Activities repeat throughout the day. Choose what your crew would like to do and head to that spot. Tap any activity for details.",
    listLabel: "List",
    timelineLabel: "Timeline",
    timelineStart: "09:00",
    timelineEnd: "17:30",
    footnotes: [
      "Arrive on time for Mahāpūjā and the Stage Program!",
      "Don't forget to stop by the Photo Booth!"
    ],
    items: [
      {
        id: "launchpad-in", name: "Launchpad", activity: "Check-In", location: "Registration",
        color: "teal", icon: "rocket", zone: "launchpad",
        sessions: [{ start: "09:00", end: "10:00" }, { start: "10:00", end: "11:00" }, { start: "11:00", end: "12:00" }],
        details: "Start your mission here. Check in your crew at Registration during your check-in time."
      },
      {
        id: "photobooth", name: "Photo Booth", activity: "Crew photos", location: "Launchpad (Registration area)",
        color: "pink", icon: "camera", zone: "photobooth",
        sessions: [{ start: "10:00", end: "17:00" }],
        details: "Strike your best astronaut pose! The Photo Booth is at the Launchpad, beside Registration."
      },
      {
        id: "universe", name: "Center of the Universe", activity: "Mahāpūjā", location: "Nij Mandir",
        color: "yellow", icon: "sun", zone: "universe",
        sessions: [{ start: "10:00", end: "11:00" }, { start: "12:30", end: "13:30" }, { start: "15:30", end: "16:30" }],
        details: "Join the Mahāpūjā in the Nij Mandir. Seating opens 15 minutes before each Mahāpūjā. Please leave your shoes at the shoe area."
      },
      {
        // The Stage Program (Sabha Hall, Room 1) is the start of each exhibition
        // round, so they are one activity. Optional: add note: "..." to a session
        // to show extra detail under that time.
        id: "mission", name: "Mission: Light Within", activity: "Stage Program + Exhibition",
        location: "Room 1 → Rooms 2–5",
        color: "orange", icon: "planet-faith", zone: "stage", link: "mission",
        sessions: [
          { start: "10:30", end: "12:30" },
          { start: "13:00", end: "15:00" },
          { start: "15:30", end: "17:30" }
        ],
        details: "Each mission begins with the Stage Program in the Sabha Hall (Room 1), then continues to the four planets of the exhibition in the Dining Hall (Rooms 2–5), visited in any order, and ends at Room 6. Seating opens 15 minutes before each start time."
      },
      {
        id: "zerogravity", name: "Zero Gravity", activity: "Rides", location: "Front Field",
        color: "sky", icon: "astronaut", zone: "zerogravity",
        sessions: [{ start: "11:00", end: "17:00" }],
        details: "Float over to the rides on the Front Field."
      },
      {
        id: "fuel", name: "Astronaut Fuel Station", activity: "Lunch", location: "Outside",
        color: "green", icon: "fuel", zone: "fuel",
        sessions: [{ start: "12:00", end: "16:00" }],
        details: "Refuel your crew with lunch, served outside."
      },
      {
        id: "launchpad-out", name: "Launchpad", activity: "Check-Out & Smruti Bhet", location: "Registration",
        color: "lavender", icon: "rocket", zone: "launchpad",
        sessions: [{ start: "16:00", end: "17:30" }],
        details: "Check out at Registration and pick up your Smruti Bhet before you leave."
      }
    ]
  },

  /* ----------------------------------------------------------------- MAP
     The map drawing is in app.js (buildMap); its words are here.
     schedule: ids from the schedule above whose times show for that spot. */
  map: {
    eyebrow: "Map",
    title: "Mission Map",
    intro: "Tap any location on the mandir picture to see what happens there and when.",
    imageAlt: "Aerial picture of BAPS Shri Swaminarayan Mandir, Dallas, with the five KDC locations marked.",
    enlargeLabel: "Enlarge map",
    pickPrompt: "Tap a location on the map or below.",
    // "spot" highlights another location's marker on the picture (for places
    // that don't have their own marker).
    zones: {
      universe:    { name: "Center of the Universe", schedule: ["universe"], info: "Mahāpūjā in the Nij Mandir (indoors). Shoe areas and restrooms are on either side of the hallway." },
      launchpad:   { name: "Launchpad", schedule: ["launchpad-in", "launchpad-out"], info: "Registration, check-out and Smruti Bhet, with the Photo Booth right beside it." },
      photobooth:  { name: "Photo Booth", spot: "launchpad", schedule: ["photobooth"], info: "At the Launchpad, beside Registration." },
      fuel:        { name: "Astronaut Fuel Station", schedule: ["fuel"], info: "Lunch is served outside." },
      zerogravity: { name: "Zero Gravity", schedule: ["zerogravity"], info: "Rides on the front field (outdoors)." },
      exhibition:  { name: "Mission: Light Within", schedule: ["mission"], info: "Indoors. Each mission starts with the Stage Program in the Sabha Hall (Room 1), then visits the four planets in the Dining Hall (Rooms 2–5) in any order.", link: "mission" },
      stage:       { name: "Stage Program · Room 1", spot: "exhibition", schedule: ["mission"], info: "Every Mission: Light Within starts here in the Sabha Hall, then continues into the exhibition.", link: "mission" }
    }
  },

  /* ------------------------------------------------------------- MISSION
     The four exhibition planets (visited in any order). Link straight to one with #planet-<id>,
     e.g. https://your-site/#planet-faith (great for a QR code in each room). */
  mission: {
    eyebrow: "Stage Program + Exhibition",
    title: "Mission: Light Within",
    intro: "Each mission starts with the Stage Program in the Sabha Hall (Room 1), then visits four planets in the Dining Hall (Rooms 2–5), in any order. At each planet, read the story together, tap the words to fill in the blanks, then take the big idea home.",
    wordBankLabel: "Word bank: fill in the blanks with your parents!",
    bigIdeaLabel: "Big idea",
    actionsTitle: "Actions to Take at Home",
    actionsIntro: "Try these with your family this week!",
    checkLabel: "Check my answers",
    resetLabel: "Start over",
    revealLabel: "Show answers",
    successText: "Planet complete! You earned a star in your Explorer's Passport.",
    tryAgainText: "Almost! Tap a red word to send it back, then try another.",
    nextLabel: "Next planet",
    prevLabel: "Previous planet",
    stops: [
      {
        id: "faith", planet: "Planet Faith", story: "The Story of Prahlād", color: "orange", icon: "planet-faith",
        paragraphs: [
          "King Hiranyakashyapu was very angry. “If your Bhagwān is so great, why can’t I see him? Where is he?” he shouted.",
          "The young [[Prahlād]] calmly replied, “Bhagwān is [[everywhere]].” The king laughed. “Then is he in this [[pillar]] too?” “Yes, he is,” said Prahlād. The whole court made fun of him, but Prahlād kept chanting, “Vishnu Devāy Namah.”",
          "Suddenly… **KABOOOM!** The pillar burst open, and out came [[Narasimha]], half man and half lion! He defeated the king, then placed Prahlād on his lap. “I am Vishnu, and I am pleased by your [[devotion]]. You will now be king.”",
          "Prahlād ruled the kingdom with Bhagwān’s blessings."
        ],
        bigIdea: "No matter what happens, Bhagwān is always with us, even when we can’t see him.",
        actions: [
          { title: "Pray every morning and night", text: "Before bed, fold your hands and thank Bhagwān for one good thing that happened today." },
          { title: "Chant when you feel scared", text: "Nervous before a test or a doctor visit? Slowly chant Bhagwān’s name, just like Prahlād did." },
          { title: "Go on a “Bhagwān is everywhere” hunt", text: "With your parents, find 3 things at home or outside that remind you of Bhagwān." },
          { title: "Share at dinner", text: "Tell your family about one time this week when you felt Bhagwān was with you." }
        ]
      },
      {
        id: "compassion", planet: "Planet Compassion", story: "The Story of Suvarna", color: "sky", icon: "planet-compassion",
        paragraphs: [
          "Deep in the blue sea lived [[Suvarna]], a little goldfish, and her friends. Whenever Warangana the big [[whale]] and her gang came by, everyone hid in fear.",
          "Great-grandma Torra, the wisest fish in the sea, told Suvarna about a magic [[pearl]] hidden deep in the ocean. First, Suvarna had to train every day: praying, exercising and trying her best. Some days she wanted to quit, but she kept going for her whole ocean family.",
          "A guardian blocked the pearl, but Suvarna bravely answered his riddles. The pearl, he said, was a reminder of the [[courage]] already inside her.",
          "When the whale came again, Suvarna and her friends met her with [[love]] instead of fear. Their kindness changed Warangana’s heart, and she became gentle too."
        ],
        bigIdea: "Love and kindness can turn fear into friendship.",
        actions: [
          { title: "Answer unkindness with kindness", text: "If someone is mean to you, take a deep breath and reply calmly instead of being mean back. Then tell a grown-up." },
          { title: "Do one kind thing every day", text: "Share your snack, help a sibling clean up, or make a card for a grandparent." },
          { title: "Include someone", text: "At school or the playground, invite a child who is alone to play or sit with you." },
          { title: "Be kind to yourself too", text: "When something is hard, say “I can do this!” like Suvarna, and practice a little each day." }
        ]
      },
      {
        id: "determination", planet: "Planet Determination", story: "The Story of Rām Setu", color: "yellow", icon: "planet-determination",
        paragraphs: [
          "[[Rām]] Bhagwān had to reach Lankā to rescue Sītā Mātā. But a huge [[ocean]] stood in the way, with no boats and no roads.",
          "Shri Rām prayed to Samudra Dev, the god of the ocean, and the whole army waited. Nothing happened. Everyone began to lose hope, except Rām Bhagwān. If there was no road, they would [[build]] one!",
          "The vānars wrote Rām Bhagwān’s name on [[rocks]] and dropped them into the sea. To everyone’s surprise, the rocks floated! Carrying giant stones was hard work, but Rām Bhagwān cheered them on. Stone by stone, the [[bridge]] grew.",
          "At last the Rām Setu was finished, and Shri Rām’s army crossed the ocean."
        ],
        bigIdea: "Never give up! When we keep trying, Bhagwān gives us strength.",
        actions: [
          { title: "Practice one hard thing", text: "Pick something tricky, like tying shoes, reading a page or a new song, and practice it 5 minutes every day this week." },
          { title: "Say “Stone by stone!”", text: "When you feel like giving up, say it out loud and try just one more time." },
          { title: "Make a never-give-up chart", text: "With your parents, add a sticker for each day you keep working on your goal." },
          { title: "Finish what you start", text: "Complete your homework, puzzle or chore before moving on to something new." }
        ]
      },
      {
        id: "servitude", planet: "Planet Servitude", story: "The Story of Shravan", color: "green", icon: "planet-servitude",
        paragraphs: [
          "Shravan’s mother and father were old and [[blind]], and he lovingly cared for their every wish. One day they asked to visit Bhārat’s holy places. Shravan built a [[kāvad]], a special carrier, and carried them on his [[shoulders]]. He loved them so much, he never felt their weight.",
          "Near Ayodhyā, his parents grew thirsty. As Shravan filled a water pot at the Sarayū river, King Dashrath, who was hunting nearby, heard the sound and shot an arrow by mistake.",
          "Badly hurt, Shravan thought only of his [[parents]]. “Please take this water to them,” he said, and he passed away. His heartbroken parents told the king that one day he too would miss his son. Years later, Dashrath did, when he longed for Shri Rām."
        ],
        bigIdea: "Help our parents with love every day, without waiting to be asked.",
        actions: [
          { title: "Do a chore without being asked", text: "Every day, clear your plate, put away your shoes or help fold the laundry." },
          { title: "Care for your parents like Shravan", text: "Bring them a glass of water, help carry groceries or get their slippers." },
          { title: "Say thank you every night", text: "Before bed, thank your parents for one thing they did for you today." },
          { title: "Notice who needs help", text: "If a grandparent, sibling or friend is struggling, step in and help them." }
        ]
      }
    ]
  },

  /* --------------------------------------------------------------- REELS
     Extra resources, shown last on the page. Each tile can have:
       youtubeId  a YouTube video id (the part after "v=" or after "/shorts/")
       playlist   a YouTube playlist id; plays its newest video first. A
                  channel's uploads playlist is its channel id with "UC"
                  changed to "UU".
       video      a video file path (e.g. "assets/video/welcome.mp4")
       url        an https:// link. On its own the tile opens this link;
                  with a video it shows below the player (linkLabel).
       image      a picture from assets/img/ to show on the tile
     Tiles with none of youtubeId, playlist, video or url show "Coming soon".

     "featured" is the big 16:9 video at the top of this section. Put the video
     file in assets/video/ and set video: "assets/video/mission-briefing.mp4"
     (MP4, 720p or 1080p, ideally under ~30 MB). poster is an optional cover
     picture from assets/img/. A YouTube id in youtubeId also works. Leave
     both empty to show "Coming soon". */
  reels: {
    title: "Mission Briefing",
    intro: "Watch your mission briefing before you launch, then explore more videos and resources below.",
    featured: { title: "Mission Briefing", video: "", youtubeId: "", poster: "" },   // TODO: add the briefing video
    moreTitle: "More Reels",
    swipeHint: "Swipe to see all reels →",
    comingSoon: "Coming soon",
    items: [
      { title: "Welcome, Astronauts!",     text: "Read Swaminarayan Bal Prakash, the BAPS kids' magazine.", url: "https://magazines.baps.org/Swaminarayan-Bal-Prakash-(English).aspx", image: "assets/img/bal-prakash.webp", icon: "astronaut" },
      { title: "Mission: Light Within",    text: "The newest video from BAPS Kids World.",   playlist: "UUdD59bc2EeIKvJ38coTziww", url: "https://www.youtube.com/@BAPSKidsWorld", linkLabel: "More videos at youtube.com/@BAPSKidsWorld", icon: "planet-determination" },
      { title: "Mahāpūjā & Stage Program", text: "Where to go and when to arrive.",           youtubeId: "UPHEODBT7dE", icon: "sun" }
    ]
  },

  /* ------------------------------------------------------------ PASSPORT
     "stop" links a star to a mission stop; it lights up automatically when
     that story is finished. Other stars are collected by tapping them. */
  passport: {
    eyebrow: "Explorer's",
    title: "Recap",
    intro: "Collect a star at every stop. Tap a star when you've been there. Planet stars light up when you finish that story.",
    progressLabel: "explored",
    resetLabel: "Reset passport",
    resetConfirm: "Clear all stars and story progress on this device?",
    completeTitle: "Mission complete, Explorer!",
    completeText: "You found the light within. Thank you for exploring with us!",
    stamps: [
      { id: "launchpad",     label: "Launchpad",              sub: "Registration",       icon: "rocket" },
      { id: "universe",      label: "Center of the Universe", sub: "Mahāpūjā",           icon: "sun" },
      { id: "stage",         label: "Stage Program",          sub: "Sabha Hall, Room 1", icon: "stage" },
      { id: "faith",         label: "Planet Faith",           sub: "Prahlād",            icon: "planet-faith",         stop: "faith" },
      { id: "compassion",    label: "Planet Compassion",      sub: "Suvarna",            icon: "planet-compassion",    stop: "compassion" },
      { id: "determination", label: "Planet Determination",   sub: "Rām Setu",           icon: "planet-determination", stop: "determination" },
      { id: "servitude",     label: "Planet Servitude",       sub: "Shravan",            icon: "planet-servitude",     stop: "servitude" },
      { id: "zerogravity",   label: "Zero Gravity",           sub: "Rides",              icon: "astronaut" },
      { id: "fuel",          label: "Astronaut Fuel Station", sub: "Lunch",              icon: "fuel" },
      { id: "photobooth",    label: "Photo Booth",            sub: "Say cheese!",        icon: "camera" }
    ]
  },

  /* ----------------------------------------------------------- REMINDERS
     icon: check, clock, shoe, flame, users, sun, car, food, pencil, camera,
     gift, help, video (or use emoji: "🎈"). Links: [text](https://...) */
  reminders: {
    eyebrow: "Before you launch",
    title: "Important Reminders",
    intro: "A few things to keep in mind for a smooth and joyful day.",
    items: [
      { icon: "check",  title: "Check in first", text: "Start your day at the Launchpad (Registration) during your check-in time: 9:00–10:00, 10:00–11:00 or 11:00 AM–12:00 PM. Signs and volunteers will guide you there." },
      { icon: "clock",  title: "Arrive on time for your booked times", text: "Please arrive on time for your Mahāpūjā and Mission: Light Within times so your crew can be seated." },
      { icon: "shoe",   title: "Shoes off for the Nij Mandir", text: "Use the shoe areas beside the restrooms on the way to the Center of the Universe." },
      { icon: "flame",  title: "Observe Mandir etiquette", text: "Please keep silence and show respect during darshan and Mahāpūjā." },
      { icon: "users",  title: "Stay with your children", text: "Children should stay with their parents or guardians at all times while moving around campus." },
      { icon: "sun",    title: "Dress for the weather", text: "Rides and lunch are outdoors, so dress for the weather and wear comfortable shoes." },
      { icon: "car",    title: "Parking", text: "Parking is available on site. Please follow the directions of the Mandir parking volunteers." },
      { icon: "food",   title: "Lunch is outside", text: "Refuel at the Astronaut Fuel Station between 12:00 and 4:00 PM." },
      { icon: "pencil", title: "Fill in the blanks together", text: "Each planet has a story to complete with your parents, on paper or right here." },
      { icon: "camera", title: "Visit the Photo Booth", text: "At the Launchpad, beside Registration, from 10:00 AM to 5:00 PM. Don't leave without a crew photo!" },
      { icon: "gift",   title: "Check out before you leave", text: "Stop by the Launchpad for check-out and your Smruti Bhet, 4:00 to 5:30 PM." },
      { icon: "help",   title: "Volunteers are here to help", text: "If you have a question or need directions, please ask any KDC volunteer." },
      { icon: "video",  title: "More videos for children", text: "Watch more videos for children on the BAPS Kids YouTube channel: [youtube.com/@BAPSKidsWorld](https://www.youtube.com/@BAPSKidsWorld)" }
    ]
  },

  /* -------------------------------------------------------------- FOOTER */
  footer: {
    thankYou: "Thank you for exploring with us!",
    backToTop: "Back to top",
    installLabel: "Install the app"
  }
};
