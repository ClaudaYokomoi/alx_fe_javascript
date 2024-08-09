document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuote');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const notification = document.getElementById('notification');
  
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "Keep it simple.", category: "Simplicity" },
        { text: "Stay positive.", category: "Positivity" },
        { text: "Be yourself.", category: "Self" }
    ];
  
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }
  
    function showRandomQuote() {
        const filteredQuotes = filterQuotesArray();
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = '<p>No quotes available for the selected category.</p>';
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
    }
  
    function createAddQuoteForm() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            populateCategories();
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            alert('Quote added successfully!');
            syncQuotes();
        } else {
            alert('Please enter both a quote and a category.');
        }
    }
  
    function filterQuotesArray() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'all') {
            return quotes;
        }
        return quotes.filter(quote => quote.category === selectedCategory);
    }
  
    function filterQuotes() {
        showRandomQuote();
        localStorage.setItem('selectedCategory', categoryFilter.value);
    }
  
    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        const selectedCategory = localStorage.getItem('selectedCategory');
        if (selectedCategory) {
            categoryFilter.value = selectedCategory;
        }
    }
  
    function exportQuotesToJson() {
        const json = JSON.stringify(quotes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const importedQuotes = JSON.parse(fileReader.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            populateCategories();
            filterQuotes();
        };
        fileReader.readAsText(event.target.files[0]);
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
            showRandomQuote();
        } catch (error) {
            console.error('Failed to fetch quotes from server', error);
        }
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportQuotesButton.addEventListener('click', exportQuotesToJson);
    importFileInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
  
    // Initial setup
    populateCategories();
    showRandomQuote();
    fetchQuotesFromServer();
    setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds
  });
  