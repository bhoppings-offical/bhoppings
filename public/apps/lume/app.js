const icons = [
    { id: 'arrow-down',            name: 'Arrow Down',           category: 'interface',     path: 'Solid/arrow-down.svg' },
    { id: 'arrow-left',            name: 'Arrow Left',           category: 'interface',     path: 'Solid/arrow-left.svg' },
    { id: 'arrow-right',           name: 'Arrow Right',          category: 'interface',     path: 'Solid/arrow-right.svg' },
    { id: 'arrow-up',              name: 'Arrow Up',             category: 'interface',     path: 'Solid/arrow-up.svg' },
    { id: 'bell',                  name: 'Bell',                 category: 'communication', path: 'Solid/bell.svg' },
    { id: 'bell-slash',            name: 'Bell Slash',           category: 'communication', path: 'Solid/bell-slash.svg' },
    { id: 'bookmark',              name: 'Bookmark',             category: 'interface',     path: 'Solid/bookmark.svg' },
    { id: 'calendar',              name: 'Calendar',             category: 'interface',     path: 'Solid/calendar.svg' },
    { id: 'camera',                name: 'Camera',               category: 'media',         path: 'Solid/camera.svg' },
    { id: 'chart-pie',             name: 'Chart Pie',            category: 'interface',     path: 'Solid/chart-pie.svg' },
    { id: 'check-circle',          name: 'Check Circle',         category: 'interface',     path: 'Solid/check-circle.svg' },
    { id: 'chevron-circle-down',   name: 'Chevron Circle Down',  category: 'interface',     path: 'Solid/chevron-circle-down.svg' },
    { id: 'chevron-circle-left',   name: 'Chevron Circle Left',  category: 'interface',     path: 'Solid/chevron-circle-left.svg' },
    { id: 'chevron-circle-right',  name: 'Chevron Circle Right', category: 'interface',     path: 'Solid/chevron-circle-right.svg' },
    { id: 'chevron-circle-up',     name: 'Chevron Circle Up',    category: 'interface',     path: 'Solid/chevron-circle-up.svg' },
    { id: 'chevron-down',          name: 'Chevron Down',         category: 'interface',     path: 'Solid/chevron-down.svg' },
    { id: 'chevron-left',          name: 'Chevron Left',         category: 'interface',     path: 'Solid/chevron-left.svg' },
    { id: 'chevron-right',         name: 'Chevron Right',        category: 'interface',     path: 'Solid/chevron-right.svg' },
    { id: 'chevron-up',            name: 'Chevron Up',           category: 'interface',     path: 'Solid/chevron-up.svg' },
    { id: 'clock',                 name: 'Clock',                category: 'interface',     path: 'Solid/clock.svg' },
    { id: 'comment',               name: 'Comment',              category: 'communication', path: 'Solid/comment.svg' },
    { id: 'comment-dots',          name: 'Comment Dots',         category: 'communication', path: 'Solid/comment-dots.svg' },
    { id: 'comments',              name: 'Comments',             category: 'communication', path: 'Solid/comments.svg' },
    { id: 'compass',               name: 'Compass',              category: 'interface',     path: 'Solid/compass.svg' },
    { id: 'copy',                  name: 'Copy',                 category: 'interface',     path: 'Solid/copy.svg' },
    { id: 'coupon',                name: 'Coupon',               category: 'interface',     path: 'Solid/coupon.svg' },
    { id: 'credit-card',           name: 'Credit Card',          category: 'interface',     path: 'Solid/credit-card.svg' },
    { id: 'desktop',               name: 'Desktop',              category: 'devices',       path: 'Solid/desktop.svg' },
    { id: 'discount',              name: 'Discount',             category: 'interface',     path: 'Solid/discount.svg' },
    { id: 'download',              name: 'Download',             category: 'interface',     path: 'Solid/download.svg' },
    { id: 'envelope',              name: 'Envelope',             category: 'communication', path: 'Solid/envelope.svg' },
    { id: 'exclamation-circle',    name: 'Exclamation Circle',   category: 'interface',     path: 'Solid/exclamation-circle.svg' },
    { id: 'eye',                   name: 'Eye',                  category: 'interface',     path: 'Solid/eye.svg' },
    { id: 'eye-slash',             name: 'Eye Slash',            category: 'interface',     path: 'Solid/eye-slash.svg' },
    { id: 'file',                  name: 'File',                 category: 'interface',     path: 'Solid/file.svg' },
    { id: 'film',                  name: 'Film',                 category: 'media',         path: 'Solid/film.svg' },
    { id: 'filter',                name: 'Filter',               category: 'interface',     path: 'Solid/filter.svg' },
    { id: 'flag',                  name: 'Flag',                 category: 'interface',     path: 'Solid/flag.svg' },
    { id: 'folder',                name: 'Folder',               category: 'interface',     path: 'Solid/folder.svg' },
    { id: 'globe',                 name: 'Globe',                category: 'interface',     path: 'Solid/globe.svg' },
    { id: 'headphones',            name: 'Headphones',           category: 'devices',       path: 'Solid/headphones.svg' },
    { id: 'heart',                 name: 'Heart',                category: 'interface',     path: 'Solid/heart.svg' },
    { id: 'home',                  name: 'Home',                 category: 'interface',     path: 'Solid/home.svg' },
    { id: 'image',                 name: 'Image',                category: 'media',         path: 'Solid/image.svg' },
    { id: 'inbox',                 name: 'Inbox',                category: 'communication', path: 'Solid/inbox.svg' },
    { id: 'info-circle',           name: 'Info Circle',          category: 'interface',     path: 'Solid/info-circle.svg' },
    { id: 'link',                  name: 'Link',                 category: 'interface',     path: 'Solid/link.svg' },
    { id: 'lock',                  name: 'Lock',                 category: 'interface',     path: 'Solid/lock.svg' },
    { id: 'log-in',                name: 'Log In',               category: 'interface',     path: 'Solid/log-in.svg' },
    { id: 'log-out',               name: 'Log Out',              category: 'interface',     path: 'Solid/log-out.svg' },
    { id: 'map',                   name: 'Map',                  category: 'interface',     path: 'Solid/map.svg' },
    { id: 'map-marker',            name: 'Map Marker',           category: 'interface',     path: 'Solid/map-marker.svg' },
    { id: 'map-pin',               name: 'Map Pin',              category: 'interface',     path: 'Solid/map-pin.svg' },
    { id: 'menu',                  name: 'Menu',                 category: 'interface',     path: 'Solid/menu.svg' },
    { id: 'microphone',            name: 'Microphone',           category: 'media',         path: 'Solid/microphone.svg' },
    { id: 'microphone-slash',      name: 'Microphone Slash',     category: 'media',         path: 'Solid/microphone-slash.svg' },
    { id: 'minus-square',          name: 'Minus Square',         category: 'interface',     path: 'Solid/minus-square.svg' },
    { id: 'mobile',                name: 'Mobile',               category: 'devices',       path: 'Solid/mobile.svg' },
    { id: 'more-h-circle',         name: 'More H Circle',        category: 'interface',     path: 'Solid/more-h-circle.svg' },
    { id: 'more-v-circle',         name: 'More V Circle',        category: 'interface',     path: 'Solid/more-v-circle.svg' },
    { id: 'package',               name: 'Package',              category: 'interface',     path: 'Solid/package.svg' },
    { id: 'paperclip',             name: 'Paperclip',            category: 'interface',     path: 'Solid/paperclip.svg' },
    { id: 'pen',                   name: 'Pen',                  category: 'interface',     path: 'Solid/pen.svg' },
    { id: 'phone',                 name: 'Phone',                category: 'devices',       path: 'Solid/phone.svg' },
    { id: 'plus-square',           name: 'Plus Square',          category: 'interface',     path: 'Solid/plus-square.svg' },
    { id: 'question-circle',       name: 'Question Circle',      category: 'interface',     path: 'Solid/question-circle.svg' },
    { id: 'search',                name: 'Search',               category: 'interface',     path: 'Solid/search.svg' },
    { id: 'send',                  name: 'Send',                 category: 'communication', path: 'Solid/send.svg' },
    { id: 'settings',              name: 'Settings',             category: 'interface',     path: 'Solid/settings.svg' },
    { id: 'shield',                name: 'Shield',               category: 'interface',     path: 'Solid/shield.svg' },
    { id: 'shopping-basket',       name: 'Shopping Basket',      category: 'interface',     path: 'Solid/shopping-basket.svg' },
    { id: 'sliders-h',             name: 'Sliders H',            category: 'interface',     path: 'Solid/sliders-h.svg' },
    { id: 'sort-ascending',        name: 'Sort Ascending',       category: 'interface',     path: 'Solid/sort-ascending.svg' },
    { id: 'sort-descending',       name: 'Sort Descending',      category: 'interface',     path: 'Solid/sort-descending.svg' },
    { id: 'star',                  name: 'Star',                 category: 'interface',     path: 'Solid/star.svg' },
    { id: 'stopwatch',             name: 'Stopwatch',            category: 'interface',     path: 'Solid/stopwatch.svg' },
    { id: 'store',                 name: 'Store',                category: 'interface',     path: 'Solid/store.svg' },
    { id: 'tablet',                name: 'Tablet',               category: 'devices',       path: 'Solid/tablet.svg' },
    { id: 'tag',                   name: 'Tag',                  category: 'interface',     path: 'Solid/tag.svg' },
    { id: 'thumbtack',             name: 'Thumbtack',            category: 'interface',     path: 'Solid/thumbtack.svg' },
    { id: 'times-square',          name: 'Times Square',         category: 'interface',     path: 'Solid/times-square.svg' },
    { id: 'trash',                 name: 'Trash',                category: 'interface',     path: 'Solid/trash.svg' },
    { id: 'unlock',                name: 'Unlock',               category: 'interface',     path: 'Solid/unlock.svg' },
    { id: 'upload',                name: 'Upload',               category: 'interface',     path: 'Solid/upload.svg' },
    { id: 'user',                  name: 'User',                 category: 'interface',     path: 'Solid/user.svg' },
    { id: 'users',                 name: 'Users',                category: 'interface',     path: 'Solid/users.svg' },
    { id: 'users-three',           name: 'Users Three',          category: 'interface',     path: 'Solid/users-three.svg' },
    { id: 'video',                 name: 'Video',                category: 'media',         path: 'Solid/video.svg' },
    { id: 'video-slash',           name: 'Video Slash',          category: 'media',         path: 'Solid/video-slash.svg' },
    { id: 'volume-up',             name: 'Volume Up',            category: 'media',         path: 'Solid/volume-up.svg' }
];

const boldIcons = icons.map(icon => ({
    ...icon,
    id: icon.id + '-bold',
    path: icon.path.replace('Solid/', 'Bold/')
}));

let currentIconSet = icons;

document.addEventListener('DOMContentLoaded', () => {
    populateIcons();
    initAnimations();
    initTabs();
    initClipboard();
    initEventListeners();
});

function initStyleToggle() {
    const styleToggle = document.getElementById('style-toggle');
    const styleLabels = document.querySelectorAll('.style-label');
    if (!styleToggle) return;

    styleToggle.addEventListener('change', function () {
        styleLabels.forEach(label => label.classList.toggle('active'));
        currentIconSet = this.checked ? boldIcons : icons;
        const grid = document.getElementById('icons-grid');
        if (grid) { grid.innerHTML = ''; populateIcons(); }
    });
}

function populateIcons() {
    const grid = document.getElementById('icons-grid');
    if (!grid) return;
    grid.innerHTML = '';

    currentIconSet.forEach(icon => {
        const item = document.createElement('div');
        item.className = 'icon-item';
        item.dataset.category = icon.category;
        item.dataset.id = icon.id;

        const img = document.createElement('img');
        img.src = icon.path;
        img.alt = icon.name;
        img.className = 'icon-svg';
        img.onerror = function () {
            this.src = 'Solid/image.svg';
            item.classList.add('broken-icon');
        };

        const label = document.createElement('span');
        label.className = 'icon-name';
        label.textContent = icon.name;

        item.appendChild(img);
        item.appendChild(label);
        item.addEventListener('click', () => showIconModal(icon));
        grid.appendChild(item);
    });
}

function showIconModal(icon) {
    const modal   = document.getElementById('icon-modal');
    const nameEl  = document.getElementById('modal-icon-name');
    const iconEl  = document.getElementById('modal-icon-svg');
    if (!modal || !nameEl || !iconEl) return;

    nameEl.textContent = icon.name;
    iconEl.innerHTML = '';

    const img = document.createElement('img');
    img.src = icon.path;
    img.alt = icon.name;
    img.className = 'modal-icon-image';
    iconEl.appendChild(img);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initAnimations() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }
}

function initTabs() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const content = document.getElementById(btn.dataset.tab + '-content');
            if (content) content.classList.add('active');
        });
    });
}

function initClipboard() {
    if (typeof ClipboardJS !== 'undefined') {
        const clipboard = new ClipboardJS('.copy-button');
        clipboard.on('success', e => { showToast('Copied!'); e.clearSelection(); });
    }

    const copySVG = document.getElementById('copy-svg');
    if (copySVG) {
        copySVG.addEventListener('click', () => {
            const name = document.getElementById('modal-icon-name').textContent;
            const icon = currentIconSet.find(i => i.name === name);
            if (!icon) return;
            fetch(icon.path)
                .then(r => r.text())
                .then(svg => navigator.clipboard.writeText(svg).then(() => showToast('SVG copied!')))
                .catch(() => showToast('Failed to copy', true));
        });
    }

    const copyJSX = document.getElementById('copy-component');
    if (copyJSX) {
        copyJSX.addEventListener('click', () => {
            const name = document.getElementById('modal-icon-name').textContent;
            const component = `<Lume${name.replace(/\s+/g, '')} />`;
            navigator.clipboard.writeText(component)
                .then(() => showToast('JSX copied!'))
                .catch(() => showToast('Failed to copy', true));
        });
    }

    const downloadBtn = document.getElementById('download-svg');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const name = document.getElementById('modal-icon-name').textContent;
            const icon = currentIconSet.find(i => i.name === name);
            if (!icon) return;
            fetch(icon.path)
                .then(r => r.blob())
                .then(blob => {
                    const url  = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href     = url;
                    link.download = `lume-${name.toLowerCase().replace(/\s+/g, '-')}.svg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    showToast('Downloaded!');
                })
                .catch(() => showToast('Failed to download', true));
        });
    }
}

function initEventListeners() {
    const closeBtn = document.getElementById('close-modal');
    const modal    = document.getElementById('icon-modal');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => closeModal());
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    const search = document.getElementById('icon-search');
    if (search) search.addEventListener('input', () => filterIcons(search.value.toLowerCase()));

    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterIconsByCategory(btn.dataset.category);
        });
    });

    if (document.querySelector('.style-toggle-checkbox')) initStyleToggle();

    document.querySelectorAll('header nav a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
            }
        });
    });
}

function closeModal() {
    const modal = document.getElementById('icon-modal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

function filterIcons(term) {
    document.querySelectorAll('.icon-item').forEach(item => {
        const name = item.querySelector('.icon-name').textContent.toLowerCase();
        item.style.display = name.includes(term) ? 'flex' : 'none';
    });
}

function filterIconsByCategory(category) {
    document.querySelectorAll('.icon-item').forEach(item => {
        item.style.display = (category === 'all' || item.dataset.category === category) ? 'flex' : 'none';
    });
}

function showToast(message, isError = false) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast${isError ? ' error' : ''}`;
    toast.innerHTML = `
        <svg viewBox="0 0 24 24">
            ${isError
                ? '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>'
                : '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>'}
        </svg>
        <span>${message}</span>`;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('active'));
    });

    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
