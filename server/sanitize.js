const sanitizeHtml = require('sanitize-html');
function sanitizeInput(dirtyHtml) {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: false,
    disallowedTags: ['object', 'embed', 'link', 'meta', 'base'],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      '*': [
        'class',
        'id',
        'style',
        'title',
        'name',
        'value',
        'type',
        'placeholder',
        'src',
        'href',
        'alt',
        'width',
        'height',
        'target',
        'rel',
        'controls',
        'autoplay',
        'loop',
        'muted',
        'rows',
        'cols',
        'data-*',
        'aria-*',
      ],
    },
    disallowedAttributes: {
      '*': [/^on/i],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    allowProtocolRelative: false,
    allowIframe: true,
    exclusiveFilter: function (frame) {
      return (
        frame.tag === 'iframe' &&
        frame.attribs.src &&
        !/^https:\/\/(www\.youtube\.com|player\.vimeo\.com|toolai\.us)/.test(
          frame.attribs.src
        )
      );
    },
  });
}
module.exports = { sanitizeInput };
