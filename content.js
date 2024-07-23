const predefinedWords = ["example", "test", "highlight", "and"];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze") {
    highlightWords();
  }
});

function highlightWords() {
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    predefinedWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = node.textContent.match(regex);
      
      if (matches) {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(regex, `<span class="highlight" data-word="$&">$&</span>`);
        node.parentNode.replaceChild(span, node);
      }
    });
  });

  addMouseoverListeners();
}

function addMouseoverListeners() {
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach((highlight) => {
    highlight.addEventListener('mouseover', showContext);
    highlight.addEventListener('mouseout', hideContext);
  });
}

function showContext(event) {
  const word = event.target.dataset.word;
  
  const contextWindow = document.createElement('div');
  contextWindow.className = 'context-window';
  contextWindow.textContent = `Highlighted word: ${word}`;
  
  document.body.appendChild(contextWindow);
  
  const rect = event.target.getBoundingClientRect();
  contextWindow.style.left = `${rect.left}px`;
  contextWindow.style.top = `${rect.top - contextWindow.offsetHeight - 10}px`;
}

function hideContext() {
  const contextWindow = document.querySelector('.context-window');
  if (contextWindow) {
    contextWindow.remove();
  }
}