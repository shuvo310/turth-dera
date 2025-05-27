document.addEventListener('DOMContentLoaded', () => {
    console.log("Truth & Dare JS Initialized - v15 Optional Player Names, Modal Title Fixed");

    // --- DOM Element Getters ---
    function getElem(id) {
        const elem = document.getElementById(id);
        if (!elem) console.error(`CRITICAL: DOM Element with ID '${id}' not found.`);
        return elem;
    }

    const playerSetupSection = getElem('player-setup-section');
    const gameBoardSection = getElem('game-board-section');
    const playerCountInput = getElem('player-count');
    const setPlayerCountBtn = getElem('set-player-count-btn');
    const playerNamesInputArea = getElem('player-names-input-area');
    const startGameBtn = getElem('start-game-btn');
    
    const wheel = getElem('wheel');
    const pointerContainer = getElem('pointer-container');
    const spinCenterBtn = getElem('spin-center-btn');
    const actionModalOverlay = getElem('action-modal');
    const modalContent = actionModalOverlay?.querySelector('.modal-content');
    const closeModalBtn = actionModalOverlay?.querySelector('.close-modal-btn');
    const modalChoiceStep = getElem('modal-choice-step');
    const modalActionDisplayStep = getElem('modal-action-display-step');
    const modalSelectedPlayerNameSpan = getElem('modal-selected-player-name');
    const modalTruthBtn = getElem('modal-truth-btn');
    const modalDareBtn = getElem('modal-dare-btn');
    const modalActionTypeH3 = getElem('modal-action-type');
    const modalActionTextP = getElem('modal-action-text');
    const modalNextTurnBtn = getElem('modal-next-turn-btn');

    // --- State Variables ---
    let players = [];
    let segmentTextElements = [];
    let currentPlayerTurnIndex = 0; 
    let playerSelectedBySpin;     
    let currentPointerContainerRotation = 0;
    let isSpinning = false;
    let consecutiveSpinCounts = {};
    const MAX_CONSECUTIVE_SPINS = 3;

    // --- Constants ---
    const truths_bn = [
        "আপনার জীবনের সবচেয়ে বড় অনুশোচনা কোনটি?", "আপনার সবচেয়ে বড় স্বপ্ন কি?",

"আপনি কখনো কোনো গোপন প্রেমের সম্পর্ক গড়েছেন?",

"আপনার সবচেয়ে বড় দুঃখের মুহূর্ত কী ছিল?",

"আপনি যদি একজন দিন বিখ্যাত হতে পারতেন, কীভাবে হতে চাইতেন?",

"আপনার সবচেয়ে বড় আশ্চর্যজনক অভিজ্ঞতা কি?",

"কখনো কি আপনি কাউকে অপছন্দ করেছেন কিন্তু মুখে কিছু বলেননি?",

"আপনার প্রিয় গানের ধরন কী?",

"আপনি কী কখনো মিথ্যা বলার চেষ্টা করেছেন?",

"আপনি যদি কোনো জিনিস বদলাতে পারতেন, সেটা কি হত?",

"আপনার সবচেয়ে বড় দুঃখজনক অভিজ্ঞতা কী?",

"আপনার জীবনের সবচেয়ে বড় পছন্দ কী ছিল?",

"কখনো কি আপনি কাউকে বা কিছু দোষারোপ করেছেন নিজের ভুল আড়াল করার জন্য?",

"আপনার সবচেয়ে বড় ট্যুরিস্ট গন্তব্য কোনটি ছিল?",

"আপনি যদি পৃথিবী জুড়ে কোথাও যেতে পারতেন, আপনি কোথায় যেতেন?",

"আপনি যদি নিজের জীবনকে সিনেমায় রূপান্তর করতে পারতেন, সেটি কী ধরনের সিনেমা হতো?",

"আপনার সবচেয়ে বড় শখ কী?",

"কখনো কি আপনি কোনো বিপদে পড়েছেন যা আপনি নিজে থেকে বের হতে পারেননি?",

"আপনার জীবনের সবচেয়ে বড় সাফল্য কী ছিল?",

"আপনি কখনো কোনো ছোটখাটো অপরাধ করেছেন?",

"আপনার সবচেয়ে প্রিয় খাবার কোনটি?",

"আপনার শখ বা আগ্রহ সম্পর্কে এক নতুন তথ্য শেয়ার করুন।",

"আপনি কখনো কল্পনা করেছেন যদি আপনার জীবনের গল্প একটি বই হতো, তার নাম কী হবে?",

"কখনো কি আপনি নিজের বন্ধুদের সাথে প্রতারণা করেছেন?",

"আপনার প্রিয় রঙ কী?",

"কখনো কি আপনি কোনো কঠিন পরিস্থিতিতে হাল ছেড়ে দিয়েছেন?",

"আপনার সবচেয়ে প্রিয় খেলা কোনটি?",

"আপনার জীবনের সবচেয়ে অদ্ভুত অভিজ্ঞতা কোনটি ছিল?",

"আপনি যদি ভুতুড়ে জায়গায় একা থাকতে পারতেন, সেখানে থাকতেন?",

"আপনি কি কখনো এক মিনিটের জন্য জনপ্রিয় হতে চান?",

"কখনো কি আপনি নিজের জীবনের বড় সিদ্ধান্তে ভুল করেছেন?",

"আপনার পছন্দের এক আদর্শ চরিত্র কোনটি?",

"কখনো কি আপনি নিজেকে শোভাবর্ধন করতে ভান করেছেন?",

"কখনো কি আপনি কাউকে বিরক্ত করেছেন?",

"আপনি যদি কোনো একটি জাতির নাগরিক হতে পারতেন, সেটি কোনটি হতো?",

"আপনার জীবনের সবচেয়ে বড় ভয় কি?",

"কখনো কি আপনি কাউকে সাহায্য করার চেষ্টা করেছেন, কিন্তু ব্যর্থ হয়েছেন?",

"আপনি যদি পৃথিবীর কোনো সুপারহিরো হতে পারতেন, সেটি কে হতো?",

"আপনি কখনো কোনো ভুল বুঝেছেন এবং পরে তা স্বীকার করেছেন?",

"আপনি কখনো ভালোবাসার জন্য কিছু করার চেষ্টা করেছেন কিন্তু ব্যর্থ হয়েছেন?",

"আপনার সবচেয়ে বড় হ্যাপি মোমেন্ট কোনটি?",

"আপনার জীবনে সবচেয়ে বড় কিছু পরিবর্তন হয়েছে কিনা?",

"কখনো কি আপনি নিজের ভুলের জন্য দুঃখিত হয়েছেন?",

"আপনার সবচেয়ে প্রিয় স্মৃতি কোনটি?",

"আপনি যদি এক মুহূর্তে একাধিক মানুষকে সাহায্য করতে পারতেন, তবে সেটা কীভাবে করতেন?",

"আপনার সবচেয়ে বড় সমস্যা কোনটি ছিল?",

"আপনার সবচেয়ে বড় অর্জন কী?",

"আপনি যদি কিছু একটা চিরকালীন করতে পারতেন, সেটা কী হতো?",

"আপনি কি কখনো স্কুলে বা কলেজে কিছু মজার ঘটনা ঘটিয়েছেন?",

"কখনো কি আপনি অন্যদের নিয়ে মজা করেছেন?",

"আপনার জীবনের সবচেয়ে বড় পরাজয় কোনটি ছিল?", "যদি অদৃশ্য হতে পারতেন, প্রথম কোন কাজটি করতেন?",
        "আপনার এমন একটি গোপন প্রতিভার কথা বলুন যা কেউ জানে না।","আপনার জীবনের সবচেয়ে বিব্রতকর পোশাক কোনটি ছিল?",
        "কখনো কি স্কুল বা কলেজ পালিয়েছেন? কেন?", "আপনার সবচেয়ে বড় ভয় কি?",
        "যদি লটারিতে এক কোটি টাকা জিতেন, তাহলে কী করবেন?", "আপনার প্রিয় শৈশবের স্মৃতি কোনটি?",
        "এমন কোনো খাবার আছে যা আপনি একদমই খেতে পারেন না?", "কোনোদিন পরীক্ষায় নকল করেছেন?"
    ];
    const dares_bn = [
        "অন্যান্য খেলোয়াড়দের বেছে নেওয়া একটি গান জোরে জোরে গাও।", "একজন বিখ্যাত সেলিব্রিটির নকল করো যতক্ষণ না কেউ বুঝতে পারে কে সে।",
        "পরবর্তী দুটি রাউন্ডের জন্য হাতে মোজা পরে থাকো।", "একটি মুরগির মতো আচরণ করো এবং মুরগির ডাক ডেকে ঘরের চারপাশে কয়েকবার চক্কর দাও।",
        "আপনার ফোনের সর্বশেষ ছবিটি সবাইকে দেখান।", "এক গ্লাস পানি কোনো রকম হাত না লাগিয়ে পান করুন।",
        "পরবর্তী খেলোয়াড়ের পালা না আসা পর্যন্ত একটি মজার মুখভঙ্গি করে বসে থাকুন।", "আপনার কনুই দিয়ে আপনার নাক স্পর্শ করার চেষ্টা করুন।",
        "আপনার প্রিয় গানটি গাওয়ার চেষ্টা করুন।",

"এক মিনিটের জন্য আপনার প্রিয় সেলিব্রিটির মতো আচরণ করুন।",

"যেকোনো একটি গান বাজিয়ে শোনান এবং সবাইকে গানের সাথে নাচানোর চেষ্টা করুন।",

"পড়ার সময়ে প্রিয় বইটি সবাইকে শেয়ার করুন।",

"আপনার পছন্দের খাবারের নাম বলুন এবং সবার সামনে তা খাওয়ার চেষ্টা করুন।",

"একজন খেলোয়াড়কে তার প্রিয় স্থানটি বলুন।",

"আপনার সবচেয়ে ভয়ানক অভিজ্ঞতা জানিয়ে দিন।",

"এক মিনিটে যতটা সম্ভব পোকামাকড় সম্পর্কে তথ্য বলুন।",

"আপনি যদি একদিন খুব বিশাল হয়ে উঠতে চান, তার জন্য কী করবেন?",

"আপনার প্রিয় চলচ্চিত্রের একটি দৃশ্য নাটকীয়ভাবে অভিনয় করে দেখান।",

"প্রথমে মজার প্রশ্ন দিন এবং সবার একে অপরকে সৎ উত্তর দেওয়া বাধ্য করুন।",

"সবাইকে মজার গল্প শোনান যা আপনির জীবনে ঘটেছে।",

"আপনার ফোনের পুরোনো ছবি দেখান এবং তার সঙ্গে একটি হাস্যকর গল্প শেয়ার করুন।",

"একটি শব্দ দিয়ে একটি নাটক তৈরি করুন।",

"আপনার জীবনের সবচেয়ে বড় লজ্জাজনক মুহূর্ত সম্পর্কে বলুন।",

"একটি গল্প শোনান যা সম্পূর্ণ কাল্পনিক কিন্তু মজার।",

"যেকোনো একটি ক্রেজি শখ বলুন।",

"পৃথিবীর সবচেয়ে মজার শব্দ বলে সবাইকে হাসিয়ে দিন।",

"মুখভঙ্গি পাল্টানোর চ্যালেঞ্জ নিন এবং সবাইকে দেখান।",

"নিজের পছন্দের অদ্ভুত খাবার খেতে বলুন।",

"এক মিনিটের জন্য অন্য কোনো খেলোয়াড়ের মতো কথা বলুন।",

"অন্য খেলোয়াড়দের জন্য একটি মজার খেলনা তৈরি করুন।",

"কোনো এক অদ্ভুত জায়গায় যাওয়ার স্বপ্ন বলুন।",

"একটি ছবি আঁকুন এবং সবাইকে বলুন এর সঙ্গে সম্পর্কিত কিছু হাস্যকর তথ্য।",

"মাঠের প্রতিযোগিতার মতো চিৎকার করে বলুন, 'আমি জয়ী হব!'",

"একটি নতুন ভাষায় হ্যালো বলুন।",

"যেকোনো একটি হাস্যকর চরিত্রের মতো অভিনয় করুন।",

"একটি অদ্ভুত কৌতুক বলুন।",

"আপনার জীবনের সবচেয়ে আনন্দের মুহূর্তটি শেয়ার করুন।",

"দুই মিনিটের মধ্যে তিনটি মজার শব্দ বলুন।",

"আপনার পছন্দের গল্পটি চিত্কার করে বলুন।",

"এখন একটি অদ্ভুত নাচ করে দেখান।",

"আপনি যদি শৈশবে ফিরে যেতে পারেন, তাহলে কোন খেলাটি খেলতেন?",

"একজন খেলোয়াড়কে একটি পাগলামি করতে বলুন।",

"একটি মজার মুখভঙ্গি তৈরি করুন এবং সেটা সবাইকে দেখান।",

"সবার সামনে আপনার পছন্দের গানটি গেয়ে দেখান।",

"একটি হাস্যকর অঙ্গভঙ্গি করুন।",

"একটি অদ্ভুত শব্দ উচ্চারণ করুন এবং সবাইকে বলুন এটি কেমন লাগে।",

"নিজের প্রিয় রঙের পোশাক পরিধান করুন এবং সেটি সবার সামনে দেখান।",

"একটি হাস্যকর মুখ বানিয়ে অন্য খেলোয়াড়দের কাছে তুলে ধরুন।",

"অন্য খেলোয়াড়ের পছন্দের গানটি গাইতে বলুন।",

"এক মিনিটের জন্য সবাইকে অদ্ভুতভাবে হাসাতে চেষ্টা করুন।",

"একটি প্রিয় বাচ্চাদের গল্প শোনান।",

"নিজের জীবন থেকে একটি চ্যালেঞ্জ শেয়ার করুন।",

"এক মিনিটে একটি এক্সপ্রেশন বানিয়ে সবার কাছে তুলে ধরুন।",

"একজন খেলোয়াড়কে সেলফি তুলতে বলুন এবং সেটি everyoneকে শো করান।",

"একটি অদ্ভুত শব্দে কথা বলুন, যা কেউ বোঝে না।",

"পৃথিবীর সবচেয়ে অদ্ভুত খাবারের নাম বলুন।",

"একটি মজার শখ শেয়ার করুন।",

"যেকোনো এক অদ্ভুত স্থান নির্বাচন করুন এবং সেখানে যাওয়ার জন্য কাউকে চ্যালেঞ্জ করুন।",

"যে কোনো একটি সিনেমার চরিত্রের মতো কাজ করুন।",

"একটি রোমান্টিক প্রস্তাবনা দিন যেনো এটি সবচেয়ে অভিনব।",

"নিজের পছন্দের গানের সুরে সবার কাছে কিছু বলুন।",

"আপনার প্রিয় ক্রিকেট ম্যাচের একটি মজার মুহূর্ত শেয়ার করুন।",

"একটি প্রিয় পার্টি গান গাইতে বলুন।",

"নিজের সবচেয়ে অদ্ভুত অভিজ্ঞতার কথা বলুন।",

"কোনো সিনেমার বিশেষ চরিত্রের মতো অভিনয় করুন।",

"একটি সেলফি তুলুন এবং সেটা পুরো দলকে দেখান।",

"বিগত দিনের একটি হাস্যকর ছবি দেখান।",

"অদ্ভুত খাবার খেতে বলা হলে কি করতে চান?",

"একটি মজার সিনেমার দৃশ্য পুনর্নির্মাণ করুন।",

"প্রিয়জনদের জন্য একটি কমপ্লিমেন্ট দিন।",

"এক মিনিটের জন্য উল্টোভাবে হাঁটার চেষ্টা করুন।",

"প্রিয় ফুটবল দলের নাম বলে একটি উল্লাস করুন।",

"একটি উল্টো শব্দ উচ্চারণ করুন এবং সবাইকে চেষ্টা করতে বলুন।",

"একটি অদ্ভুত সেলফি নিন এবং সেটি everyoneকে দেখান।",

"আপনার প্রিয় স্পোর্টস সম্পর্কে শেয়ার করুন।",

"নিজের রুমের মজার দৃশ্য শেয়ার করুন।",

"যেকোনো একটি ইন্টারেস্টিং ভ্রমণ সম্পর্কে বলুন।",

"এক মিনিটের জন্য সার্কাসের মতো অভিনয় করুন।",

"প্রিয় সিনেমার এক্সপ্রেশন দিয়ে দেখান।",

"কোনো বিখ্যাত সেলিব্রিটির জন্য অডিশন দিন।",

"পৃথিবীর সবচেয়ে অদ্ভুত স্থান সম্পর্কে বলুন।",

"একটি সেলফি তুলুন এবং সবাইকে বলুন এটা সবচেয়ে ভালো ছবি।",

"কোনো ভুল সিদ্ধান্তের অভিজ্ঞতা বলুন।",

"যেকোনো একটি মজার গল্প শুনান।",

"সকলকে একটি হ্যাপি নাচ শিখান।",

"একটি মজার কবিতা বলুন।",

"আপনার পছন্দের গানটি সবাইকে শোনান।",

"দেখান আপনার প্রিয় মুভির একটি দৃশ্য।",

"অন্য খেলোয়াড়দের জন্য একটি পছন্দের বিষয় বলুন।",

"মজার কিছু শেয়ার করুন যা কখনও ঘটেছে।",

"আপনার সবচেয়ে প্রিয় রঙ নিয়ে একটি চ্যালেঞ্জ দিন।",

"একটি খেলোয়াড়কে প্রস্তাব দিন তারা একটি চরিত্র খেলতে চাইলে কী হবে।",

"একটি অদ্ভুত ভাষায় কথা বলুন।",

"একটি ক্রেজি রিয়েলিটি শো শো অফ করুন।",

"আপনার প্রিয় শহরের নাম বলুন।",

"নিজের জীবনের পছন্দের দিনের অভিজ্ঞতা বলুন।",

"কোনো এক বিখ্যাত গান গাওয়ার চেষ্টা করুন।",

"নিজের প্রিয় স্মৃতি সবার কাছে শেয়ার করুন।",

"একটি হাস্যকর পরিস্থিতি তৈরি করুন।",

"আপনার সবচেয়ে প্রিয় চরিত্র শেয়ার করুন।",

"একটি অদ্ভুত শব্দ উচ্চারণ করুন।",

"একটি ঐতিহাসিক ঘটনা সম্পর্কিত মজার তথ্য বলুন।",

"এক মিনিটে সবচেয়ে দ্রুত সম্ভব মুখভঙ্গি পরিবর্তন করুন।",

"দুনিয়ার সবচেয়ে অদ্ভুত জিনিস কি?",

"নিজের পছন্দের স্থানে একটি চিত্র আঁকুন।",

"একটি নতুন গানের সুর গাইতে বলুন।",

"কোনো একজনকে বিপদের মধ্যে ফেলার চেষ্টা করুন।",

"নিজের একটি বিখ্যাত উদ্ধৃতি বলুন।",
        "রুমে উপস্থিত যে কোনো একজনকে একটি আন্তরিক প্রশংসা করুন।", "আপনার মাথার উপর একটি বই রেখে ঘরের এক প্রান্ত থেকে অন্য প্রান্তে হেঁটে যান।"
    ];
    const playerColors = ['#EF5350', '#FFEE58', '#66BB6A', '#42A5F5', '#AB47BC', '#FFA726', '#26A69A', '#FF7043'];

    // --- Helper Functions ---
    function switchSection(activeSectionId) {
        document.querySelectorAll('.game-section').forEach(section => {
            if(section) {
                section.classList.remove('active', 'animate__fadeInUp', 'animate__fadeInDown');
                section.style.display = 'none';
            }
        });
        const activeSec = getElem(activeSectionId);
        if (activeSec) {
            activeSec.style.display = 'block';
            activeSec.classList.add('active', 'animate__animated', 'animate__fadeInUp');
        }
    }

    function openModal() {
        if (!actionModalOverlay || !modalChoiceStep || !modalActionDisplayStep || !modalContent || !modalSelectedPlayerNameSpan) {
            console.error("CRITICAL: Modal core elements missing. Cannot open modal.");
            return;
        }
        // মোডালের শিরোনামে শুধুমাত্র "তোমার পছন্দ:" দেখানো হবে
        modalSelectedPlayerNameSpan.textContent = "তোমার পছন্দ:"; 
        console.log(`MODAL OPENED. Title set to "তোমার পছন্দ:". Selected player for T/D: ${playerSelectedBySpin ? playerSelectedBySpin.name : 'N/A'}`);

        modalChoiceStep.style.display = 'block';
        modalActionDisplayStep.style.display = 'none';
        actionModalOverlay.style.display = 'flex';
        modalContent.classList.remove('animate__zoomOut', 'animate__fadeOut');
        modalContent.classList.add('animate__zoomIn', 'animate__fadeIn');
    }

    function closeModal() {
        // (এই ফাংশনটি আগের মতোই ঠিক আছে)
        if (actionModalOverlay && modalContent) {
            modalContent.classList.remove('animate__zoomIn', 'animate__fadeIn');
            modalContent.classList.add('animate__zoomOut');
            const handleAnimationEnd = () => {
                if (actionModalOverlay) actionModalOverlay.style.display = 'none';
                if (modalContent) {
                    modalContent.removeEventListener('animationend', handleAnimationEnd);
                    modalContent.classList.remove('animate__zoomOut');
                }
            };
            modalContent.addEventListener('animationend', handleAnimationEnd, { once: true });
        }
        if (spinCenterBtn) {
            spinCenterBtn.disabled = false;
            spinCenterBtn.textContent = "স্পিন!";
        }
        isSpinning = false;
        segmentTextElements.forEach(el => { if(el) el.classList.remove('selected'); });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (actionModalOverlay) actionModalOverlay.addEventListener('click', (event) => { if (event.target === actionModalOverlay) closeModal(); });


    function createWheelSegments() { 
        // (এই ফাংশনটি আগের মতোই ঠিক আছে)
        if (!wheel) { console.error("Wheel element not found."); return; }
        wheel.innerHTML = '';
        segmentTextElements = [];
        const numPlayers = players.length;
        if (numPlayers < 1) { console.warn("Not enough players for wheel."); return; }
        const anglePerSegment = 360 / numPlayers;
        const wheelDiameter = wheel.offsetWidth;
        if (wheelDiameter === 0) {
            console.error("Wheel diameter is 0! Retrying...");
            setTimeout(createWheelSegments, 100);
            return;
        }
        const wheelRadius = wheelDiameter / 2;
        const drawingRotationOffset = -90; 
        for (let i = 0; i < numPlayers; i++) {
            const segment = document.createElement('div');
            segment.classList.add('segment');
            segment.style.backgroundColor = players[i].color;
            segment.style.width = '50.5%'; segment.style.height = '100.5%';
            segment.style.top = '-0.25%'; segment.style.left = '50%';
            const segmentInitialAngleOnWheel = anglePerSegment * i;
            const visualSegmentRotationForCSS = segmentInitialAngleOnWheel + drawingRotationOffset;
            segment.style.transform = `rotate(${visualSegmentRotationForCSS}deg)`;
            const clipAngleRad = anglePerSegment * (Math.PI / 180);
            const yClipPercentBase = 50 * Math.tan(clipAngleRad / 2);
            const oversizeFactor = 1.02; const clipPathXOuter = 100.5;
            let finalClipPath;
            if (anglePerSegment < 179.8 && anglePerSegment > 0.2) {
                 const yOuterClip = Math.min(49.95, yClipPercentBase * oversizeFactor);
                 finalClipPath = `polygon(0% 50%, ${clipPathXOuter}% ${50 - yOuterClip}%, ${clipPathXOuter}% ${50 + yOuterClip}%)`;
            } else {
                 finalClipPath = `polygon(-0.5% -0.5%, ${clipPathXOuter}% -0.5%, ${clipPathXOuter}% 100.5%, -0.5% 100.5%)`;
            }
            segment.style.clipPath = finalClipPath;
            const textElement = document.createElement('div');
            textElement.classList.add('segment-text');
            let playerNameText = players[i].name; // ডিফল্ট নাম ব্যবহার করা হবে যদি ইনপুট খালি থাকে
            let maxNameLength = 12;
            if (numPlayers > 4) maxNameLength = 10; if (numPlayers > 6) maxNameLength = 8;
            if (wheelDiameter < 300 && numPlayers > 5) maxNameLength = Math.max(5, maxNameLength - 2);
            if (playerNameText.length > maxNameLength) playerNameText = playerNameText.substring(0, maxNameLength -1) + "..";
            textElement.textContent = playerNameText;
            let baseFontSize = wheelDiameter / 35;
            if (numPlayers >= 5) baseFontSize *= 0.92; if (numPlayers >= 7) baseFontSize *= 0.88;
            const minPxSize = window.innerWidth < 600 ? 7.8 : 9.5;
            textElement.style.fontSize = `${Math.max(minPxSize, baseFontSize)}px`;
            textElement.style.lineHeight = `1.25`;
            const textDistanceFromCenter = wheelRadius * 0.74;
            const textArcAngleRad = clipAngleRad * 0.8;
            const maxTextWidth = 2 * textDistanceFromCenter * Math.sin(textArcAngleRad / 2) * 0.82;
            textElement.style.maxWidth = `${Math.max(30, maxTextWidth)}px`;
            textElement.style.position = 'absolute'; textElement.style.left = `${textDistanceFromCenter}px`;
            textElement.style.top = `50%`;
            const textCounterRotation = -visualSegmentRotationForCSS;
            textElement.style.transform = `translate(-50%, -50%) rotate(${textCounterRotation}deg)`;
            textElement.dataset.originalRotation = `${textCounterRotation}`;
            segment.appendChild(textElement); wheel.appendChild(segment); segmentTextElements.push(textElement);
        }
        if (pointerContainer) {
            currentPointerContainerRotation = 0; pointerContainer.style.transition = 'none';
            pointerContainer.style.transform = `rotate(0deg)`; void pointerContainer.offsetWidth;
            pointerContainer.style.transition = 'transform 5s cubic-bezier(0.22, 1, 0.36, 1)';
        }
    }

    // --- Event Listeners (player setup) ---
    if (setPlayerCountBtn && playerCountInput && playerNamesInputArea && startGameBtn) {
        setPlayerCountBtn.addEventListener('click', () => {
            const count = parseInt(playerCountInput.value);
            if (count >= 2 && count <= 8) {
                playerNamesInputArea.innerHTML = '';
                for (let i = 0; i < count; i++) {
                    const div = document.createElement('div'); div.classList.add('form-group');
                    // *** পরিবর্তন এখানে: লেবেল টেক্সট এবং input.required সরানো হয়েছে ***
                    const label = document.createElement('label'); label.textContent = `খেলোয়াড় ${i + 1}-এর নাম (ঐচ্ছিক):`;
                    const input = document.createElement('input'); input.type = 'text'; input.placeholder = `নাম (খালি রাখলে ডিফল্ট নাম)`; input.id = `player-name-${i}`; 
                    // input.required = true; // এই লাইনটি সরানো হয়েছে
                    div.appendChild(label); div.appendChild(input); playerNamesInputArea.appendChild(div);
                }
                startGameBtn.style.display = 'inline-block';
            } else {
                alert("খেলোয়াড়ের সংখ্যা ২ থেকে ৮ এর মধ্যে হতে হবে।");
                startGameBtn.style.display = 'none'; playerNamesInputArea.innerHTML = '';
            }
        });
    }

    if (startGameBtn && playerCountInput) {
        startGameBtn.addEventListener('click', () => {
            players = [];
            consecutiveSpinCounts = {};
            const count = parseInt(playerCountInput.value);
            
            for (let i = 0; i < count; i++) {
                const nameInput = document.getElementById(`player-name-${i}`);
                let playerName = nameInput ? nameInput.value.trim() : '';
                // *** পরিবর্তন এখানে: যদি নাম খালি থাকে, ডিফল্ট নাম ব্যবহার করা হবে ***
                if (playerName === '') {
                    playerName = `খেলোয়াড় ${i + 1}`; 
                }
                players.push({ id: i, name: playerName, color: playerColors[i % playerColors.length] });
                consecutiveSpinCounts[playerName] = 0; // নামের উপর ভিত্তি করে কাউন্ট
            }

            if (players.length < 2) { alert("কমপক্ষে ২ জন খেলোয়াড় প্রয়োজন।"); return; }
            
            console.log("Players Initialized:", players); // প্লেয়ারদের তালিকা কনসোলে দেখানো হচ্ছে

            currentPlayerTurnIndex = Math.floor(Math.random() * players.length);
            switchSection('game-board-section');
            setTimeout(() => {
                createWheelSegments();
                if (spinCenterBtn) {
                    spinCenterBtn.disabled = false;
                    spinCenterBtn.textContent = "স্পিন!";
                }
                isSpinning = false;
            }, 250);
        });
    }

    // --- Spin Logic ---
    if (spinCenterBtn && pointerContainer && wheel) {
        spinCenterBtn.addEventListener('click', () => {
            if (isSpinning) return;
            if (players.length === 0) { alert("প্রথমে খেলোয়াড় তৈরি করুন।"); return; }

            isSpinning = true;
            playerSelectedBySpin = null; 
            spinCenterBtn.disabled = true;
            spinCenterBtn.textContent = "ঘুরছে...";
            segmentTextElements.forEach(el => {
                if (el) {
                    el.classList.remove('selected');
                    const originalRotation = el.dataset.originalRotation || '0';
                    el.style.transform = `translate(-50%, -50%) rotate(${originalRotation}deg) scale(1)`;
                }
            });

            const numPlayers = players.length;
            const anglePerSegment = 360 / numPlayers;

            let preliminaryTargetPlayerIndex;
            let attempt = 0;
            const maxAttempts = numPlayers * 4; 
            do {
                preliminaryTargetPlayerIndex = Math.floor(Math.random() * numPlayers);
                attempt++;
                if (attempt > maxAttempts) {
                    console.warn("Max attempts for non-consecutive player. Resetting counts & picking first player as fallback.");
                    for (const playerName in consecutiveSpinCounts) { consecutiveSpinCounts[playerName] = 0; }
                    preliminaryTargetPlayerIndex = 0; 
                    break;
                }
            } while (players[preliminaryTargetPlayerIndex] &&
                     consecutiveSpinCounts[players[preliminaryTargetPlayerIndex].name] >= MAX_CONSECUTIVE_SPINS &&
                     numPlayers > 1);

            const targetSegmentMiddleAngle_12oclock = (anglePerSegment * preliminaryTargetPlayerIndex) + (anglePerSegment / 2);
            let desiredFinalAngleForPointerContainer = (360 - targetSegmentMiddleAngle_12oclock + 360) % 360;
            const baseSpins = 3 + Math.floor(Math.random() * 4); 
            const previousFullSpinsInJS = Math.floor(currentPointerContainerRotation / 360);
            let finalTargetRotationForPointerContainer = ((previousFullSpinsInJS + baseSpins) * 360) + desiredFinalAngleForPointerContainer;
            finalTargetRotationForPointerContainer += (Math.random() - 0.5) * (anglePerSegment * 0.35);

            console.log(`SPIN ACTION: Targeting player index ${preliminaryTargetPlayerIndex} (${players[preliminaryTargetPlayerIndex]?.name}).`);
            console.log(`SPIN ACTION: CSS Target Rotation for pointerContainer: ${finalTargetRotationForPointerContainer.toFixed(2)}.`);

            if (pointerContainer) {
                pointerContainer.style.transform = `rotate(${finalTargetRotationForPointerContainer}deg)`;
            }

            setTimeout(() => {
                let actualFinalCssRotation = 0;
                if (pointerContainer.style.transform) {
                    const match = pointerContainer.style.transform.match(/rotate\(([^deg)]+)deg\)/);
                    if (match && match[1]) {
                        actualFinalCssRotation = parseFloat(match[1]);
                    }
                }
                currentPointerContainerRotation = actualFinalCssRotation; 

                let normalizedActualPointerRotation = (actualFinalCssRotation % 360 + 360) % 360;
                let effectiveWheelAngleAtPointer_12oclock = (360 - normalizedActualPointerRotation + 360) % 360;
                
                let finalSelectedIndex = Math.floor(effectiveWheelAngleAtPointer_12oclock / anglePerSegment);
                finalSelectedIndex = (finalSelectedIndex % numPlayers + numPlayers) % numPlayers; 

                console.log(`SPIN RESULT: Final CSS Rotation: ${actualFinalCssRotation.toFixed(2)}.`);
                console.log(`SPIN RESULT: Effective Wheel Angle @12 o'clock: ${effectiveWheelAngleAtPointer_12oclock.toFixed(2)}.`);
                console.log(`SPIN RESULT: Calculated Final Index: ${finalSelectedIndex}.`);

                if (players[finalSelectedIndex] && players[finalSelectedIndex].name) {
                    playerSelectedBySpin = players[finalSelectedIndex]; 
                    console.log(`SPIN RESULT: PLAYER ASSIGNED TO playerSelectedBySpin: Name: "${playerSelectedBySpin.name}", ID: ${playerSelectedBySpin.id}.`);
                    
                    for (const name in consecutiveSpinCounts) {
                        if (name !== playerSelectedBySpin.name) {
                            consecutiveSpinCounts[name] = 0;
                        }
                    }
                    consecutiveSpinCounts[playerSelectedBySpin.name]++;
                    
                    openModal(); 

                    const selectedTextEl = segmentTextElements[finalSelectedIndex];
                    if (selectedTextEl) {
                        selectedTextEl.classList.add('selected');
                        const textRotation = selectedTextEl.dataset.originalRotation || '0';
                        selectedTextEl.style.transform = `translate(-50%, -50%) rotate(${textRotation}deg) scale(1.2)`; 
                    }
                } else {
                    console.error(`SPIN ERROR: Player not found or name missing at index ${finalSelectedIndex}. Player data:`, players[finalSelectedIndex]);
                    playerSelectedBySpin = null; 
                    isSpinning = false;
                    if(spinCenterBtn) { spinCenterBtn.disabled = false; spinCenterBtn.textContent = "স্পিন!"; }
                    closeModal(); 
                }
            }, 5250); 
        });
    }

    // --- Modal Action Logic ---
    function handleChoice(type) {
        if (!playerSelectedBySpin || !playerSelectedBySpin.name || !modalActionTypeH3 || !modalActionTextP || !modalChoiceStep || !modalActionDisplayStep) {
            console.error("MODAL ACTION ERROR: playerSelectedBySpin is invalid or modal elements missing.");
            closeModal(); return;
        }
        let item, typeText, typeColor;
        if (type === 'Truth') {
            item = truths_bn[Math.floor(Math.random() * truths_bn.length)];
            typeText = "সত্য বলুন:"; typeColor = "var(--truth-color)";
        } else {
            item = dares_bn[Math.floor(Math.random() * dares_bn.length)];
            typeText = "চ্যালেঞ্জ নিন:"; typeColor = "var(--dare-color)";
        }
        if(modalActionTypeH3) {
            modalActionTypeH3.textContent = typeText; modalActionTypeH3.style.color = typeColor;
        }
        if(modalActionTextP) modalActionTextP.innerHTML = `<strong>${playerSelectedBySpin.name}</strong>, ${item}`;
        
        if(modalChoiceStep) modalChoiceStep.style.display = 'none';
        if(modalActionDisplayStep) modalActionDisplayStep.style.display = 'block';
    }

    if (modalTruthBtn) modalTruthBtn.addEventListener('click', () => handleChoice('Truth'));
    if (modalDareBtn) modalDareBtn.addEventListener('click', () => handleChoice('Dare'));

    if (modalNextTurnBtn) {
        modalNextTurnBtn.addEventListener('click', () => {
            closeModal();
            currentPlayerTurnIndex = (currentPlayerTurnIndex + 1) % players.length;
            console.log(`GAME FLOW: Next player to spin (internal index): ${currentPlayerTurnIndex}`);
        });
    }

    // --- Initial Setup ---
    if (playerSetupSection) {
        switchSection('player-setup-section');
    } else {
        document.body.innerHTML = "<h1 style='color:red; text-align:center;'>দুঃখিত, গেমটি লোড করা যায়নি। একটি গুরুতর ত্রুটি ঘটেছে।</h1>";
    }
});