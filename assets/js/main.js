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
            <button class="close-button" onclick="closeItemDetails()">×</button>
            <div class="item-header">
                ${item.logo.includes(".png") ? `<img src="images/${item.logo}" class="item-image item-image-png" alt="${item.title}">` : '<h3 class="item-image item-image-text">' + item.logo + '&nbsp;</h3>'}
                <h3>${item.title || 'Untitled'}</h3>

            </div>
            <p class="item-description">${item.description || 'No description available.'}</p>
            ${item.github ? `
            <div class="github-info">
                <a href="${item.github}" target="_blank" class="github-link">
                    ${item.github.includes('github.com') ? '<svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path> </svg> View on GitHub' : 'Visit Website'}
                </a>
            </div>
            ` : ''}
            ${item.tags && item.tags.length > 0 ? `
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag" style="background-color: ${stringToColor(tag)}">${tag}</span>`).join('')}
            </div>
            ` : ''}
            ${item.github && item.github.includes('github.com') ? `
            <div class="item-meta">
                
                <span class="last-updated">Last updated: ${item.lastModified || 'n/A'}</span>
                <span class="stars">⭐ ${item.stars || 'n/A'}</span>
            </div           
            ` : ''}

        </div>
    `;

    detailsElement.style.display = 'block';
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'item-details-overlay';
    document.body.appendChild(overlay);

    // Position the details element in the center of the screen
    detailsElement.style.position = 'fixed';
    detailsElement.style.top = '50%';
    detailsElement.style.left = '50%';
    detailsElement.style.transform = 'translate(-50%, -50%)';

    // Enable pointer events
    detailsElement.style.pointerEvents = 'auto';

    // Close details when clicking outside
    overlay.addEventListener('click', closeItemDetails);

    // Prevent closing when clicking inside the details
    detailsElement.addEventListener('click', (e) => e.stopPropagation());
}

function closeItemDetails() {
    const detailsElement = document.getElementById('itemDetails');
    detailsElement.style.display = 'none';
    
    // Remove overlay
    const overlay = document.querySelector('.item-details-overlay');
    if (overlay) {
        overlay.remove();
    }
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
