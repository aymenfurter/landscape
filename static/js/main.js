function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

function applyTagColors() {
    document.querySelectorAll('.item-tag').forEach(tag => {
        const tagText = tag.textContent || tag.innerText;
        tag.style.backgroundColor = stringToColor(tagText);
    });
}

function showItemDetails(event, itemData) {
    const item = JSON.parse(itemData);
    const detailsElement = document.getElementById('itemDetails');
    detailsElement.innerHTML = `
        <div class="item-details-content">
            <h3>${item.title || 'Untitled'}</h3>
            <p>${item.description || 'No description available.'}</p>
            ${item.github ? `
            <div class="github-info">
                ${item.github.includes('github.com') ? '<img src="https://github.com/favicon.ico" alt="GitHub">' : ''}
                <a href="${item.github}" target="_blank">${item.github.includes('github.com') ? 'GitHub' : 'Link'}</a>
            </div>
            ` : ''}
            ${item.tags && item.tags.length > 0 ? `
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag" style="background-color: ${stringToColor(tag)}">${tag}</span>`).join('')}
            </div>
            ` : ''}
        </div>
    `;
    
    detailsElement.style.display = 'block';
    detailsElement.style.position = 'absolute';
    detailsElement.style.pointerEvents = 'auto'; // Allow pointer events

    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const overlayWidth = detailsElement.offsetWidth;
    const overlayHeight = detailsElement.offsetHeight;

    let left = x;
    let top = y;

    if (left + overlayWidth > window.scrollX + viewportWidth) {
        left = window.scrollX + viewportWidth - overlayWidth;
    }

    if (top + overlayHeight > window.scrollY + viewportHeight) {
        top = window.scrollY + viewportHeight - overlayHeight;
    }

    detailsElement.style.left = `${left}px`;
    detailsElement.style.top = `${top}px`;
}

function toggleView() {
    const landscape = document.getElementById('landscape');
    landscape.classList.toggle('list-view');
    const button = document.querySelector('.view-switch');
    button.textContent = landscape.classList.contains('list-view') ? 'Grid View' : 'List View';
}

function searchLandscape() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        const items = category.querySelectorAll('.item');
        let visibleItems = 0;
        items.forEach(item => {
            const itemName = item.querySelector('p').textContent.toLowerCase();
            if (itemName.includes(searchTerm)) {
                item.style.display = 'flex';
                visibleItems++;
            } else {
                item.style.display = 'none';
            }
        });
        category.style.display = visibleItems > 0 ? 'block' : 'none';
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

document.addEventListener('DOMContentLoaded', (event) => {
    applyTagColors();
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }

    document.getElementById('search').addEventListener('input', searchLandscape);

    document.addEventListener('click', event => {
        if (!event.target.closest('#itemDetails') && !event.target.closest('.item')) {
            document.getElementById('itemDetails').style.display = 'none';
        }
    });

    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.querySelector('.view-switch').addEventListener('click', toggleView);
});
