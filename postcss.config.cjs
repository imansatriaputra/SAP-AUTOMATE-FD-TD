// postcss.config.cjs
module.exports = {
  plugins: {
    // wrap Tailwind in its PostCSS bridge
    tailwindcss: {},
    // still need autoprefixer
    autoprefixer: {},
  },
}
