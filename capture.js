const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureScreens() {
    console.log('Iniciando captura do site Barbearia...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Configura resolução Full HD
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    
    // Caminho absoluto para o index.html local usando file://
    const filePath = `file:///${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;
    console.log(`Carregando: ${filePath}`);
    
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    // Cria diretório de assets se não existir
    const assetsDir = path.join(__dirname, 'vídeo-assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir);
    }

    console.log('Capturando Tela 1: Hero (Home)...');
    await page.screenshot({ path: path.join(assetsDir, 'home.png'), clip: { x: 0, y: 0, width: 1920, height: 900 } });

    console.log('Capturando Tela 2: Serviços...');
    // Scrolling to forces animations/lazy load
    await page.evaluate(() => { document.getElementById('services').scrollIntoView(); });
    await new Promise(r => setTimeout(r, 1000)); // wait for smooth scroll and CSS animations
    const servicesClip = await page.evaluate(() => {
        const rect = document.getElementById('services').getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });
    await page.screenshot({ path: path.join(assetsDir, 'services.png'), clip: servicesClip });

    console.log('Capturando Tela 3: Agendamento...');
    await page.evaluate(() => { document.getElementById('booking').scrollIntoView(); });
    await new Promise(r => setTimeout(r, 1000));
    const bookingClip = await page.evaluate(() => {
        const rect = document.getElementById('booking').getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });
    await page.screenshot({ path: path.join(assetsDir, 'booking.png'), clip: bookingClip });

    await browser.close();
    console.log('Capturas concluídas com sucesso! Fotos salvas em "vídeo-assets/".');
}

captureScreens().catch(err => {
    console.error('Erro na captura:', err);
});
