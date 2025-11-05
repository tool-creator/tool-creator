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
        console.log('prompt validated successfully');
        alert(
          "Connor, this should have worked. Next, I'll parse the response from the AI and run the output."
        );
        const response = data.response;
        const generatedCode = response.match(
          /(?<=Code:\s*)(.*?)(?=Explanation for users)/s
        );
        const explanation = response.match(
          /(?<=Explanation for users:\s*)(.*)/s
        );
        if (!generatedCode || !explanation) {
          alert('Failed to parse AI response. Redirecting to home page.');
          window.location.href = '../index.html';
          return;
        }
        const iframe = document.getElementById('ai-code-previewer');
        if (explanation && generatedCode) {
          if (iframe) {
            iframe.srcdoc = generatedCode[0];
          } else {
            console.warn('Iframe not found - please check the ID');
            alert('Iframe not found - please check the ID');
            window.location.href = '../index.html';
            return;
          }
        }
      } else {
        alert(data.error || 'An error occurred while validating the prompt.');
        console.warn('Prompt validation failed:', data.error);
        window.location.href = '../index.html';
        return;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while validating the prompt.');
      window.location.href = '../index.html';
      return;
    });
});
