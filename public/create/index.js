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
  let messages = [];
  function errorMessage(error) {
    let messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble-incoming';
    messageBubble.textContent =
      'Sorry, an error occurred while processing your request.';
    document.getElementById('messaging-container').appendChild(messageBubble);
    console.error('Error:', error);
    alert('An error occurred while validating the prompt.');
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
      if (spinner) {
        spinner.style.display = 'none';
      }
      if (data.success) {
        console.log('prompt validated successfully');
        messages = [
          { prompt: prompt, role: 'user' },
          { content: data.explanation, role: 'ai' },
        ];
        messages.map((message) => {
          let messageBubble = document.createElement('div');
          messageBubble.className =
            message.role === 'user'
              ? 'message-bubble-outgoing'
              : 'message-bubble-incoming';
          messageBubble.textContent =
            message.role === 'user' ? message.prompt : message.content;
          document
            .getElementById('messaging-container')
            .appendChild(messageBubble);
        });
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
  const submitButton = document.getElementById('messaging-text-area-submit');
  const textArea = document.getElementById('messaging-text-area');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      if (textArea.value.trim() === '') {
        return;
      }
      console.log('Submit button clicked. Validating and sending prompt.');
      if (spinner) {
        spinner.style.display = 'block';
      }
      const followUpPrompt = textArea.value;
      textArea.value = '';
      fetch('/api/validate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: followUpPrompt }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (spinner) {
            spinner.style.display = 'none';
          }
          if (data.success) {
            const iframe = document.getElementById('ai-code-previewer');
            if (iframe) {
              iframe.srcdoc = data.sanitizedHtml
                .replace(/```html/g, '')
                .replace(/```/g, '');
            } else {
              console.warn('Iframe not found - please check the ID');
              alert('Iframe not found - please check the ID');
              return;
            }
            console.log('follow-up prompt validated successfully');
            messages = [
              ...messages,
              { prompt: followUpPrompt, role: 'user' },
              { content: data.explanation, role: 'ai' },
            ];
            messages.map((message) => {
              let messageBubble = document.createElement('div');
              messageBubble.className =
                message.role === 'user'
                  ? 'message-bubble-outgoing'
                  : 'message-bubble-incoming';
              messageBubble.textContent =
                message.role === 'user' ? message.prompt : message.content;
              document
                .getElementById('messaging-container')
                .appendChild(messageBubble);
            });
          } else {
            alert('The follow-up prompt was not valid. Please try again.');
            console.error('Error:', data.error);
            errorMessage(data.error);
            return;
          }
        })
        .catch((error) => {
          if (spinner) {
            spinner.style.display = 'none';
          }
          errorMessage(error);
        });
    });
  }
});
