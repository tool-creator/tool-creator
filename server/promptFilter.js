const unsafePhrases = [
  'ignore previous instructions',
  'jailbreak',
  'you are now',
  'bypass',
  'disable safety',
  'pretend to be',
  'act as',
  'root access',
]

function isUnsafe(prompt) {
    unsafePhrases.some((phrase) => prompt.toLowerCase().includes(phrase))
}
module.exports = { isUnsafe };