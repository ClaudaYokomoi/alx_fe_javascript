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

  function populateCategoryFilter() {
      const categories = ["all", ...new Set(quotes.map(q => q.category))];
      categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
      categoryFilter.value = localStorage.getItem('selectedCategory') || 'all';
  }

  function showRandomQuote() {
      const filteredQuotes = quotes.filter(quote => categoryFilter.value === 'all' || quote.category === categoryFilter.value);
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      quoteDisplay.innerText = `${randomQuote.text} - ${randomQuote.category}`;
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
          populateCategoryFilter();
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
          populateCategoryFilter();
      };
      fileReader.readAsText(event.target.files[0]);
  }

  populateCategoryFilter();
  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  // Show a random quote initially
  showRandomQuote();
});
