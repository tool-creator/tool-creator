document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.main-text-area');
  if (!textarea) return;

  textarea.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const value = textarea.value.trim();
      if (!value) return;

      try {
        const res = await fetch('/api/validate-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: value }),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.error);
          return;
        }

        localStorage.setItem('prompt', value);
        window.location.href = 'create';
      } catch {
        alert('Server error.');
      }
    }
  });
});
