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

  function showRandom
