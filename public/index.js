document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.main-text-area');
  if (!textarea) return;
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (textarea.value.trim() !== '') {
        const value = textarea.value;
        fetch('/api/validate-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: value }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('prompt', value);
            window.location.href = 'create';
          } else {
            alert(data.error || 'An error occurred while validating the prompt.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while validating the prompt.');
        })
      }
    }
  });
});
