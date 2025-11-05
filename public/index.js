document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.main-text-area');
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
      window.location.href = 'create';
      localStorage.setItem('prompt', textarea.value);
    }
  });
});
