document.addEventListener('DOMContentLoaded', () => {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "Keep it simple.", category: "Simplicity" },
        { text: "Stay positive.", category: "Positivity" },
        { text: "Be yourself.", category: "Self" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerText = `${randomQuote.text} - ${randomQuote.category}`;
    }

    async function postQuoteToServer(quote) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: quote.text,
                    body: quote.category,
                    userId: 1
                })
            });
            if (!response.ok) {
                throw new Error('Failed to post quote to server');
            }
            const responseData = await response.json();
            console.log('Quote posted to server successfully:', responseData);
        } catch (error) {
            console.error('Failed to post quote to server', error);
        }
    }

    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            const newQuote = { text, category };
            quotes.push(newQuote);
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            saveQuotes();
            postQuoteToServer(newQuote);
            alert('Quote added successfully!');
            populateCategories();
        } else {
            alert('Please enter both quote text and category.');
        }
    }

    function exportQuotesToJson() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            populateCategories();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function getFilteredQuotes() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'all') {
            return quotes;
        } else {
            return quotes.filter(quote => quote.category === selectedCategory);
        }
    }

    function filterQuotes() {
        showRandomQuote();
        saveLastSelectedCategory();
    }

    function saveLastSelectedCategory() {
        localStorage.setItem('lastSelectedCategory', categoryFilter.value);
    }

    function loadLastSelectedCategory() {
        const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();
            serverQuotes.forEach(serverQuote => {
                if (!quotes.some(quote => quote.text === serverQuote.title)) {
                    quotes.push({
                        text: serverQuote.title,
                        category: 'Server'
                    });
                }
            });
            saveQuotes();
            alert('Quotes synced from server successfully!');
            populateCategories();
        } catch (error) {
            console.error('Failed to fetch quotes from server', error);
        }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    exportQuotesButton.addEventListener('click', exportQuotesToJson);
    importFileInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);

    // Show a random quote initially
    showRandomQuote();
    // Load last selected category
    loadLastSelectedCategory();
    // Populate categories
    populateCategories();
    // Fetch quotes from server periodically
    setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds
});
