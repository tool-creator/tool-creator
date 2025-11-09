document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.main-text-area');
  const button = document.getElementById('submit-button');
  if (!textarea) return;
  textarea.addEventListener('keydown', (e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      textarea.value.trim() !== ''
    ) {
      e.preventDefault();
      localStorage.setItem('prompt', textarea.value);
      window.location.href = 'create';
    }
  });
  if (button) {
    button.addEventListener('click', () => {
      const prompt = textarea.value.trim();
      if (!prompt) {
        alert('Please enter a prompt before submitting.');
        return;
      }
      localStorage.setItem('prompt', prompt);
      window.location.href = 'create';
    });
  }
});
