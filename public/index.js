document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.main-text-area');
  if (!textarea) return;
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (textarea.value.trim() !== '') {
        const value = textarea.value;
        localStorage.setItem('prompt', value);
        window.location.href = 'create.html';
      }
    }
  });
});
