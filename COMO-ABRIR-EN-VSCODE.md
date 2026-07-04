# Cómo abrir PedidosFácil en VS Code

## Lo que necesitas instalar (gratis)
1. **Node.js** → https://nodejs.org (descarga la versión LTS)
2. **VS Code** → https://code.visualstudio.com

## Pasos para abrir el proyecto

### 1. Descomprime el archivo ZIP
- Descomprime la carpeta `pedidosfacil` en tu escritorio o donde prefieras

### 2. Abre la carpeta en VS Code
- Abre VS Code
- Ve a Archivo → Abrir carpeta
- Selecciona la carpeta `pedidosfacil`

### 3. Abre la terminal en VS Code
- En VS Code: menú Terminal → Nueva terminal
- O presiona: Ctrl + ` (acento grave)

### 4. Instala las dependencias (solo la primera vez)
Escribe este comando y presiona Enter:
```
npm install
```
Espera 1-2 minutos mientras se instala todo.

### 5. Ejecuta la app
```
npm start
```
Se abrirá automáticamente en tu navegador en: http://localhost:3000

## ¡Listo! Tu app está corriendo.

## Para publicarla gratis en internet
1. Crea cuenta en https://vercel.com con tu cuenta de Google
2. Instala Vercel CLI: `npm install -g vercel`
3. En la terminal escribe: `vercel`
4. Sigue los pasos y obtienes una URL gratis tipo: pedidosfacil.vercel.app

## Si algo no funciona
- Asegúrate de tener Node.js instalado: `node --version`
- Si `npm install` falla, intenta: `npm install --legacy-peer-deps`
