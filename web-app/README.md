# Jaws Co., Ltd. Web Application

This is the official Next.js web application for Jaws Co., Ltd., based on the "Hybrid" design concept.

## 🚀 Getting Started

### 1. Prerequisites
You need **Node.js** installed on your machine.
Check if you have it:
```bash
node --version
```
If not, download it from [nodejs.org](https://nodejs.org/).

### 2. Installation
Navigate to the project folder and install dependencies:
```bash
cd web-app
npm install
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

*   `app/`: Main application code (Pages and Layouts).
    *   `page.js`: Homepage with Video Hero.
    *   `products/`: Product catalog logic.
*   `components/`: Reusable UI components (Navbar, Footer).
*   `data/`: Data sources.
    *   `products.json`: The product database (Auto-generated from scraper).
*   `public/`: Static assets (images, videos).

## 🎥 changing the Video
To replace the stock video on the homepage:
1.  Place your video file (e.g., `factory-tour.mp4`) in the `public/` folder.
2.  Open `app/page.js`.
3.  Change the `<source>` tag:
    ```jsx
    <source src="/factory-tour.mp4" type="video/mp4" />
    ```

## ☁️ Deployment

### GitHub
1.  Initialize Git:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Push to your repository:
    ```bash
    git remote add origin <YOUR_REPO_URL>
    git push -u origin main
    ```

### Vercel (Recommended)
1.  Go to [Vercel.com](https://vercel.com) and sign up.
2.  Import your GitHub repository.
3.  Click **Deploy**. It will automatically detect Next.js.
