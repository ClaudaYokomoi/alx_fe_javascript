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
  const exportButton = document.getElementById('exportQuotes');
  const importFile = document.getElementById('importFile');

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
          alert('Quote added successfully!');
      } else {
          alert('Please enter both quote text and category.');
      }
  }

  function exportToJson() {
      const dataStr = JSON.stringify(quotes);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'quotes.json';
      downloadLink.click();
  }

  function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
      };
      fileReader.readAsText(event.target.files[0]);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportButton.addEventListener('click', exportToJson);
  importFile.addEventListener('change', importFromJsonFile);

  // Show a random quote initially
  showRandomQuote();
});

