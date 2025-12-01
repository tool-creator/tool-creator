document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('beforeunload', function () {
    localStorage.removeItem('prompt');
  });
  const prompt = localStorage.getItem('prompt');
  if (!prompt) {
    localStorage.setItem('prompt', 'Make a button that says Hello World.');
    window.location.href = '../index.html';
    return;
  }
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.style.display = 'block';
  }
  let messages = [];
  console.log(`messages array set: ${messages}`);
  function errorMessage(error) {
    let messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble-incoming';
    messageBubble.textContent =
      'Sorry, an error occurred while processing your request.';
    document.getElementById('message-container').appendChild(messageBubble);
    console.error('Error:', error);
    alert('An error occurred while validating the prompt.');
    return;
  }
  const existingCode = document.getElementById('ai-code-previewer').srdoc;
  fetch('/api/validate-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, existingCode }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('fetch has ran. .then block for data entered');
      if (spinner) {
        spinner.style.display = 'none';
      }
      console.log('spinner now hidden');
      if (data.success) {
        console.log('prompt validated successfully');
        messages = [
          { prompt: prompt, role: 'user' },
          { content: data.explanation, role: 'ai' },
        ];
        console.log(
          `messages array updated: 
  ${messages}. 
Message about to be mapped`
        );
        messages.map((message) => {
          let messageBubble = document.createElement('div');
          console.log('createElement() function ran. Created messageBubble.');
          messageBubble.className =
            message.role === 'user'
              ? 'message-bubble-outgoing'
              : 'message-bubble-incoming';
          console.log('css class assigned to messageBubble');
          messageBubble.textContent =
            message.role === 'user' ? message.prompt : message.content;
          console.log('text assinged to messageBubble using textContent().');
          document
            .getElementById('message-container')
            .appendChild(messageBubble);
          console.log('messageBubble appended to message-container.');
        });
        console.log('map() function finnished.');
        const iframe = document.getElementById('ai-code-previewer');
        console.log(
          'const iframe assigned to ai-code-previewer element (the iframe).'
        );
        if (iframe) {
          iframe.srcdoc = data.sanitizedHtml
            .replace(/```html/g, '')
            .replace(/```/g, '');
          console.log('iframe srcdoc updated with sanitized HTML.');
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
  console.log(
    'Adding consts for messaging-text-area messaging-text-area-submit.'
  );
  const submitButton = document.getElementById('messaging-text-area-submit');
  const textArea = document.getElementById('messaging-text-area');
  console.log('submitButton and textArea constants assigned.');
  console.log(
    'submitButton const value:' + submitButton,
    'getElementById() in const submitButton value direct from function:' +
      document.getElementById('messaging-text-area-submit')
  );
  if (submitButton) {
    console.log('submitButton exists. Adding event listener for click event.');
    submitButton.addEventListener('click', () => {
      console.log('Submit button click event detected.');
      if (textArea.value.trim() === '') {
        console.log('Text area is empty. No action taken.');
        return;
      }
      console.log('Submit button clicked. Validating and sending prompt.');
      if (spinner) {
        spinner.style.display = 'block';
        console.log('Spinner exists and is displayed.');
      }
      const followUpPrompt = textArea.value;
      console.log(`Follow-up prompt captured: ${followUpPrompt}`);
      textArea.value = '';
      console.log('TextArea follow up prompt cleared.');
      fetch('/api/validate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: followUpPrompt }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(
            'fetch for follow-up prompt has ran. then() block for data entered'
          );
          if (spinner) {
            spinner.style.display = 'none';
            console.log('Spinner exists and is now hidden.');
          }
          if (data.success) {
            console.log('follow-up prompt validated successfully');
            const iframe = document.getElementById('ai-code-previewer');
            console.log(
              'const iframe assigned to ai-code-previewer element (the iframe).'
            );
            if (iframe) {
              console.log('Iframe exists. Updating srcdoc.');
              iframe.srcdoc = data.sanitizedHtml
                .replace(/```html/g, '')
                .replace(/```/g, '');
              console.log('iframe srcdoc updated with sanitized HTML.');
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
            console.log(`messages array updated: 
  ${messages}. 
Message about to be mapped`);
            messages.map((message) => {
              let messageBubble = document.createElement('div');
              console.log(
                'createElement() function ran. Created messageBubble.'
              );
              messageBubble.className =
                message.role === 'user'
                  ? 'message-bubble-outgoing'
                  : 'message-bubble-incoming';
              console.log('css class assigned to messageBubble');
              messageBubble.textContent =
                message.role === 'user' ? message.prompt : message.content;
              console.log(
                'text assinged to messageBubble using textContent().'
              );
              document
                .getElementById('message-container')
                .appendChild(messageBubble);
              console.log('messageBubble appended to message-container.');
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
            console.log('Spinner exists and is now hidden.');
          }
          errorMessage(error);
        });
    });
  } else {
    console.warn('submitButton doesnt exist.');
  }
});
