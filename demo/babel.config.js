module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ["prismjs", {
        "languages": ["javascript", "css", "markup", "java"],
        "plugins": ["line-numbers"],
        "theme": "okaidia",
        "css": true
    }]
  ]
}
