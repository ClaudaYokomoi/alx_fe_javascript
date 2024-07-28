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
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.innerText = `${randomQuote.text} - ${randomQuote.category}`;
  }

  function addQuote() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();
      if (text && category) {
          quotes.push({ text, category });
          newQuoteText.value = '';
          newQuoteCategory.value = '';
          saveQuotes();
          populateCategories();
          alert('Quote added successfully!');
      } else {
          alert('Please enter both quote text and category.');
      }
  }

  function exportQuotes() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "quotes.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
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
      const categories = [...new Set(quotes.map(quote => quote.category))];
      categoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.innerText = category;
          categoryFilter.appendChild(option);
      });
  }

  function filterQuotes() {
      const selectedCategory = categoryFilter.value;
      const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
      if (filteredQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const randomQuote = filteredQuotes[randomIndex];
          quoteDisplay.innerText = `${randomQuote.text} - ${randomQuote.category}`;
      } else {
          quoteDisplay.innerText = 'No quotes available for this category.';
      }
  }

  function syncWithServer() {
      fetch('https://jsonplaceholder.typicode.com/posts')
          .then(response => response.json())
          .then(data => {
              // Simulate server data
              const serverQuotes = data.map(post => ({ text: post.title, category: "Server" }));
              quotes.push(...serverQuotes);
              saveQuotes();
              populateCategories();
          })
          .catch(error => console.error('Error fetching data from server:', error));
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportQuotesButton.addEventListener('click', exportQuotes);
  importFileInput.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);

  // Initial setup
  showRandomQuote();
  populateCategories();

  // Sync with server every 30 seconds
  setInterval(syncWithServer, 30000);
});
