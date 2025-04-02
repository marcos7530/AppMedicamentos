# App Medicamentos

Aplicación móvil para consultar precios de medicamentos y generar presupuestos.

## Características

- Búsqueda de medicamentos
- Visualización de precios y coberturas
- Generación de presupuestos en PDF
- Carrito de compras
- Actualización automática de precios

## Requisitos

- Node.js
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo en Android)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar la aplicación:
   ```bash
   npx expo start
   ```

## Generación del APK

Para generar el APK para la Play Store:

1. Instalar EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Iniciar sesión en Expo:
   ```bash
   eas login
   ```

3. Configurar el build:
   ```bash
   eas build:configure
   ```

4. Generar el APK:
   ```bash
   eas build -p android --profile preview
   ```

## Política de Privacidad

Esta aplicación no recopila ni almacena datos personales de los usuarios. Los datos de medicamentos se obtienen de fuentes públicas oficiales.

## Licencia

Este proyecto está bajo la Licencia Marcos Campos. 