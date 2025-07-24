import react from '@vitejs/plugin-react'

export default {
  build: {
    sourcemap: true,
  },
  plugins: [ react() ]
}
