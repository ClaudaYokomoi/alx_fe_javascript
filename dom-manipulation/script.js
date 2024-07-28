document.addEventListener('DOMContentLoaded', () => {
  const quotes = [
      { text: "Keep it simple.", category: "Simplicity" },
      { text: "Stay positive.", category: "Positivity" },
      { text: "Be yourself.", category: "Self" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  
  function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.innerHTML = `${randomQuote.text} - ${randomQuote.category}`;
  }

  function addQuote(text, category) {
      if (text && category) {
          quotes.push({ text, category });
          alert('Quote added successfully!');
      } else {
          alert('Please enter both quote text and category.');
      }
  }

  function createAddQuoteForm() {
      const formContainer = document.createElement('div');
      const quoteInput = document.createElement('input');
      quoteInput.id = 'newQuoteText';
      quoteInput.type = 'text';
      quoteInput.placeholder = 'Enter a new quote';
      
      const categoryInput = document.createElement('input');
      categoryInput.id = 'newQuoteCategory';
      categoryInput.type = 'text';
      categoryInput.placeholder = 'Enter quote category';
      
      const addQuoteButton = document.createElement('button');
      addQuoteButton.innerText = 'Add Quote';
      addQuoteButton.addEventListener('click', () => {
          const text = quoteInput.value.trim();
          const category = categoryInput.value.trim();
          addQuote(text, category);
          quoteInput.value = '';
          categoryInput.value = '';
      });
      
      formContainer.appendChild(quoteInput);
      formContainer.appendChild(categoryInput);
      formContainer.appendChild(addQuoteButton);
      
      document.body.appendChild(formContainer);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  
  // Create the add quote form
  createAddQuoteForm();

  // Show a random quote initially
  showRandomQuote();
});

