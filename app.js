// Vibify — музыкальный хаб для друзей, на Supabase

const SUPABASE_URL = 'https://jwccjxkpgrlybulqhstm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QnjYc7l5Inlq1jD_7MzdGw_3Oiky9Xa';

// ИСПРАВЛЕНО: Правильный вызов инициализации клиента из глобального объекта библиотеки
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

  openCreateModal: document.getElementById('openCreateModal'),
  emptyCreateBtn: document.getElementById('emptyCreateBtn'),
  modalOverlay: document.getElementById('modalOverlay'),
  albumNameInput: document.getElementById('albumNameInput'),
  albumAuthorInput: document.getElementById('albumAuthorInput'),
  albumDescriptionInputModal: document.getElementById('albumDescriptionInputModal'),
  cancelCreate: document.getElementById('cancelCreate'),
  confirmCreate: document.getElementById('confirmCreate'),

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

// ---------- per-album emoji ----------
const ALBUM_EMOJIS = [
  '🎵','🎶','🎧','🎤','🎸','🥁','🎷','🎹','🪕','🎺',
  '📀','💿','🔊','✨','🌊','🔥','🌙','⭐','🌈','🍀',
  '🌴','🍂','☕','🌆','🚀','🌻','🦋','🧊','🍉','🎨'
];

function albumEmoji(id){
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++){
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % ALBUM_EMOJIS.length;
  return ALBUM_EMOJIS[idx];
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

  const { data: counts, error: countError } = await db
    .from('tracks')
    .select('album_id');

  if (countError) console.error(countError);

  const countMap = {};
  (counts || []).forEach(t => {
    countMap[t.album_id] = (countMap[t.album_id] || 0) + 1;
  });

  state.albums = (albums || []).map(a => ({
    ...a,
    trackCount: countMap[a.id] || 0,
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
  el.emptyAlbumsText.textContent = 'Соберите первый альбом — добавляйте треки и делитесь звучанием с друзьями.';
  el.emptyAlbums.classList.toggle('is-visible', count === 0);
  el.albumGrid.style.display = count === 0 ? 'none' : 'grid';

  el.albumGrid.innerHTML = state.albums.map(album => `
    <div class="album-card" data-id="${album.id}">
      ${isOwner(album) ? `<button class="album-card__delete" data-delete="${album.id}" title="Удалить альбом" aria-label="Удалить альбом">&times;</button>` : ''}
      <div class="disc">${albumEmoji(album.id)}</div>
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
    .select('id, album_id, track_title, artist, cover_url, created_at')
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

  el.submitReviewBtn.disabled = true;
  const { error } = await db.from('reviews').insert({
    album_id: albumId,
    author_name: author,
    rating,
    review_text: text || null,
  });
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
  el.albumDiscBig.textContent = albumEmoji(id);

  // Права редактирования — только у создателя альбома
  el.renameBtn.style.display = owner ? '' : 'none';
  el.renameAuthorBtn.style.display = owner ? '' : 'none';
  el.renameDescBtn.style.display = owner ? '' : 'none';
  el.searchWrap.style.display = owner ? '' : 'none';

  // Отзывы — доступны всем, КРОМЕ создателя альбома
  el.reviewForm.hidden = owner;
  el.ownerReviewNotice.hidden = !owner;

  updateAdminBtn();

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
        <a class="yt-btn" href="${youtubeMusicUrl(track.artist, track.track_title)}" target="_blank" rel="noopener" title="Искать в YouTube Music" aria-label="Искать в YouTube Music">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M8 6v12l10-6-10-6z" fill="currentColor"/></svg>
        </a>
        ${isOwner(album) ? `
        <button class="remove-btn" data-remove="${track.id}" title="Удалить трек" aria-label="Удалить трек">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  el.trackList.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeTrack(btn.dataset.remove));
  });

  renderSearchResults();
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
el.searchInput.addEventListener('input', handleSearchInput);

document.addEventListener('click', (e) => {
  if (!el.searchResults.hidden &&
      !el.searchResults.contains(e.target) &&
      e.target !== el.searchInput) {
    el.searchResults.hidden = true;
  }
});
el.searchInput.addEventListener('focus', () => {
  if (state.searchResults.length > 0) el.searchResults.hidden = false;
});

// ---------- init ----------
updateLoginBtn();
subscribeToAlbums(); // Подключаем Realtime-трансляцию для альбомов

const initialParams = new URLSearchParams(window.location.search);
const sharedAlbumId = initialParams.get('album');

if (sharedAlbumId){
  el.viewGrid.hidden = true;
}

loadAlbums().then(() => {
  if (!sharedAlbumId) return;

  if (getAlbum(sharedAlbumId)){
    openAlbum(sharedAlbumId);
  } else {
    el.viewGrid.hidden = false;
  }
});