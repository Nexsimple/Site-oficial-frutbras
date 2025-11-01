import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080, // Use PORT env var or default to 8080
    strictPort: true, // ← Garante que use a porta especificada
  },
  preview: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080, // Use PORT env var or default to 8080
    strictPort: true, // ← Garante que use a porta especificada
    allowedHosts: ['frutbras.store', 'localhost'] // ← Hosts permitidos
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development', // ← Só gera sourcemap em desenvolvimento
    minify: mode === 'production', // ← Minifica só em produção
  }
}));
