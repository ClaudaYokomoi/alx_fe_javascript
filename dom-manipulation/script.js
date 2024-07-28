document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
      { text: "Keep it simple.", category: "Simplicity" },
      { text: "Stay positive.", category: "Positivity" },
      { text: "Be yourself.", category: "Self" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuoteButton');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const categoryFilter = document.getElementById('categoryFilter');
  const importFile = document.getElementById('importFile');
  const exportQuotesButton = document.getElementById('exportQuotes');

  function populateCategories() {
      const categories = ["all", ...new Set(quotes.map(q => q.category))];
      categoryFilter.innerHTML = '';
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
      });
      categoryFilter.value = localStorage.getItem('selectedCategory') || 'all';
  }

  function showRandomQuote() {
      const filteredQuotes = quotes.filter(quote => categoryFilter.value === 'all' || quote.category === categoryFilter.value);
      if (filteredQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const randomQuote = filteredQuotes[randomIndex];
          quoteDisplay.innerText = `${randomQuote.text} - ${randomQuote.category}`;
      } else {
          quoteDisplay.innerText = 'No quotes available for this category.';
      }
  }

  function addQuote() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();
      if (text && category) {
          quotes.push({ text, category });
          newQuoteText.value = '';
          newQuoteCategory.value = '';
          alert('Quote added successfully!');
          saveQuotes();
          populateCategories();
      } else {
          alert('Please enter both quote text and category.');
      }
  }

  function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function filterQuotes() {
      localStorage.setItem('selectedCategory', categoryFilter.value);
      showRandomQuote();
  }

  function exportQuotes() {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
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
          showRandomQuote();
      };
      fileReader.readAsText(event.target.files[0]);
  }

  populateCategories();
  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportQuotesButton.addEventListener('click', exportQuotes);
  importFile.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);

  // Show a random quote initially
  showRandomQuote();
});
