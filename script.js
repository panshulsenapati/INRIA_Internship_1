document.addEventListener('DOMContentLoaded', () => {
    const textbox = document.getElementById('textbox');
    const suggestionsBox = document.getElementById('suggestions');

    textbox.addEventListener('input', async (event) => {
        const query = event.target.value;
        if (query.length > 0) {
            const suggestions = await getSuggestions(query);
            showSuggestions(suggestions, query);
        } else {
            suggestionsBox.innerHTML = '';
        }
    });

    textbox.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            navigateSuggestions(event.key);
        } else if (event.key === 'Enter') {
            selectSuggestion();
        }
    });
});

async function getSuggestions(query) {
    const response = await fetch('https://api.yourlanguageapi.com/suggest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ prompt: query })
    });
    const data = await response.json();
    return data.suggestions;
}


function mockSuggestions(query) {
    // This is a mock function to simulate suggestions.
    // Replace this with actual API/model call.
    const suggestions = ['hello', 'help', 'hell', 'helmet', 'hero', 'helicopter'];
    return suggestions.filter(s => s.startsWith(query));
}

function showSuggestions(suggestions, query) {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion';
        suggestionElement.textContent = suggestion;
        suggestionElement.addEventListener('click', () => {
            document.getElementById('textbox').value = suggestion;
            suggestionsBox.innerHTML = '';
        });
        suggestionsBox.appendChild(suggestionElement);
    });
}

function navigateSuggestions(direction) {
    const suggestionsBox = document.getElementById('suggestions');
    const active = suggestionsBox.querySelector('.active');
    let nextActive;
    if (direction === 'ArrowDown') {
        nextActive = active ? active.nextElementSibling : suggestionsBox.firstChild;
    } else {
        nextActive = active ? active.previousElementSibling : suggestionsBox.lastChild;
    }
    if (active) {
        active.classList.remove('active');
    }
    if (nextActive) {
        nextActive.classList.add('active');
    }
}

function selectSuggestion() {
    const suggestionsBox = document.getElementById('suggestions');
    const active = suggestionsBox.querySelector('.active');
    if (active) {
        document.getElementById('textbox').value = active.textContent;
        suggestionsBox.innerHTML = '';
    }
}
