document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('beforeunload', function () {
    localStorage.removeItem('prompt');
  });
  const prompt = localStorage.getItem('prompt');
  if (!prompt) {
    window.location.href = '../index.html';
    return;
  }
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.style.display = 'block';
  }
  fetch('/api/validate-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (spinner) {
        spinner.style.display = 'none';
      }
      if (data.success) {
        console.log('prompt validated successfully');
        const iframe = document.getElementById('ai-code-previewer');
        if (iframe) {
          iframe.srcdoc = data.sanitizedHtml
            .replace(/```html/g, '')
            .replace(/```/g, '');
        } else {
          console.warn('Iframe not found - please check the ID');
          alert('Iframe not found - please check the ID');
          window.location.href = '../index.html';
          return;
        }
      }
    })
    .catch((error) => {
      if (spinner) {
        spinner.style.display = 'none';
      }
      console.error('Error:', error);
      alert('An error occurred while validating the prompt.');
      window.location.href = '../index.html';
      return;
    });
});
