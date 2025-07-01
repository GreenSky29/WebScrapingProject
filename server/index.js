const express = require("express");
const puppeteer = require("puppeteer");
const cliProgress = require("cli-progress");
const cors = require("cors");
const app = express();
const db = require("./db");

app.use(cors());

// Endpoint scraping
app.get("/scrape", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
        "--start-maximized",
        "--disable-notifications",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Ganti URL dan selector sesuai kebutuhan (contoh: books.toscrape.com)
    let currentPageUrl = "https://books.toscrape.com/";
    await page.goto(currentPageUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Ambil semua link produk
    const productLinks = await page.$$eval(".product_pod h3 a", (links) =>
      links.map((link) => link.href)
    );

    // Progress bar
    const progressBar = new cliProgress.SingleBar({
      format: `🛒 Produk {bar} {percentage}% | {value}/{total} diproses`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    });

    progressBar.start(productLinks.length, 0);

    const hasil = [];
    for (let i = 0; i < productLinks.length; i++) {
      const url = productLinks[i];
      const detailPage = await browser.newPage();
      await detailPage.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });

      const data = await detailPage.evaluate(() => {
        const namaProduk = document.querySelector("h1")?.innerText || "-";
        const hargaProduk =
          document.querySelector(".price_color")?.innerText || "-";
        const deskripsiProduk =
          document.querySelector("#product_description + p")?.innerText || "-";
        const imgProduk =
          document.querySelector(".item.active img")?.src || "-";
        return { namaProduk, hargaProduk, deskripsiProduk, imgProduk };
      });

      hasil.push(data);
      progressBar.update(i + 1);
      await detailPage.close();
    }

    progressBar.stop();

    // Simpan ke MySQL database dengan error handling
    for (const data of hasil) {
      db.query(
        "INSERT INTO produk (nama, harga, deskripsi, img) VALUES (?, ?, ?, ?)",
        [
          data.namaProduk,
          data.hargaProduk,
          data.deskripsiProduk,
          data.imgProduk,
        ],
        (err) => {
          if (err) {
            console.error("Gagal simpan ke DB:", err.message);
          } else {
            console.log("✅ Data disimpan ke MySQL");
          }
        }
      );
    }

    console.log("✅ Semua data berhasil diambil:", hasil.length, "produk");
    res.json(hasil);
    console.log("|Scraping selesai|");
  } catch (err) {
    console.error("❌ Gagal scraping:", err.message);
    res.status(500).json({ error: "Gagal scraping", detail: err.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser ditutup.");
    }
  }
});

// Endpoint untuk mengambil data dari database
app.get("/products", (req, res) => {
  db.query("SELECT * FROM produk ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data:", err.message);
      return res
        .status(500)
        .json({ error: "Gagal mengambil data", detail: err.message });
    }
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
