// Vibify: музыкальный хаб для друзей на Supabase

const SUPABASE_URL = 'https://jwccjxkpgrlybulqhstm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QnjYc7l5Inlq1jD_7MzdGw_3Oiky9Xa';

// ИСПРАВЛЕНО: Правильный вызов инициализации клиента из глобального объекта библиотеки
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- icons (astraicons, linear) ----------
// SVG-пути из https://github.com/uiastra/astraicons. Цвет через currentColor.
function svgIcon(paths, size = 24){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}
const ICON = {
  home: svgIcon('<path d="M9 18C10.8167 16.7889 13.1833 16.7889 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 11.9961C3 10.2515 3.72503 8.59694 4.97899 7.48003L8.47898 4.36255C10.5186 2.54582 13.4814 2.54582 15.521 4.36255L19.021 7.48002C20.275 8.59693 21 10.2515 21 11.9961V15.1213C21 18.368 18.5376 21 15.5 21H8.5C5.46243 21 3 18.368 3 15.1213V11.9961Z" stroke="currentColor" stroke-width="1.5"/>'),
  users: svgIcon('<circle cx="12.0008" cy="6.5999" r="2.7" stroke="currentColor" stroke-width="1.5"/><circle cx="5.70039" cy="7.49995" r="1.8" stroke="currentColor" stroke-width="1.5"/><circle cx="1.8" cy="1.8" r="1.8" transform="matrix(-1 0 0 1 20.0996 5.69995)" stroke="currentColor" stroke-width="1.5"/><path d="M6.9375 14.5312C6.9375 13.1333 8.07078 12 9.46875 12H14.5312C15.9292 12 17.0625 13.1333 17.0625 14.5312V16.05C17.0625 18.2868 15.2493 20.1 13.0125 20.1H10.9875C8.75075 20.1 6.9375 18.2868 6.9375 16.05V14.5312Z" stroke="currentColor" stroke-width="1.5"/><path d="M5.53125 12C4.13328 12 3 13.1333 3 14.5312V17.4C3 18.8912 4.20883 20.1 5.7 20.1H6.15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18.4687 12C19.8667 12 21 13.1333 21 14.5312V17.4C21 18.8912 19.7912 20.1 18.3 20.1H17.85" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  star: svgIcon('<path d="M10.6798 4.00049C11.0954 2.6665 12.9046 2.6665 13.3201 4.00049L14.4932 7.76627C14.679 8.36285 15.212 8.76676 15.8133 8.76676H19.6092C20.9539 8.76676 21.513 10.5616 20.4252 11.3861L17.3542 13.7135C16.8677 14.0822 16.6641 14.7357 16.8499 15.3323L18.0229 19.0981C18.4385 20.4321 16.9747 21.5414 15.8869 20.7169L12.8159 18.3895C12.3294 18.0208 11.6706 18.0208 11.1841 18.3895L8.11312 20.7169C7.02526 21.5414 5.56155 20.4321 5.97707 19.0981L7.15008 15.3323C7.33591 14.7357 7.13234 14.0822 6.64583 13.7135L3.57485 11.3861C2.48699 10.5616 3.04607 8.76676 4.39075 8.76676H8.18669C8.78804 8.76676 9.32101 8.36285 9.50684 7.76627L10.6798 4.00049Z" stroke="currentColor" stroke-width="1.5"/>'),
  trophy: svgIcon('<path d="M16.9568 9.28678L18.6635 8.38601C19.7203 7.87092 20.8083 9.04019 20.4991 10.3587L18.3039 15.8502C18.1521 16.23 17.7843 16.479 17.3753 16.479L6.67719 16.479C6.26821 16.479 5.90044 16.23 5.74863 15.8502L3.55343 10.3587C3.24426 9.04019 4.33226 7.87092 5.38906 8.38601L7.15225 9.29811C7.64756 9.55433 8.25674 9.35591 8.50614 8.85713L11.1583 3.55279C11.5268 2.81574 12.5786 2.81574 12.9472 3.55279L15.5956 8.84962C15.8464 9.3513 16.4607 9.54859 16.9568 9.28678Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9.05273 20.2638L15.0527 20.2639" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  play: svgIcon('<path d="M3 12V8.24069C3 3.57324 6.5185 1.6619 10.8239 3.99563L14.2974 5.87528L17.771 7.75494C22.0763 10.0887 22.0763 13.9113 17.771 16.2451L14.2974 18.1247L10.8239 20.0044C6.5185 22.3381 3 20.4268 3 15.7593V12Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>'),
  pause: svgIcon('<rect x="4" y="5" width="5" height="14" rx="2.5" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="5" width="5" height="14" rx="2.5" stroke="currentColor" stroke-width="1.5"/>'),
  sound: svgIcon('<path d="M6 10.3333L6 14.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15 11.7778L15 13.2223" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 6L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 10.3333L18 14.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 8.88892L12 16.1111" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  trash: svgIcon('<path d="M5 9V17.5C5 19.9853 7.01472 22 9.5 22H14.5C16.9853 22 19 19.9853 19 17.5V9" stroke="currentColor" stroke-width="1.5"/><path d="M20 8H13.12H9.94667H6.77333H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 6C7 4.34315 8.34315 3 10 3H14C15.6569 3 17 4.34315 17 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8.99998 17L9 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15 17L15 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 17L12 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  edit: svgIcon('<path d="M21 18V18.5C21 19.8807 19.8807 21 18.5 21H5.5C4.11929 21 3 19.8807 3 18.5V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.4048 12.1062L13.0741 3.99909C13.4236 3.49921 13.9636 3.15449 14.5753 3.04075C15.1869 2.92701 15.82 3.05359 16.3355 3.39262L18.9697 5.12543C20.0429 5.83143 20.3229 7.24759 19.595 8.28853L13.9257 16.3956C13.5761 16.8955 13.0361 17.2402 12.4245 17.354L9.06104 17.9794C8.42423 18.0978 7.809 17.6931 7.6869 17.0755L7.04201 13.8134C6.92475 13.2202 7.05525 12.6061 7.4048 12.1062Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="10.85" y1="13.5496" x2="11.15" y2="13.1496" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="11.1092" y1="7.63042" x2="16.6813" y2="11.0967" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  share: svgIcon('<path d="M14.1974 5.14514C15.9807 5.67481 17.5134 6.82957 18.5143 8.39768C19.5153 9.96579 19.9174 11.8422 19.647 13.6827C19.5964 14.0273 19.5228 14.3663 19.4275 14.6977M9.8382 5.13203C8.05171 5.65097 6.51215 6.79649 5.5018 8.35855C4.49145 9.92061 4.07803 11.7945 4.33734 13.6367C4.42046 14.2272 4.57092 14.8018 4.7832 15.3502M7.71539 19C8.97099 19.8343 10.4501 20.2877 11.9722 20.2923C13.6302 20.2973 15.2403 19.7695 16.5689 18.7952" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13.4142 3.58578C13.9862 4.15778 14.1573 5.01801 13.8477 5.76536C13.5382 6.51271 12.8089 7 12 7C11.1911 7 10.4618 6.51271 10.1523 5.76536C9.84274 5.01801 10.0138 4.15778 10.5858 3.58578C11.3669 2.80474 12.6331 2.80474 13.4142 3.58578" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.41417 15.5858C7.98615 16.1578 8.15726 17.018 7.84771 17.7654C7.53815 18.5127 6.8089 19 6 19C5.1911 19 4.46185 18.5127 4.15229 17.7654C3.84274 17.018 4.01385 16.1578 4.58583 15.5858C5.36686 14.8047 6.63314 14.8047 7.41417 15.5858" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4142 15.5858C19.9862 16.1578 20.1573 17.018 19.8477 17.7654C19.5382 18.5127 18.8089 19 18 19C17.1911 19 16.4618 18.5127 16.1523 17.7654C15.8427 17.018 16.0138 16.1578 16.5858 15.5858C17.3669 14.8047 18.6331 14.8047 19.4142 15.5858" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  back: svgIcon('<path d="M11 18L5.70711 12.7071C5.31658 12.3166 5.31658 11.6834 5.70711 11.2929L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  search: svgIcon('<path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5703 17.4329L20.4299 20.567" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
  close: svgIcon('<path d="M7.00195 7.00195L16.9991 16.9991" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.00286 16.9991L17 7.00195" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  plus: svgIcon('<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  crown: svgIcon('<path d="M16.9568 9.28678L18.6635 8.38601C19.7203 7.87092 20.8083 9.04019 20.4991 10.3587L18.3039 15.8502C18.1521 16.23 17.7843 16.479 17.3753 16.479L6.67719 16.479C6.26821 16.479 5.90044 16.23 5.74863 15.8502L3.55343 10.3587C3.24426 9.04019 4.33226 7.87092 5.38906 8.38601L7.15225 9.29811C7.64756 9.55433 8.25674 9.35591 8.50614 8.85713L11.1583 3.55279C11.5268 2.81574 12.5786 2.81574 12.9472 3.55279L15.5956 8.84962C15.8464 9.3513 16.4607 9.54859 16.9568 9.28678Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9.05273 20.2638L15.0527 20.2639" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  record: svgIcon('<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>'),
};

// ---------- login (логин + пароль) ----------
async function hashPassword(password){
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getLogin(){
  return localStorage.getItem('vibify_login') || '';
}

function setLogin(name){
  localStorage.setItem('vibify_login', name);
}

function clearLogin(){
  localStorage.removeItem('vibify_login');
}

function normLogin(name){
  return (name || '').trim().toLowerCase();
}

function isOwner(album){
  if (isAdminActive()) return true;
  const login = normLogin(getLogin());
  if (!login || !album) return false;
  return normLogin(album.owner_id) === login;
}

// ---------- admin mode (только для tetrix) ----------
const ADMIN_USERNAME = 'tetrix';

function isAdminUser(){
  return normLogin(getLogin()) === ADMIN_USERNAME;
}

function isAdminActive(){
  return isAdminUser() && localStorage.getItem('vibify_admin_mode') === '1';
}

function toggleAdminMode(){
  if (!isAdminUser()) return;
  const active = isAdminActive();
  if (active){
    localStorage.removeItem('vibify_admin_mode');
  } else {
    localStorage.setItem('vibify_admin_mode', '1');
  }
  updateAdminBtn();
  renderGrid();
  if (state.currentAlbumId) openAlbum(state.currentAlbumId);
}

function updateAdminBtn(){
  if (!isAdminUser()){
    el.adminToggleBtn.hidden = true;
    return;
  }
  el.adminToggleBtn.hidden = false;
  el.adminToggleBtn.classList.toggle('is-active', isAdminActive());
}

async function loginOrRegister(username, password){
  const uname = normLogin(username);
  const hash = await hashPassword(password);

  const { data: existing, error: fetchError } = await db
    .from('users')
    .select('username, password_hash')
    .eq('username', uname)
    .maybeSingle();

  if (fetchError){
    console.error(fetchError);
    return { ok: false, message: 'Не удалось подключиться. Проверьте настройки Supabase.' };
  }

  if (existing){
    if (existing.password_hash !== hash){
      return { ok: false, message: 'Неверный пароль.' };
    }
    return { ok: true };
  }

  const { error: insertError } = await db
    .from('users')
    .insert({ username: uname, password_hash: hash });

  if (insertError){
    console.error(insertError);
    return { ok: false, message: 'Не получилось создать аккаунт.' };
  }

  return { ok: true };
}

const state = {
  albums: [],          // [{ id, title, author, description, created_at, trackCount }]
  currentAlbumId: null,
  tracks: [],          // tracks текущего альбома
  reviews: [],          // оценки/отзывы текущего альбома
  selectedRating: 0,
  searchResults: [],
  searchTimer: null,
  hitSearchResults: [],
  hitSearchTimer: null,
  tracksChannel: null,
  reviewsChannel: null,
  albumsChannel: null, // Канал для отслеживания изменений описания/названия альбома
};

// ---------- DOM refs ----------
const el = {
  viewGrid: document.getElementById('view-grid'),
  viewAlbum: document.getElementById('view-album'),
  albumGrid: document.getElementById('albumGrid'),
  albumCount: document.getElementById('albumCount'),
  emptyAlbums: document.getElementById('emptyAlbums'),
  emptyAlbumsTitle: document.getElementById('emptyAlbumsTitle'),
  emptyAlbumsText: document.getElementById('emptyAlbumsText'),

  hitMonth: document.getElementById('hitMonth'),
  hitMonthBody: document.getElementById('hitMonthBody'),
  hitMonthEditBtn: document.getElementById('hitMonthEditBtn'),
  hitMonthAdmin: document.getElementById('hitMonthAdmin'),
  hitMonthSearchInput: document.getElementById('hitMonthSearchInput'),
  hitMonthSpinner: document.getElementById('hitMonthSpinner'),
  hitMonthResults: document.getElementById('hitMonthResults'),

  openCreateModal: document.getElementById('openCreateModal'),
  emptyCreateBtn: document.getElementById('emptyCreateBtn'),
  modalOverlay: document.getElementById('modalOverlay'),
  albumNameInput: document.getElementById('albumNameInput'),
  albumAuthorInput: document.getElementById('albumAuthorInput'),
  albumDescriptionInputModal: document.getElementById('albumDescriptionInputModal'),
  cancelCreate: document.getElementById('cancelCreate'),
  confirmCreate: document.getElementById('confirmCreate'),

  smartPhotoBtn: document.getElementById('smartPhotoBtn'),
  smartPhotoInput: document.getElementById('smartPhotoInput'),
  smartPhotoStatus: document.getElementById('smartPhotoStatus'),
  smartPhotoResults: document.getElementById('smartPhotoResults'),

  loginBtn: document.getElementById('loginBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  topbarLoggedOut: document.getElementById('topbarLoggedOut'),
  topbarLoggedIn: document.getElementById('topbarLoggedIn'),
  loggedInAs: document.getElementById('loggedInAs'),
  loginModalOverlay: document.getElementById('loginModalOverlay'),
  loginNameInput: document.getElementById('loginNameInput'),
  loginPasswordInput: document.getElementById('loginPasswordInput'),
  loginError: document.getElementById('loginError'),
  cancelLogin: document.getElementById('cancelLogin'),
  confirmLoginBtn: document.getElementById('confirmLogin'),

  backBtn: document.getElementById('backBtn'),
  albumTitle: document.getElementById('albumTitle'),
  albumTitleInput: document.getElementById('albumTitleInput'),
  renameBtn: document.getElementById('renameBtn'),
  albumAuthor: document.getElementById('albumAuthor'),
  albumAuthorEditInput: document.getElementById('albumAuthorEditInput'),
  renameAuthorBtn: document.getElementById('renameAuthorBtn'),
  
  // Добавленные ссылки для описания
  albumDescription: document.getElementById('albumDescription'),
  albumDescriptionInput: document.getElementById('albumDescriptionInput'),
  renameDescBtn: document.getElementById('renameDescBtn'),

  albumMeta: document.getElementById('albumMeta'),
  albumDiscBig: document.getElementById('albumDiscBig'),
  adminToggleBtn: document.getElementById('adminToggleBtn'),
  shareBtn: document.getElementById('shareBtn'),
  shareBtnText: document.getElementById('shareBtnText'),

  reviewsSummary: document.getElementById('reviewsSummary'),
  reviewsAverageStars: document.getElementById('reviewsAverageStars'),
  reviewsCount: document.getElementById('reviewsCount'),
  reviewAuthorInput: document.getElementById('reviewAuthorInput'),
  starPicker: document.getElementById('starPicker'),
  reviewTextInput: document.getElementById('reviewTextInput'),
  submitReviewBtn: document.getElementById('submitReviewBtn'),
  reviewList: document.getElementById('reviewList'),
  emptyReviews: document.getElementById('emptyReviews'),

  searchInput: document.getElementById('searchInput'),
  searchSpinner: document.getElementById('searchSpinner'),
  searchResults: document.getElementById('searchResults'),
  searchWrap: document.getElementById('searchWrap'),
  trackList: document.getElementById('trackList'),
  emptyTracks: document.getElementById('emptyTracks'),
  reviewForm: document.getElementById('reviewForm'),
  ownerReviewNotice: document.getElementById('ownerReviewNotice'),

  sidebarTabs: document.querySelectorAll('.sidebar__tab'),
  viewUsers: document.getElementById('view-users'),
  viewReviews: document.getElementById('view-reviews'),
  viewSmak: document.getElementById('view-smak'),
  usersList: document.getElementById('usersList'),
  usersCount: document.getElementById('usersCount'),
  emptyUsers: document.getElementById('emptyUsers'),
  allReviewsList: document.getElementById('allReviewsList'),
  allReviewsCount: document.getElementById('allReviewsCount'),
  emptyAllReviews: document.getElementById('emptyAllReviews'),
  smakGrid: document.getElementById('smakGrid'),
  smakCount: document.getElementById('smakCount'),
  emptySmak: document.getElementById('emptySmak'),

  adminSmakPanel: document.getElementById('adminSmakPanel'),
  adminSmakScoreInput: document.getElementById('adminSmakScoreInput'),
  adminSmakScoreValue: document.getElementById('adminSmakScoreValue'),
  adminSmakCommentInput: document.getElementById('adminSmakCommentInput'),
  saveSmakBtn: document.getElementById('saveSmakBtn'),
};

// ---------- helpers ----------
function escapeHtml(str){
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pluralTracks(n){
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'трек';
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'трека';
  return 'треков';
}

function pluralAlbums(n){
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'альбом';
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'альбома';
  return 'альбомов';
}

function pluralReviews(n){
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'оценка';
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'оценки';
  return 'оценок';
}

function starString(rating){
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

function flashError(elx){
  elx.style.borderColor = 'rgba(255,110,110,0.5)';
  setTimeout(() => { elx.style.borderColor = ''; }, 900);
}

function getAlbum(id){
  return state.albums.find(a => String(a.id) === String(id));
}

// ---------- per-album disc ----------
function albumDiscIcon(){
  return ICON.record;
}

// Коллаж из обложек треков альбома. До 4 картинок в сетке 2×2.
// Нет треков или обложек — иконка винила.
function albumCover(album, size){
  const sizeStyle = size ? `--collage-size:${size}px;` : '';
  const discSizeStyle = size ? `--disc-size:${size}px;` : '';
  const covers = (album && album.covers || []).filter(Boolean).slice(0, 4);
  if (covers.length === 0){
    return `<div class="disc" style="${discSizeStyle}">${albumDiscIcon()}</div>`;
  }
  if (covers.length === 1){
    return `<div class="collage collage--single" style="${sizeStyle}"><img class="collage__img" src="${covers[0]}" alt="" loading="lazy"></div>`;
  }
  return `<div class="collage" style="${sizeStyle}">${covers.map(c => `<img class="collage__img" src="${c}" alt="" loading="lazy">`).join('')}</div>`;
}

// Большая аватарка на странице альбома. Берёт обложки из загруженных треков,
// иначе из albums.covers (с главной).
function renderAlbumCoverBig(album){
  const covers = (state.tracks.map(t => t.cover_url).filter(Boolean)).slice(0, 4);
  const albumCovers = covers.length ? covers : (album && album.covers || []);
  el.albumDiscBig.innerHTML = albumCover({ covers: albumCovers }, 90);
}

function youtubeMusicUrl(artist, title){
  const q = encodeURIComponent(`${artist} ${title}`);
  return `https://music.youtube.com/search?q=${q}`;
}

function showLoadError(message){
  el.emptyAlbumsTitle.textContent = 'Не удалось загрузить альбомы';
  el.emptyAlbumsText.textContent = message;
  el.emptyAlbums.classList.add('is-visible');
  el.albumGrid.style.display = 'none';
}

// ---------- data: albums ----------
async function loadAlbums(){
  const { data: albums, error } = await db
    .from('albums')
    .select('id, title, author, description, owner_id, created_at')
    .order('created_at', { ascending: false });

  if (error){
    console.error(error);
    showLoadError('Проверьте подключение к интернету и настройки Supabase.');
    return;
  }

  const { data: tracksMeta, error: tracksError } = await db
    .from('tracks')
    .select('album_id, cover_url');

  if (tracksError) console.error(tracksError);

  const countMap = {};
  const coversMap = {};
  (tracksMeta || []).forEach(t => {
    countMap[t.album_id] = (countMap[t.album_id] || 0) + 1;
    if (t.cover_url){
      (coversMap[t.album_id] = coversMap[t.album_id] || []).push(t.cover_url);
    }
  });

  state.albums = (albums || []).map(a => ({
    ...a,
    trackCount: countMap[a.id] || 0,
    covers: coversMap[a.id] || [],
  }));

  renderGrid();
  
  // Если сейчас открыт конкретный альбом, обновим его метаданные локально
  if (state.currentAlbumId) {
    const updated = getAlbum(state.currentAlbumId);
    if (updated) {
      el.albumTitle.textContent = updated.title;
      el.albumAuthor.textContent = `автор: ${updated.author || '—'}`;
      el.albumDescription.textContent = updated.description || 'Описание отсутствует';
    }
  }
}

async function createAlbum(title, author, description){
  const { data, error } = await db
    .from('albums')
    .insert({ title, author, description: description || null, owner_id: getLogin() })
    .select()
    .single();

  if (error){
    console.error(error);
    alert('Не получилось создать альбом. Попробуйте ещё раз.');
    return null;
  }
  return data;
}

async function updateAlbumTitle(id, title){
  const { data, error } = await db
    .from('albums')
    .update({ title })
    .eq('id', id)
    .select()
    .single();

  if (error){
    console.error(error);
    alert('Не получилось переименовать альбом.');
    return null;
  }
  return data;
}

async function updateAlbumAuthor(id, author){
  const { data, error } = await db
    .from('albums')
    .update({ author })
    .eq('id', id)
    .select()
    .single();

  if (error){
    console.error(error);
    alert('Не получилось изменить автора альбома.');
    return null;
  }
  return data;
}

async function updateAlbumDescription(id, description){
  const { data, error } = await db
    .from('albums')
    .update({ description: description || null })
    .eq('id', id)
    .select()
    .single();

  if (error){
    console.error(error);
    alert('Не получилось обновить описание.');
    return null;
  }
  return data;
}

async function deleteAlbum(id){
  const { error } = await db.from('albums').delete().eq('id', id);
  if (error){
    console.error(error);
    alert('Не получилось удалить альбом.');
    return;
  }
  state.albums = state.albums.filter(a => a.id !== id);
  renderGrid();
}

// ---------- rendering: grid ----------
function renderGrid(){
  const count = state.albums.length;
  el.albumCount.textContent = `${count} ${pluralAlbums(count)}`;

  el.emptyAlbumsTitle.textContent = 'Здесь пока пусто';
  el.emptyAlbumsText.textContent = 'Соберите первый альбом: добавляйте треки и делитесь звучанием с друзьями.';
  el.emptyAlbums.classList.toggle('is-visible', count === 0);
  el.albumGrid.style.display = count === 0 ? 'none' : 'grid';

  el.albumGrid.innerHTML = state.albums.map(album => `
    <div class="album-card" data-id="${album.id}">
      ${isOwner(album) ? `<button class="album-card__delete" data-delete="${album.id}" title="Удалить альбом" aria-label="Удалить альбом">&times;</button>` : ''}
      ${albumCover(album)}
      <div class="album-card__name">${escapeHtml(album.title)}</div>
      ${album.description ? `<div style="font-size:12px; color:var(--text-dim); max-height:3em; overflow:hidden; text-overflow:ellipsis; margin-top:-8px; padding:0 4px;">${escapeHtml(album.description)}</div>` : ''}
      <div class="album-card__meta mono" style="margin-top:auto;">${album.trackCount} ${pluralTracks(album.trackCount)}</div>
    </div>
  `).join('');

  el.albumGrid.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete]')) return;
      openAlbum(card.dataset.id);
    });
  });

  el.albumGrid.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Удалить альбом вместе со всеми треками?')) deleteAlbum(btn.dataset.delete);
    });
  });
}

// ---------- data + rendering: album detail ----------
async function loadTracks(albumId){
  const { data, error } = await db
    .from('tracks')
    .select('id, album_id, track_title, artist, cover_url, preview_url, created_at')
    .eq('album_id', albumId)
    .order('created_at', { ascending: true });

  if (error){
    console.error(error);
    el.trackList.innerHTML = '';
    el.emptyTracks.querySelector('p').textContent = 'Не удалось загрузить треки. Проверьте подключение.';
    el.emptyTracks.classList.add('is-visible');
    return;
  }

  state.tracks = data || [];
  renderAlbumDetail();
}

function subscribeToTracks(albumId){
  if (state.tracksChannel) db.removeChannel(state.tracksChannel);

  state.tracksChannel = db
    .channel(`tracks-${albumId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tracks',
      filter: `album_id=eq.${albumId}`,
    }, () => {
      loadTracks(albumId);
    })
    .subscribe();
}

function unsubscribeFromTracks(){
  if (state.tracksChannel){
    db.removeChannel(state.tracksChannel);
    state.tracksChannel = null;
  }
}

// Подписка на глобальные изменения таблиц альбомов (Realtime для всех)
function subscribeToAlbums(){
  if (state.albumsChannel) db.removeChannel(state.albumsChannel);

  state.albumsChannel = db
    .channel('public-albums')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'albums'
    }, () => {
      loadAlbums();
    })
    .subscribe();
}

// ---------- data + rendering: reviews ----------
async function loadReviews(albumId){
  const { data, error } = await db
    .from('reviews')
    .select('id, album_id, author_name, rating, review_text, created_at')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });

  if (error){
    console.error(error);
    state.reviews = [];
    renderReviews();
    return;
  }

  state.reviews = data || [];
  renderReviews();
}

function subscribeToReviews(albumId){
  if (state.reviewsChannel) db.removeChannel(state.reviewsChannel);

  state.reviewsChannel = db
    .channel(`reviews-${albumId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'reviews',
      filter: `album_id=eq.${albumId}`,
    }, () => {
      loadReviews(albumId);
    })
    .subscribe();
}

function unsubscribeFromReviews(){
  if (state.reviewsChannel){
    db.removeChannel(state.reviewsChannel);
    state.reviewsChannel = null;
  }
}

function renderReviews(){
  const reviews = state.reviews;

  el.emptyReviews.classList.toggle('is-visible', reviews.length === 0);
  el.reviewList.style.display = reviews.length === 0 ? 'none' : 'flex';

  if (reviews.length === 0){
    el.reviewsSummary.hidden = true;
  } else {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    el.reviewsAverageStars.textContent = starString(avg);
    el.reviewsCount.textContent = `${avg.toFixed(1)} · ${reviews.length} ${pluralReviews(reviews.length)}`;
    el.reviewsSummary.hidden = false;
  }

  el.reviewList.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-card__head">
        <span class="review-card__author">${escapeHtml(r.author_name)}</span>
        <span class="review-card__stars">${starString(r.rating)}</span>
      </div>
      ${r.review_text ? `<p class="review-card__text">${escapeHtml(r.review_text)}</p>` : ''}
    </div>
  `).join('');
}

function updateStarPicker(){
  el.starPicker.querySelectorAll('.star-picker__btn').forEach(btn => {
    btn.classList.toggle('is-active', Number(btn.dataset.star) <= state.selectedRating);
  });
}

async function submitReview(){
  const albumId = state.currentAlbumId;
  const author = el.reviewAuthorInput.value.trim();
  const rating = state.selectedRating;
  const text = el.reviewTextInput.value.trim();

  if (!author){
    el.reviewAuthorInput.focus();
    flashError(el.reviewAuthorInput);
    return;
  }
  if (!rating){
    el.starPicker.querySelectorAll('.star-picker__btn').forEach(btn => {
      btn.style.color = 'rgba(255,110,110,0.6)';
      setTimeout(() => { btn.style.color = ''; }, 700);
    });
    return;
  }

  // Один человек, один отзыв на альбом. Ключ: логин пользователя.
  // Имя для отображения храним отдельно в author_name.
  const login = normLogin(getLogin()) || normLogin(author);
  if (!login){
    alert('Войдите в аккаунт, чтобы оставить отзыв.');
    return;
  }

  const { data: existing } = await db
    .from('reviews')
    .select('id')
    .eq('album_id', albumId)
    .eq('author', login)
    .maybeSingle();

  if (existing && !confirm('У вас уже есть оценка этому альбому. Заменить её новой?')){
    return;
  }

  el.submitReviewBtn.disabled = true;
  const { error } = await db.from('reviews').upsert({
    album_id: albumId,
    author: login,
    author_name: author,
    rating,
    review_text: text || null,
  }, { onConflict: 'album_id,author' });
  el.submitReviewBtn.disabled = false;

  if (error){
    console.error(error);
    alert('Не получилось отправить оценку.');
    return;
  }

  el.reviewTextInput.value = '';
  state.selectedRating = 0;
  updateStarPicker();
}

async function openAlbum(id){
  state.currentAlbumId = id;
  el.viewGrid.hidden = true;
  el.viewAlbum.hidden = false;
  el.searchInput.value = '';
  clearSearchResults();
  cancelRenameAlbum();
  cancelRenameAuthor();
  cancelRenameDesc();

  const album = getAlbum(id);
  const owner = isOwner(album);

  el.albumTitle.textContent = album ? album.title : '';
  el.albumAuthor.textContent = `автор: ${album && album.author ? album.author : '—'}`;
  el.albumDescription.textContent = album && album.description ? album.description : 'Описание отсутствует';
  renderAlbumCoverBig(album);

  // Права редактирования: только у создателя альбома
  el.renameBtn.style.display = owner ? '' : 'none';
  el.renameAuthorBtn.style.display = owner ? '' : 'none';
  el.renameDescBtn.style.display = owner ? '' : 'none';
  el.searchWrap.style.display = owner ? '' : 'none';

  // Отзывы доступны всем, кроме создателя альбома
  el.reviewForm.hidden = owner;
  el.ownerReviewNotice.hidden = !owner;

  updateAdminBtn();
  el.adminSmakPanel.hidden = !isAdminActive();
  if (isAdminActive()){
    el.adminSmakScoreInput.value = 50;
    el.adminSmakScoreValue.textContent = '50';
    refreshSmakColor();
  }

  state.selectedRating = 0;
  el.reviewTextInput.value = '';
  updateStarPicker();

  await loadTracks(id);
  subscribeToTracks(id);
  await loadReviews(id);
  subscribeToReviews(id);
  if (owner) el.searchInput.focus();
}

function closeAlbum(){
  state.currentAlbumId = null;
  unsubscribeFromTracks();
  unsubscribeFromReviews();
  el.viewAlbum.hidden = true;
  el.viewGrid.hidden = false;
  loadAlbums();
}

function renderAlbumDetail(){
  const album = getAlbum(state.currentAlbumId);
  const tracks = state.tracks;

  el.albumMeta.textContent = `${tracks.length} ${pluralTracks(tracks.length)}`;
  if (album) {
    el.albumTitle.textContent = album.title;
    el.albumDescription.textContent = album.description || 'Описание отсутствует';
  }
  renderAlbumCoverBig(album);

  el.emptyTracks.classList.toggle('is-visible', tracks.length === 0);
  el.trackList.style.display = tracks.length === 0 ? 'none' : 'flex';
  if (album) el.albumAuthor.textContent = `автор: ${album.author || '—'}`;

  el.trackList.innerHTML = tracks.map((track, i) => `
    <div class="track-row" data-track-id="${track.id}">
      <span class="track-row__index mono">${String(i + 1).padStart(2, '0')}</span>
      <img class="track-row__art" src="${track.cover_url || ''}" alt="" loading="lazy">
      <div class="track-row__info">
        <span class="track-row__title">${escapeHtml(track.track_title)}</span>
        <span class="track-row__artist">${escapeHtml(track.artist)}</span>
      </div>
      <div class="track-row__actions">
        <button class="preview-btn" data-preview="${track.id}" data-url="${track.preview_url || ''}" data-title="${escapeHtml(track.track_title)}" data-artist="${escapeHtml(track.artist || '')}" title="Послушать 30 секунд" aria-label="Послушать превью">
          <span class="preview-btn__play">${ICON.play}</span>
          <span class="preview-btn__pause" hidden>${ICON.pause}</span>
        </button>
        ${isOwner(album) ? `
        <button class="remove-btn" data-remove="${track.id}" title="Удалить трек" aria-label="Удалить трек">
          ${ICON.trash}
        </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  el.trackList.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeTrack(btn.dataset.remove));
  });

  el.trackList.querySelectorAll('[data-preview]').forEach(btn => {
    btn.addEventListener('click', () => togglePreview(btn));
  });

  renderSearchResults();
}

let previewAudio = null;
let previewBtnEl = null;

async function togglePreview(btn){
  if (previewBtnEl === btn && previewAudio && !previewAudio.paused){
    previewAudio.pause();
    setPreviewPlaying(btn, false);
    return;
  }

  if (previewAudio){
    previewAudio.pause();
    if (previewBtnEl) setPreviewPlaying(previewBtnEl, false);
  }

  let url = btn.dataset.url;
  if (!url){
    const term = `${btn.dataset.artist} ${btn.dataset.title}`.trim();
    try {
      const results = await searchItunes(term);
      url = (results || [])[0]?.previewUrl;
    } catch (err){
      console.error(err);
    }
    if (url) btn.dataset.url = url;
  }

  if (!url){
    alert('Превью для этой песни не найдено.');
    return;
  }

  previewAudio = new Audio(url);
  previewBtnEl = btn;
  setPreviewPlaying(btn, true);

  previewAudio.play().catch(err => {
    console.error(err);
    setPreviewPlaying(btn, false);
    alert('Не удалось включить превью.');
  });

  previewAudio.addEventListener('ended', () => {
    setPreviewPlaying(btn, false);
    previewAudio = null;
    previewBtnEl = null;
  });
}

function setPreviewPlaying(btn, playing){
  const play = btn.querySelector('.preview-btn__play');
  const pause = btn.querySelector('.preview-btn__pause');
  if (play) play.hidden = playing;
  if (pause) pause.hidden = !playing;
  btn.classList.toggle('is-playing', playing);
}

async function removeTrack(trackId){
  const { error } = await db.from('tracks').delete().eq('id', trackId);
  if (error){
    console.error(error);
    alert('Не получилось удалить трек.');
    return;
  }
  state.tracks = state.tracks.filter(t => t.id !== trackId);
  renderAlbumDetail();
}

// ---------- rename album ----------
function startRenameAlbum(){
  const album = getAlbum(state.currentAlbumId);
  if (!album) return;

  el.albumTitleInput.value = album.title;
  el.albumTitle.hidden = true;
  el.albumTitleInput.hidden = false;
  el.albumTitleInput.focus();
  el.albumTitleInput.select();
}

function cancelRenameAlbum(){
  el.albumTitleInput.hidden = true;
  el.albumTitle.hidden = false;
}

async function confirmRenameAlbum(){
  const albumId = state.currentAlbumId;
  const newTitle = el.albumTitleInput.value.trim();
  const album = getAlbum(albumId);

  if (!newTitle || !album || newTitle === album.title){
    cancelRenameAlbum();
    return;
  }

  el.albumTitleInput.disabled = true;
  const updated = await updateAlbumTitle(albumId, newTitle);
  el.albumTitleInput.disabled = false;

  if (!updated){
    cancelRenameAlbum();
    return;
  }

  album.title = updated.title;
  el.albumTitle.textContent = updated.title;
  cancelRenameAlbum();
}

// ---------- rename author ----------
function startRenameAuthor(){
  const album = getAlbum(state.currentAlbumId);
  if (!album) return;

  el.albumAuthorEditInput.value = album.author || '';
  el.albumAuthor.hidden = true;
  el.albumAuthorEditInput.hidden = false;
  el.albumAuthorEditInput.focus();
  el.albumAuthorEditInput.select();
}

function cancelRenameAuthor(){
  el.albumAuthorEditInput.hidden = true;
  el.albumAuthor.hidden = false;
}

async function confirmRenameAuthor(){
  const albumId = state.currentAlbumId;
  const newAuthor = el.albumAuthorEditInput.value.trim();
  const album = getAlbum(albumId);

  if (!newAuthor || !album || newAuthor === album.author){
    cancelRenameAuthor();
    return;
  }

  el.albumAuthorEditInput.disabled = true;
  const updated = await updateAlbumAuthor(albumId, newAuthor);
  el.albumAuthorEditInput.disabled = false;

  if (!updated){
    cancelRenameAuthor();
    return;
  }

  album.author = updated.author;
  el.albumAuthor.textContent = `автор: ${updated.author}`;
  cancelRenameAuthor();
}

// ---------- rename description ----------
function startRenameDesc(){
  const album = getAlbum(state.currentAlbumId);
  if (!album) return;

  el.albumDescriptionInput.value = album.description || '';
  el.albumDescription.hidden = true;
  el.albumDescriptionInput.hidden = false;
  el.albumDescriptionInput.focus();
  el.albumDescriptionInput.select();
}

function cancelRenameDesc(){
  el.albumDescriptionInput.hidden = true;
  el.albumDescription.hidden = false;
}

async function confirmRenameDesc(){
  const albumId = state.currentAlbumId;
  const newDesc = el.albumDescriptionInput.value.trim();
  const album = getAlbum(albumId);

  if (!album || newDesc === (album.description || '')){
    cancelRenameDesc();
    return;
  }

  el.albumDescriptionInput.disabled = true;
  const updated = await updateAlbumDescription(albumId, newDesc);
  el.albumDescriptionInput.disabled = false;

  if (!updated){
    cancelRenameDesc();
    return;
  }

  album.description = updated.description;
  el.albumDescription.textContent = updated.description || 'Описание отсутствует';
  cancelRenameDesc();
}

// ---------- share ----------
function shareAlbum(){
  const albumId = state.currentAlbumId;
  if (!albumId) return;

  const url = `${window.location.origin}${window.location.pathname}?album=${albumId}`;

  navigator.clipboard.writeText(url).then(() => {
    const originalText = 'Поделиться';
    el.shareBtn.disabled = true;
    el.shareBtnText.textContent = 'Ссылка скопирована!';
    setTimeout(() => {
      el.shareBtnText.textContent = originalText;
      el.shareBtn.disabled = false;
    }, 2000);
  }).catch(err => {
    console.error(err);
    alert('Не получилось скопировать ссылку.');
  });
}

// ---------- login modal ----------
function updateLoginBtn(){
  const login = getLogin();
  if (login){
    el.topbarLoggedOut.style.display = 'none';
    el.topbarLoggedIn.style.display = 'flex';
    el.loggedInAs.textContent = `вы: ${login}`;
  } else {
    el.topbarLoggedOut.style.display = 'flex';
    el.topbarLoggedIn.style.display = 'none';
  }
}

function openLoginModal(){
  el.loginModalOverlay.hidden = false;
  el.loginNameInput.value = '';
  el.loginPasswordInput.value = '';
  el.loginError.style.display = 'none';
  setTimeout(() => el.loginNameInput.focus(), 50);
}

function closeLoginModal(){
  el.loginModalOverlay.hidden = true;
}

async function confirmLoginAction(){
  const name = el.loginNameInput.value.trim();
  const password = el.loginPasswordInput.value;

  if (!name){
    el.loginNameInput.focus();
    flashError(el.loginNameInput);
    return;
  }
  if (!password){
    el.loginPasswordInput.focus();
    flashError(el.loginPasswordInput);
    return;
  }

  el.confirmLoginBtn.disabled = true;
  el.loginError.style.display = 'none';
  const result = await loginOrRegister(name, password);
  el.confirmLoginBtn.disabled = false;

  if (!result.ok){
    el.loginError.textContent = result.message;
    el.loginError.style.display = 'block';
    return;
  }

  setLogin(normLogin(name));
  updateLoginBtn();
  closeLoginModal();
  renderGrid();
  if (state.currentAlbumId) openAlbum(state.currentAlbumId);
}

function logoutAction(){
  clearLogin();
  updateLoginBtn();
  renderGrid();
  if (state.currentAlbumId) openAlbum(state.currentAlbumId);
}

// ---------- create album modal ----------
function openModal(){
  if (!getLogin()){
    openLoginModal();
    return;
  }
  el.modalOverlay.hidden = false;
  el.albumNameInput.value = '';
  el.albumAuthorInput.value = getLogin();
  el.albumDescriptionInputModal.value = '';
  setTimeout(() => el.albumNameInput.focus(), 50);
}

function closeModal(){
  el.modalOverlay.hidden = true;
}

async function confirmCreateAlbum(){
  const title = el.albumNameInput.value.trim();
  const author = el.albumAuthorInput.value.trim();
  const description = el.albumDescriptionInputModal.value.trim();

  if (!title) {
    el.albumNameInput.focus();
    flashError(el.albumNameInput);
    return;
  }
  if (!author) {
    el.albumAuthorInput.focus();
    flashError(el.albumAuthorInput);
    return;
  }

  el.confirmCreate.disabled = true;
  const album = await createAlbum(title, author, description);
  el.confirmCreate.disabled = false;

  if (!album) return;

  closeModal();
  await loadAlbums();
}

// ---------- iTunes search ----------
async function searchItunes(term){
  const url = `https://itunes.apple.com/search?media=music&entity=song&limit=8&term=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('iTunes API error');
  const data = await res.json();
  return data.results || [];
}

function clearSearchResults(){
  el.searchResults.hidden = true;
  el.searchResults.innerHTML = '';
  state.searchResults = [];
}

function renderSearchResults(){
  if (state.searchResults.length === 0 && el.searchInput.value.trim().length < 2) return;

  const addedKeys = new Set(state.tracks.map(t => `${t.track_title}::${t.artist}`));

  if (state.searchResults.length === 0) {
    el.searchResults.innerHTML = `<div class="search-empty">Ничего не найдено. Попробуйте другой запрос.</div>`;
    el.searchResults.hidden = false;
    return;
  }

  el.searchResults.innerHTML = state.searchResults.map((r, idx) => {
    const trackTitle = r.trackName || 'Без названия';
    const artist = r.artistName || 'Неизвестный артист';
    const already = addedKeys.has(`${trackTitle}::${artist}`);
    return `
      <div class="result-row">
        <img class="result-row__art" src="${r.artworkUrl60 || ''}" alt="" loading="lazy">
        <div class="result-row__info">
          <span class="result-row__title">${escapeHtml(trackTitle)}</span>
          <span class="result-row__artist">${escapeHtml(artist)}</span>
        </div>
        <button class="add-btn" data-add="${idx}" ${already ? 'disabled' : ''}>
          ${already ? 'Добавлено' : '+ Добавить'}
        </button>
      </div>
    `;
  }).join('');

  el.searchResults.hidden = false;

  el.searchResults.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addTrackFromSearch(Number(btn.dataset.add)));
  });
}

async function addTrackFromSearch(idx){
  const result = state.searchResults[idx];
  const albumId = state.currentAlbumId;
  if (!result || !albumId) return;

  const btn = el.searchResults.querySelector(`[data-add="${idx}"]`);
  if (btn) { btn.disabled = true; btn.textContent = '…'; }

  const { error } = await db.from('tracks').insert({
    album_id: albumId,
    track_title: result.trackName || 'Без названия',
    artist: result.artistName || 'Неизвестный артист',
    cover_url: (result.artworkUrl100 || result.artworkUrl60 || '').replace('100x100', '200x200'),
    preview_url: result.previewUrl || null,
  });

  if (error){
    console.error(error);
    alert('Не получилось добавить трек.');
    if (btn) { btn.disabled = false; btn.textContent = '+ Добавить'; }
    return;
  }
}

function handleSearchInput(){
  const term = el.searchInput.value.trim();
  clearTimeout(state.searchTimer);

  if (term.length < 2) {
    clearSearchResults();
    el.searchSpinner.hidden = true;
    return;
  }

  el.searchSpinner.hidden = false;

  state.searchTimer = setTimeout(async () => {
    try {
      const results = await searchItunes(term);
      state.searchResults = results;
      renderSearchResults();
    } catch (err) {
      console.error(err);
      el.searchResults.innerHTML = `<div class="search-error">Не удалось выполнить поиск. Проверьте подключение к интернету.</div>`;
      el.searchResults.hidden = false;
    } finally {
      el.searchSpinner.hidden = true;
    }
  }, 380);
}

// ---------- events ----------
el.openCreateModal.addEventListener('click', openModal);
el.emptyCreateBtn.addEventListener('click', openModal);
el.cancelCreate.addEventListener('click', closeModal);
el.confirmCreate.addEventListener('click', confirmCreateAlbum);
el.modalOverlay.addEventListener('click', (e) => {
  if (e.target === el.modalOverlay) closeModal();
});
el.albumNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmCreateAlbum();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !el.modalOverlay.hidden) closeModal();
  if (e.key === 'Escape' && !el.loginModalOverlay.hidden) closeLoginModal();
});

el.loginBtn.addEventListener('click', openLoginModal);
el.logoutBtn.addEventListener('click', logoutAction);
el.cancelLogin.addEventListener('click', closeLoginModal);
el.confirmLoginBtn.addEventListener('click', confirmLoginAction);
el.loginModalOverlay.addEventListener('click', (e) => {
  if (e.target === el.loginModalOverlay) closeLoginModal();
});
el.loginNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') el.loginPasswordInput.focus();
});
el.loginPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmLoginAction();
});

el.backBtn.addEventListener('click', closeAlbum);
el.shareBtn.addEventListener('click', shareAlbum);
el.adminToggleBtn.addEventListener('click', toggleAdminMode);
el.hitMonthEditBtn.addEventListener('click', toggleHitAdmin);
el.hitMonthSearchInput.addEventListener('input', handleHitSearchInput);
el.renameBtn.addEventListener('click', startRenameAlbum);
el.albumTitleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmRenameAlbum();
  if (e.key === 'Escape') cancelRenameAlbum();
});
el.albumTitleInput.addEventListener('blur', confirmRenameAlbum);

el.renameAuthorBtn.addEventListener('click', startRenameAuthor);
el.albumAuthorEditInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmRenameAuthor();
  if (e.key === 'Escape') cancelRenameAuthor();
});
el.albumAuthorEditInput.addEventListener('blur', confirmRenameAuthor);

// События редактирования описания
el.renameDescBtn.addEventListener('click', startRenameDesc);
el.albumDescriptionInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmRenameDesc(); }
  if (e.key === 'Escape') cancelRenameDesc();
});
el.albumDescriptionInput.addEventListener('blur', confirmRenameDesc);

el.starPicker.querySelectorAll('.star-picker__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.selectedRating = Number(btn.dataset.star);
    updateStarPicker();
  });
});
el.submitReviewBtn.addEventListener('click', submitReview);
el.saveSmakBtn.addEventListener('click', saveSmak);
el.adminSmakScoreInput.addEventListener('input', () => {
  el.adminSmakScoreValue.textContent = el.adminSmakScoreInput.value;
  refreshSmakColor();
});
el.searchInput.addEventListener('input', handleSearchInput);

document.addEventListener('click', (e) => {
  if (!el.searchResults.hidden &&
      !el.searchResults.contains(e.target) &&
      e.target !== el.searchInput) {
    el.searchResults.hidden = true;
  }
  if (!el.hitMonthResults.hidden &&
      !el.hitMonthResults.contains(e.target) &&
      e.target !== el.hitMonthSearchInput) {
    el.hitMonthResults.hidden = true;
  }
});
el.searchInput.addEventListener('focus', () => {
  if (state.searchResults.length > 0) el.searchResults.hidden = false;
});

// ---------- sidebar tabs ----------
function hideAllViews(){
  el.viewGrid.hidden = true;
  el.viewAlbum.hidden = true;
  el.viewUsers.hidden = true;
  el.viewReviews.hidden = true;
  el.viewSmak.hidden = true;
}

function switchTab(tab){
  if (state.currentAlbumId){
    unsubscribeFromTracks();
    unsubscribeFromReviews();
    state.currentAlbumId = null;
  }

  hideAllViews();
  el.sidebarTabs.forEach(btn => btn.classList.toggle('is-active', btn.dataset.tab === tab));

  if (tab === 'home'){
    el.viewGrid.hidden = false;
    loadAlbums();
    loadHitMonth();
  } else if (tab === 'users'){
    el.viewUsers.hidden = false;
    loadUsers();
  } else if (tab === 'reviews'){
    el.viewReviews.hidden = false;
    loadAllReviews();
  } else if (tab === 'smak'){
    el.viewSmak.hidden = false;
    loadSmak();
  }
}

el.sidebarTabs.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ---------- users tab ----------
async function loadUsers(){
  const { data, error } = await db
    .from('users')
    .select('username, created_at')
    .order('created_at', { ascending: false });

  if (error){
    console.error(error);
    el.usersList.innerHTML = '';
    el.emptyUsers.classList.add('is-visible');
    return;
  }

  const users = data || [];
  el.usersCount.textContent = `${users.length} ${pluralUsers(users.length)}`;
  el.emptyUsers.classList.toggle('is-visible', users.length === 0);
  el.usersList.style.display = users.length === 0 ? 'none' : 'grid';

  el.usersList.innerHTML = users.map(u => `
    <div class="person-card">
      <div class="person-card__name">${escapeHtml(u.username)}${u.username === ADMIN_USERNAME ? ` <span class="person-card__crown">${ICON.crown}</span>` : ''}</div>
      <div class="person-card__meta mono">на сайте с ${formatDate(u.created_at)}</div>
    </div>
  `).join('');
}

function pluralUsers(n){
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'пользователь';
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'пользователя';
  return 'пользователей';
}

function formatDate(iso){
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ---------- all reviews tab ----------
async function loadAllReviews(){
  const { data, error } = await db
    .from('reviews')
    .select('id, album_id, author_name, rating, review_text, created_at, albums(title)')
    .order('created_at', { ascending: false });

  if (error){
    console.error(error);
    el.allReviewsList.innerHTML = '';
    el.emptyAllReviews.classList.add('is-visible');
    return;
  }

  const reviews = data || [];
  el.allReviewsCount.textContent = `${reviews.length} ${pluralReviews(reviews.length)}`;
  el.emptyAllReviews.classList.toggle('is-visible', reviews.length === 0);
  el.allReviewsList.style.display = reviews.length === 0 ? 'none' : 'flex';

  el.allReviewsList.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-card__head">
        <span class="review-card__author">${escapeHtml(r.author_name)} → ${escapeHtml(r.albums ? r.albums.title : 'альбом удалён')}</span>
        <span class="review-card__stars">${starString(r.rating)}</span>
        ${isAdminActive() ? `<button class="review-card__delete" data-delete-review="${r.id}" title="Удалить отзыв" aria-label="Удалить отзыв">&times;</button>` : ''}
      </div>
      ${r.review_text ? `<p class="review-card__text">${escapeHtml(r.review_text)}</p>` : ''}
    </div>
  `).join('');

  el.allReviewsList.querySelectorAll('[data-delete-review]').forEach(btn => {
    btn.addEventListener('click', () => deleteReview(btn.dataset.deleteReview, loadAllReviews));
  });
}

async function deleteReview(reviewId, onDone){
  if (!confirm('Удалить этот отзыв?')) return;
  const { error } = await db.from('reviews').delete().eq('id', reviewId);
  if (error){
    console.error(error);
    alert('Не получилось удалить отзыв.');
    return;
  }
  if (onDone) onDone();
}

// ---------- hit of the month (top of home) ----------
const HIT_ROW_ID = '00000000-0000-0000-0000-000000000001';

async function loadHitMonth(){
  el.hitMonth.hidden = true;
  el.hitMonthEditBtn.hidden = true;
  el.hitMonthAdmin.hidden = true;

  const { data, error } = await db
    .from('hit')
    .select('track_title, artist, cover_url, updated_at')
    .eq('id', HIT_ROW_ID)
    .maybeSingle();

  if (error){
    // Таблицы hit может не быть — прячем секцию.
    return;
  }

  const admin = isAdminActive();
  el.hitMonthEditBtn.hidden = !admin;

  if (!data || !data.track_title){
    // Хит не задан. Админу показываем панель выбора, остальным — ничего.
    if (admin){
      el.hitMonth.hidden = false;
      el.hitMonthBody.innerHTML = `<div class="hit-month__empty">Хит ещё не выбран. Найдите песню ниже.</div>`;
      el.hitMonthAdmin.hidden = false;
    }
    return;
  }

  renderHitMonth(data, admin);
}

function renderHitMonth(hit, admin){
  const cover = hit.cover_url
    ? `<img class="hit-month__art" src="${hit.cover_url}" alt="" loading="lazy">`
    : `<div class="hit-month__art hit-month__art--placeholder">${ICON.sound}</div>`;

  el.hitMonthBody.innerHTML = `
    ${cover}
    <div class="hit-month__info">
      <div class="hit-month__track">${escapeHtml(hit.track_title)}</div>
      <div class="hit-month__artist mono">${escapeHtml(hit.artist || '—')}</div>
      <div class="hit-month__actions">
        <button class="btn btn--ghost hit-month__preview" id="hitMonthPreviewBtn" data-title="${escapeHtml(hit.track_title)}" data-artist="${escapeHtml(hit.artist || '')}">
          <span class="preview-btn__play">${ICON.play}</span>
          <span class="preview-btn__pause" hidden>${ICON.pause}</span>
          Послушать 30 секунд
        </button>
        <a class="btn btn--primary hit-month__yt" href="${youtubeMusicUrl(hit.artist, hit.track_title)}" target="_blank" rel="noopener">Слушать в YouTube Music</a>
      </div>
    </div>
  `;

  el.hitMonth.hidden = false;
  el.hitMonthEditBtn.hidden = !admin;
  el.hitMonthAdmin.hidden = true;

  const previewBtn = el.hitMonthBody.querySelector('#hitMonthPreviewBtn');
  if (previewBtn){
    previewBtn.addEventListener('click', () => toggleHitPreview(previewBtn));
  }
}

async function toggleHitPreview(btn){
  if (previewBtnEl === btn && previewAudio && !previewAudio.paused){
    previewAudio.pause();
    setPreviewPlaying(btn, false);
    return;
  }

  if (previewAudio){
    previewAudio.pause();
    if (previewBtnEl) setPreviewPlaying(previewBtnEl, false);
  }

  let url = btn.dataset.url;
  if (!url){
    const term = `${btn.dataset.artist} ${btn.dataset.title}`.trim();
    try {
      const results = await searchItunes(term);
      url = (results || [])[0]?.previewUrl;
    } catch (err){
      console.error(err);
    }
    if (url) btn.dataset.url = url;
  }

  if (!url){
    alert('Превью для этой песни не найдено.');
    return;
  }

  previewAudio = new Audio(url);
  previewBtnEl = btn;
  setPreviewPlaying(btn, true);
  previewAudio.play().catch(err => {
    console.error(err);
    setPreviewPlaying(btn, false);
    alert('Не удалось включить превью.');
  });
  previewAudio.addEventListener('ended', () => {
    setPreviewPlaying(btn, false);
    previewAudio = null;
    previewBtnEl = null;
  });
}

function toggleHitAdmin(){
  const open = el.hitMonthAdmin.hidden;
  el.hitMonthAdmin.hidden = !open;
  if (open){
    el.hitMonthSearchInput.value = '';
    el.hitMonthResults.hidden = true;
    el.hitMonthResults.innerHTML = '';
    state.hitSearchResults = [];
    setTimeout(() => el.hitMonthSearchInput.focus(), 50);
  }
}

async function setHitTrack(result){
  const { error } = await db
    .from('hit')
    .upsert({
      id: HIT_ROW_ID,
      track_title: result.trackName || 'Без названия',
      artist: result.artistName || 'Неизвестный артист',
      cover_url: (result.artworkUrl100 || result.artworkUrl60 || '').replace('100x100', '300x300'),
      set_by: getLogin() || null,
    }, { onConflict: 'id' });

  if (error){
    console.error(error);
    alert('Не получилось поставить хит.');
    return;
  }

  el.hitMonthAdmin.hidden = true;
  await loadHitMonth();
}

function renderHitSearchResults(){
  const results = state.hitSearchResults || [];
  if (results.length === 0){
    el.hitMonthResults.innerHTML = `<div class="search-empty">Ничего не найдено. Попробуйте другой запрос.</div>`;
    el.hitMonthResults.hidden = false;
    return;
  }

  el.hitMonthResults.innerHTML = results.map((r, idx) => {
    const title = r.trackName || 'Без названия';
    const artist = r.artistName || 'Неизвестный артист';
    return `
      <div class="result-row">
        <img class="result-row__art" src="${r.artworkUrl60 || ''}" alt="" loading="lazy">
        <div class="result-row__info">
          <span class="result-row__title">${escapeHtml(title)}</span>
          <span class="result-row__artist">${escapeHtml(artist)}</span>
        </div>
        <button class="add-btn" data-hit-add="${idx}">Сделать хитом</button>
      </div>
    `;
  }).join('');

  el.hitMonthResults.hidden = false;
  el.hitMonthResults.querySelectorAll('[data-hit-add]').forEach(btn => {
    btn.addEventListener('click', () => setHitTrack(state.hitSearchResults[Number(btn.dataset.hitAdd)]));
  });
}

function handleHitSearchInput(){
  const term = el.hitMonthSearchInput.value.trim();
  clearTimeout(state.hitSearchTimer);

  if (term.length < 2){
    el.hitMonthResults.hidden = true;
    el.hitMonthResults.innerHTML = '';
    state.hitSearchResults = [];
    el.hitMonthSpinner.hidden = true;
    return;
  }

  el.hitMonthSpinner.hidden = false;
  state.hitSearchTimer = setTimeout(async () => {
    try {
      const results = await searchItunes(term);
      state.hitSearchResults = results;
      renderHitSearchResults();
    } catch (err){
      console.error(err);
      el.hitMonthResults.innerHTML = `<div class="search-error">Не удалось выполнить поиск. Проверьте подключение к интернету.</div>`;
      el.hitMonthResults.hidden = false;
    } finally {
      el.hitMonthSpinner.hidden = true;
    }
  }, 380);
}

// ---------- smak tab ----------
async function loadSmak(){
  const { data, error } = await db
    .from('smak')
    .select('id, album_id, score, comment, created_at, albums(title, author)')
    .order('score', { ascending: false });

  if (error){
    console.error(error);
    el.smakGrid.innerHTML = '';
    el.emptySmak.classList.add('is-visible');
    return;
  }

  const items = data || [];
  el.smakCount.textContent = `${items.length} ${pluralAlbums(items.length)}`;
  el.emptySmak.classList.toggle('is-visible', items.length === 0);
  el.smakGrid.style.display = items.length === 0 ? 'none' : 'grid';

  el.smakGrid.innerHTML = items.map(s => `
    <div class="smak-card" data-album-id="${s.album_id}">
      <div class="smak-card__title">${escapeHtml(s.albums ? s.albums.title : 'альбом удалён')}</div>
      <div class="smak-card__score">${s.score} / 100</div>
      ${s.comment ? `<div class="smak-card__comment">${escapeHtml(s.comment)}</div>` : ''}
    </div>
  `).join('');

  el.smakGrid.querySelectorAll('.smak-card').forEach(card => {
    card.addEventListener('click', () => {
      switchTab('home');
      openAlbum(card.dataset.albumId);
      el.viewGrid.hidden = true;
      el.viewAlbum.hidden = false;
    });
  });
}

// ---------- admin smak submit (from album page) ----------
function smakColor(score){
  // 1 → холодный синий, 50 → зелёный, 100 → горячий красный (как температура)
  const t = Math.max(1, Math.min(100, score)) / 100;
  const hue = (1 - t) * 220; // 220° (синий) → 0° (красный)
  return `hsl(${Math.round(hue)} 85% 58%)`;
}

function refreshSmakColor(){
  const score = Number(el.adminSmakScoreInput.value);
  const color = smakColor(score);
  el.adminSmakScoreValue.style.color = color;
  el.adminSmakScoreInput.style.accentColor = color;
}

async function saveSmak(){
  const albumId = state.currentAlbumId;
  if (!albumId || !isAdminActive()) return;

  const score = Number(el.adminSmakScoreInput.value);
  const comment = el.adminSmakCommentInput.value.trim();

  // Один альбом, одна админская оценка смак. Спросим перед заменой.
  const { data: existing } = await db
    .from('smak')
    .select('score')
    .eq('album_id', albumId)
    .maybeSingle();

  if (existing && !confirm(`У этого альбома уже стоит смак (${existing.score}/100). Заменить новой оценкой?`)){
    return;
  }

  el.saveSmakBtn.disabled = true;
  const { error } = await db
    .from('smak')
    .upsert({ album_id: albumId, score, comment: comment || null }, { onConflict: 'album_id' });
  el.saveSmakBtn.disabled = false;

  if (error){
    console.error(error);
    alert('Не получилось отправить в смак.');
    return;
  }

  el.adminSmakScoreInput.value = 50;
  el.adminSmakScoreValue.textContent = '50';
  refreshSmakColor();
  el.adminSmakCommentInput.value = '';
  alert('Отправлено в смак!');
}

// ---------- init ----------
updateLoginBtn();
subscribeToAlbums(); // Подключаем Realtime-трансляцию для альбомов

const initialParams = new URLSearchParams(window.location.search);
const sharedAlbumId = initialParams.get('album');

if (sharedAlbumId){
  el.viewGrid.hidden = true;
}

if (!sharedAlbumId){
  loadHitMonth();
}

loadAlbums().then(() => {
  if (!sharedAlbumId) return;

  if (getAlbum(sharedAlbumId)){
    openAlbum(sharedAlbumId);
  } else {
    el.viewGrid.hidden = false;
  }
});