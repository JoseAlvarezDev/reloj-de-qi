# ☯️ Reloj de Qi - Alexa Skill

<div align="center">

![Logo](assets/reloj-qi-512.png)

[![Alexa Skill](https://img.shields.io/badge/Alexa-Skill-00CAFF?style=for-the-badge&logo=amazon-alexa&logoColor=white)](https://www.amazon.com/dp/XXXXX)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/JoseAlvarezDev)

**Tu guía personal del Reloj Orgánico de la Medicina Tradicional China**

[🎯 Características](#-características) •
[🕐 Los 12 Meridianos](#-los-12-meridianos) •
[🗣️ Comandos](#️-comandos-de-voz) •
[🚀 Instalación](#-instalación) •
[📄 Licencia](#-licencia)

</div>

---

## 📖 Descripción

**Reloj de Qi** es una skill de Alexa que te guía a través de los 12 períodos de 2 horas del día según la Medicina Tradicional China. Descubre qué órgano está más activo en cada momento, recibe consejos personalizados, practica Qi Gong y medita para armonizar tu energía vital.

> *"El Qi fluye donde la mente va. Dirige tu atención hacia la sanación."*

---

## ✨ Características

| Función | Descripción |
|---------|-------------|
| 🔮 **Consulta en tiempo real** | Descubre qué meridiano está activo ahora |
| 💡 **Consejos personalizados** | Recomendaciones específicas para cada período |
| 🍵 **Nutrición** | Alimentos recomendados según la hora |
| 🧘 **Qi Gong** | Ejercicios guiados para cada meridiano |
| 🧘‍♀️ **Meditación** | Visualizaciones guiadas con SSML |
| 😴 **Análisis de sueño** | Por qué despiertas a ciertas horas |
| 🌿 **5 Elementos** | Información sobre Madera, Fuego, Tierra, Metal y Agua |
| 🌍 **Zona horaria** | Configurado para España (Europe/Madrid) |

---

## 🕐 Los 12 Meridianos

<div align="center">

| Hora | Órgano | Elemento | Emoción |
|:----:|:------:|:--------:|:-------:|
| 03-05 | 🫁 Pulmón | Metal | Tristeza → Coraje |
| 05-07 | 🟤 Intestino Grueso | Metal | Apego → Liberación |
| 07-09 | 🍚 Estómago | Tierra | Preocupación → Empatía |
| 09-11 | 💛 Bazo | Tierra | Ansiedad → Concentración |
| 11-13 | ❤️ Corazón | Fuego | Excitación → Alegría |
| 13-15 | 🔴 Intestino Delgado | Fuego | Confusión → Claridad |
| 15-17 | 💧 Vejiga | Agua | Miedo → Sabiduría |
| 17-19 | 🫘 Riñón | Agua | Temor → Voluntad |
| 19-21 | 💜 Pericardio | Fuego | Vulnerabilidad → Protección |
| 21-23 | 🔥 Triple Calentador | Fuego | Desorden → Armonía |
| 23-01 | 💚 Vesícula Biliar | Madera | Ira → Decisión |
| 01-03 | 🟢 Hígado | Madera | Frustración → Amabilidad |

</div>

---

## 🗣️ Comandos de Voz

```
"Alexa, abre Reloj de Qi"
```

### Comandos disponibles:

| Comando | Función |
|---------|---------|
| *"¿Qué órgano está activo?"* | Meridiano actual con información detallada |
| *"Dame un consejo"* | Consejo personalizado para el momento |
| *"¿Qué debería comer?"* | Alimentos recomendados |
| *"Dame un ejercicio de Qi Gong"* | Práctica guiada de movimiento |
| *"Guíame en una meditación"* | Meditación con visualización |
| *"Me he despertado ahora"* | Análisis de por qué estás despierto |
| *"Me despierto a las 3am"* | Análisis de patrones de sueño |
| *"Cuéntame sobre el hígado"* | Información de un órgano específico |
| *"Dame una frase de sabiduría"* | Proverbio de medicina china |

---

## 📁 Estructura del Proyecto

```
reloj-de-qi/
├── 📂 lambda/
│   ├── 📄 index.js              # Código principal de la skill
│   ├── 📄 package.json          # Dependencias
│   └── 📂 data/
│       └── 📄 reloj-data.json   # Base de datos de meridianos
├── 📂 models/
│   └── 📄 es-ES.json            # Modelo de interacción (español)
├── 📂 assets/
│   ├── 🖼️ reloj-qi-108.png     # Icono pequeño
│   └── 🖼️ reloj-qi-512.png     # Icono grande
├── 📄 skill.json                # Manifest del skill
├── 📄 Privacy-Policy.html       # Política de privacidad
├── 📄 Terms-of-Use.html         # Términos de uso
├── 📄 legal-styles.css          # Estilos de páginas legales
└── 📄 README.md                 # Este archivo
```

---

## 🚀 Instalación

### Requisitos previos

- Cuenta de [Amazon Developer](https://developer.amazon.com/)
- Node.js 18.x o superior

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JoseAlvarezDev/reloj-de-qi.git
   cd reloj-de-qi
   ```

2. **Instalar dependencias**
   ```bash
   cd lambda
   npm install
   ```

3. **Crear skill en Alexa Console**
   - Ve a [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
   - Crea un nuevo skill "Custom" con "Alexa-hosted (Node.js)"
   - Copia el modelo de `models/es-ES.json` al JSON Editor
   - Copia los archivos de `lambda/` al editor de código

4. **Deploy**
   - Save → Build Model
   - Save → Deploy

---

## 🛠️ Tecnologías

<div align="center">

![Alexa](https://img.shields.io/badge/Amazon_Alexa-00CAFF?style=for-the-badge&logo=amazon-alexa&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)

</div>

---

## 📊 Diagrama de Flujo

```mermaid
graph TD
    A[Usuario abre Reloj de Qi] --> B{¿Qué pregunta?}
    B -->|Órgano activo| C[Obtener hora España]
    B -->|Consejo| D[Buscar consejo aleatorio]
    B -->|Alimentos| E[Listar alimentos del período]
    B -->|Qi Gong| F[Ejercicio guiado con SSML]
    B -->|Meditación| G[Visualización guiada]
    B -->|Desperté ahora| H[Analizar meridiano actual]
    C --> I[Calcular meridiano]
    I --> J[Respuesta personalizada]
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el skill:

1. Fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

<div align="center">

**Jose Alvarez Dev**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JoseAlvarezDev)

</div>

---

<div align="center">

**Que tu Qi fluya en armonía** 🙏

<sub>Hecho con ❤️ y ☯️ en España</sub>

</div>
