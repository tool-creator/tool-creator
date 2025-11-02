document.addEventListener('DOMContentLoaded', () => {
  const prompt = localStorage.getItem('prompt');
  if (!prompt) {
    window.location.href = '../index.html';
    return;
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
      if (data.success) {
        console.log('prompt validated succesfully');
        alert(
          "Connor, this should have worked. Next, I'll parse the responce from the AI and run the output."
        );
      } else {
        alert(data.error || 'An error occurred while validating the prompt.');
        window.location.href = '../index.html';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while validating the prompt.');
      window.location.href = '../index.html';
    });
});
