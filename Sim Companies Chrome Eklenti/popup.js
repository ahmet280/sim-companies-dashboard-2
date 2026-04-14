const { useState, useCallback, useMemo, useEffect, useRef, createElement: h } = React;
const { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } = Recharts;

const COLORS = ["#00d4a8", "#7c3aed", "#f59e0b", "#ef4444", "#3b82f6", "#10b981"];
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 Dakikalık oyun sınırı

const DARK = {
  page: "#060d14", panel: "#0a1520", panelBorder: "#0d2030",
  header: "#08131e", headerBorder: "#0f2535", tabBar: "#08131e", tabBorder: "#0a2030",
  text: "#e2f1f8", textMuted: "#8ab4f8", textFaint: "#5c7c99", textSub: "#789cbd",
  cardBg: "linear-gradient(135deg,#0c1820,#080f18)", cardLabel: "#88b8d0", cardSub: "#6a90a8",
  tooltipBg: "#0a1520", tooltipBorder: "#00d4a830", tooltipTitle: "#a2d4ea",
  srcCardBg: "#0a0e18", progBg: "#0a1520", tabDisabled: "#3b5a70", tabInactive: "#608a9f",
  gridLine: "#0d2030", axisColor: "#5c7c99",
};
const LIGHT = {
  page: "#f0f4f8", panel: "#ffffff", panelBorder: "#b0c8dc",
  header: "#ffffff", headerBorder: "#a0bcd0", tabBar: "#f8fafc", tabBorder: "#b0c8dc",
  text: "#1a3a50", textMuted: "#4a7090", textFaint: "#7a9ab0", textSub: "#5a8aaa",
  cardBg: "#ffffff", cardLabel: "#5a8aaa", cardSub: "#4a7090",
  tooltipBg: "#ffffff", tooltipBorder: "#00d4a860", tooltipTitle: "#2a6080",
  srcCardBg: "#f0f6fc", progBg: "#d8e8f0", tabDisabled: "#a0c0d8", tabInactive: "#4a7090",
  gridLine: "#d8e8f0", axisColor: "#6a90a8",
};

const T = {
  TR: {
    appSub: "FINANSAL ANALIZ PANELI", refresh: "YENILE", dark: "KOYU", light: "ACIK", langSwitch: "EN",
    loadTitle: "VERiLERi OKU", loading: "Veriler yukleniyor...", loadingSub: "Finansal raporlar cekiliyor",
    loadInfo1: "Sim Companies sekmesini acik tutun ve giris yapin,",
    loadInfo2: "ardından butona tiklayin.",
    errTitle: "Hata", errRetry: "Tekrar Dene",
    errNoTab: "Sim Companies sekmesi bulunamadi. Lutfen simcompanies.com adresini ayri bir sekmede acin.",
    errNoData: "Veri cekilemedi. Lutfen sayfayi yenileyin.",
    t1: "OZET", t2: "BUYUME", t3: "BILANCO", t4: "NAKIT", t5: "VARLIK", t6: "URUN", t7: "SIRKET", t8: "DEPO",
    sDepo: "DEPO DEĞERLEME ANALİZİ", cToplamMal: "TOPLAM MALİYET", cPazarDeg: "PAZAR DEĞERİ", cDegFarki: "DEĞERLEME FARKI",
    wKalite: "KALİTE", wAdet: "ADET", wIscilik: "İŞÇİLİK", wYonetim: "YÖNETİM", wParti: "3. PARTİ", wMalzeme: "MALZEME",
    wBirimMal: "BİRİM MALİYET", wTopMal: "TOPLAM MALİYET", wUrunCesidi: "ÜRÜN ÇEŞİDİ", wTopAdet: "TOPLAM ADET",
    wDepoTablo: "DEPO STOK TABLOSU", wMalDag: "MALİYET DAĞILIMI", wEnPahali: "EN PAHALI ÜRÜN",
    wDepoEmpty: "Depo verisi bulunamadı. CSV endpoint yanıt vermemiş olabilir.",
    wUrun: "ÜRÜN", wEnCokStok: "EN ÇOK STOK", wMalYapisi: "MALİYET YAPISI", wTopDepo: "TOPLAM DEPO DEĞERİ",
    wBirimUsd: "$/birim", wMalBar: "EN PAHALI ÜRÜNLER (TOP 10)",
    t9: "VWAP", vTitle: "VWAP DEĞERLEME ANALİZİ", vTopVA: "TOPLAM VA", vTopMV: "PİYASA DEĞERİ",
    vKarli: "KÂRLI ÜRÜN", vZararli: "ZARARLI ÜRÜN", vBirimMal: "BİRİM MAL.", vVwap: "VWAP",
    vHedef: "HEDEF (%85)", vVaBirim: "VA/BİRİM", vVaTop: "VA TOPLAM", vDurum: "DURUM",
    vKarliTag: "Kârlı", vZararliTag: "Zararlı", vNötr: "Nötr", vToplamVA: "TOPLAM VA",
    vTablo: "VWAP KARŞILAŞTIRMA TABLOSU", vBar: "VA DAĞILIMI (TOP 10)",
    vPie: "KÂRLILIĞA GÖRE DAĞILIM", vEmpty: "VWAP verisi bulunamadı. API yanıt vermemiş olabilir.",
    vAciklama: "VA = (VWAP × %85) − Birim Maliyet",
    sSirket: "SIRKET BUYUME GRAFiGi",
    cSirketDeger: "SIRKET DEGERi", cBasDeger: "BASLANGIC DEGERi", cSirketBuyume: "TOPLAM BUYUME", cEnYuksek: "EN YUKSEK DEGER",
    grSirket: "VARLIK YAPISI ZAMAN iCiNDE",
    lNakit: "Nakit ve Alacaklar", lStok: "Stok", lBina: "Binalar", lPatent: "Patentler",
    lPasif: "Pasif (Yukumlulukler ve Borclar)", lDeger: "Sirket Degeri",
    tblSirket: "SON 10 GUNLUK OZET",
    btn90: "90 GUN", btn180: "180 GUN", btnTum: "TUM ZAMANLAR",
    sGenel: "GENEL PERFORMANS OZETI",
    cToplam: "TOPLAM VARLIK", cGuncel: "guncel", cNakit: "NAKIT", cStok: "STOK", cRank: "RANK",
    cBina: "BINALAR", cPatent: "PATENTLER", cBuyume: "TOPLAM BUYUME", cGunde: "gunde",
    cGunluk: "GUNLUK NET KAR",
    grTrend: "TOPLAM VARLIK TRENDi (SON 30 GUN)", grDegisim: "GUNLUK DEGiSiM (SON 30 GUN)",
    sBilanco: "BILANCO ANALiZi",
    grVarlikNakit: "TOPLAM VARLIK & NAKiT TRENDi", grVarlikDag: "VARLIK DAGiLiMi (GUNCEL)",
    grBinaPatent: "BiNA & PATENT BUYUMESi",
    tblBilanco: "BILANCO TABLOSU (SON 30 GUN)",
    colTarih: "TARiH", colNakit: "NAKiT", colStok: "STOK", colBina: "BiNALAR",
    colPatent: "PATENTLER", colToplam: "TOPLAM", colRank: "RANK",
    sBuyume: "GUNLUK VARLIK DEGiSiMi",
    cArtis: "TOPLAM ARTiS", cArtisAlt: "pozitif gunler toplami",
    cDus: "TOPLAM DUSUS", cDusAlt: "negatif gunler toplami",
    cOrt: "GUNLUK ORTALAMA", cPozitif: "POZiTiF GUN", cBasari: "basari",
    grDegTrend: "GUNLUK DEGiSiM TRENDi (SON 30 GUN)", grKumul: "KUMULATiF BUYUME",
    tblDeg: "GUNLUK DEGiSiM TABLOSU (SON 30 GUN)",
    colDeg: "GUNLUK DEGiSiM", colKumul: "KUMULATiF", colToplamV: "TOPLAM VARLIK",
    sNakit: "NAKiT & LiKiDiTE ANALiZi",
    sCashflow: "GERCEK NAKiT AKiM TABLOSU", cfInflows: "NAKiT GiRiSLERi", cfOutflows: "NAKiT CIKISLARI", cfNet: "NET NAKiT AKISI",
    cfRev: "Satis Geliri", cfCogs: "Satilan Malin Maliyeti", cfWages: "Maaslar", cfAdmin: "Yonetim Gideri", cfAcc: "Muhasebe", cfTrans: "Nakliye", cfRes: "Arastirma (Ar-Ge)", cfBld: "Bina Yatirimlari", cfInt: "Faiz", cfBnd: "Tahvil Islemleri", cfFee: "Market Kesintisi", cfTax: "Vergiler",
    cfFromRetail: "Perakende Geliri", cfCashAllIncome: "Toplam Nakit Geliri", cfCashAllExpenses: "Toplam Nakit Gideri", cfToExchange: "Borsaya Transfer", cfToSuppliers: "Tedarikci Odemeleri", cfForAccounting: "Muhasebe Gideri", cfNet2: "Net Nakit Akisi", cfSalary: "Maaslar", cfMaintenance: "Bakim Gideri", cfUpgrade: "Yukseltme Gideri", cfLoan: "Kredi Geri Odemesi", cfDividend: "Temettu Odemesi", cfRetail: "Perakende Geliri", cfGovernment: "Devlet Siparisi", cfMarketSale: "Market Satisi", cfMarketBuy: "Market Alimi",
    cGNakit: "GUNCEL NAKiT", cGStok: "GUNCEL STOK", cDonem: "DONEM BASI NAKiT", cNBuyume: "NAKiT BUYUMESi",
    grNakitTrend: "NAKiT TRENDi (SON 30 GUN)", grNakitDeg: "GUNLUK NAKiT DEGiSiMi (SON 30 GUN)",
    sVarlik: "STOK & VARLIK ANALiZi",
    cDongusel: "DONGUSEL VARLIK", cDonguselD: "DONGUSEL DISI",
    grStok: "STOK TRENDi (SON 60 GUN)", tblVarlik: "VARLIK YAPISI (SON 30 GUN)",
    colDong: "DONG. VARLIK", colDongD: "DONG.DISI VARLIK",
    sUrun: "URUN GELiR & GiDER ANALiZi",
    cSatis: "TOPLAM SATIS GELiRi", cGider: "TOPLAM GiDER", cNetKar: "NET KAR", cEnIyi: "EN iYi URUN",
    grGunlukSatis: "GUNLUK SATIS GELiRi (SON 30 GUN)",
    grUrunDag: "URUN GELiR DAGiLiMi", grUrunGelir: "URUNE GORE GELiR",
    tblUrun: "URUN BAZLI GELiR TABLOSU", tblKat: "NAKiT HAREKETi KATEGORiLERi",
    colUrun: "URUN", colGelir: "TOPLAM GELiR", colIslem: "iSLEM SAYISI",
    colAdet: "TOPLAM ADET", colCogs: "ORT. COGS", colPay: "GELiR %", colKat: "KATEGORi", colKatT: "TOPLAM",
    colKarMarji: "KAR MARJI %",
    noResults: "Sonuc bulunamadi", emptyGenel: "Veri yuklenemedi",
    colSatis: "SATIS", colCogs: "COGS", colBrutKar: "BRUT KAR",
    grGelirDetay: "GELIR ANALIZI (GERCEK VERI)",
    cSatis: "SATIS GELIRI", cCogs: "COGS", cBrutKar: "BRUT KAR", emptyBilanco: "Bilanco verisi yuklenemedi",
    emptyGelir: "Gelir verisi yuklenemedi", emptyNakit: "Nakit verisi yuklenemedi",
    emptyVarlik: "Varlik verisi yuklenemedi", emptyUrun: "Nakit makbuzu verisi yuklenemedi.",
    katSales: "Satislar", katGovDep: "Devlet Siparis Depozitosu", katGov: "Devlet Siparisleri",
    katFees: "Ucretler", katTax: "Vergiler", katContract: "Kontrat", katMarket: "Market Alimlari",
    katRetail: "Perakende", katTransport: "Nakliye", katSalary: "Maaslar", katDiv: "Temettu",
    katLoan: "Kredi", katInt: "Faiz", katAcc: "Muhasebe", katBuild: "Bina",
    katRes: "Arastirma", katInv: "Yatirim",
    tVeri: "VERI",
    tblMaster: "MASTER VERI TABLOSU",
    vBalance: "Bilanco", vChange: "Gunluk Degisim", vAssets: "Varlik Yapisi", vFull: "Tam Gorünüm",
    colDegChange: "GUNLUK DEGiSiM", colCumul: "KUMULATiF",
    tHedef: "HEDEF",
    sHedef: "BUYUME HEDEFi TAKiBi",
    hedefGir: "Hedef Deger",
    hedefKaydet: "KAYDET",
    hedefSil: "HEDEFi SiL",
    hedefYok: "Henuz bir hedef belirlemediniz. Asagidan hedef girin.",
    hedefMevcut: "MEVCUT DEGER",
    hedefHdf: "HEDEF DEGER",
    hedefKalan: "KALAN",
    hedefTamamlandi: "HEDEF TAMAMLANDI!",
    hedefIlerleme: "iLERLEME",
    hedefGunKaldi: "gun kaldi (tahmini)",
    hedefGunlukOrt: "GUNLUK ORT. ARTIS",
    hedefTrend: "BUYUME TRENDi & HEDEF",
    hedefEkle: "+ YENi HEDEF EKLE",
    hedefTuru: "HEDEF TURU",
    hedefAd: "Hedef Adi (opsiyonel)",
    hedefBaslangic: "Baslangic Degeri",

  },
  EN: {
    appSub: "FINANCIAL ANALYTICS PANEL", refresh: "REFRESH", dark: "DARK", light: "LIGHT", langSwitch: "TR",
    loadTitle: "LOAD DATA", loading: "Loading data...", loadingSub: "Fetching financial reports, please wait",
    loadInfo1: "Keep the Sim Companies tab open and logged in,",
    loadInfo2: "then click the button below.",
    errTitle: "Error", errRetry: "Try Again",
    errNoTab: "Sim Companies tab not found. Please open simcompanies.com in a separate tab and log in.",
    errNoData: "Could not fetch data. Please refresh the page.",
    t1: "OVERVIEW", t2: "GROWTH", t3: "BALANCE", t4: "CASH", t5: "ASSETS", t6: "PRODUCTS", t7: "COMPANY", t8: "WAREHOUSE",
    sDepo: "WAREHOUSE VALUATION ANALYSIS", cToplamMal: "TOTAL COST", cPazarDeg: "MARKET VALUE", cDegFarki: "VALUATION DIFF",
    wKalite: "QUALITY", wAdet: "AMOUNT", wIscilik: "LABOR", wYonetim: "MGMT", wParti: "3RD PARTY", wMalzeme: "MATERIALS",
    wBirimMal: "UNIT COST", wTopMal: "TOTAL COST", wUrunCesidi: "PRODUCT TYPES", wTopAdet: "TOTAL UNITS",
    wDepoTablo: "WAREHOUSE STOCK TABLE", wMalDag: "COST DISTRIBUTION", wEnPahali: "MOST EXPENSIVE",
    wDepoEmpty: "Warehouse data not found. CSV endpoint may not have responded.",
    wUrun: "PRODUCT", wEnCokStok: "HIGHEST STOCK", wMalYapisi: "COST STRUCTURE", wTopDepo: "TOTAL WAREHOUSE VALUE",
    wBirimUsd: "$/unit", wMalBar: "MOST EXPENSIVE ITEMS (TOP 10)",
    t9: "VWAP", vTitle: "VWAP VALUATION ANALYSIS", vTopVA: "TOTAL VA", vTopMV: "MARKET VALUE",
    vKarli: "PROFITABLE", vZararli: "UNPROFITABLE", vBirimMal: "UNIT COST", vVwap: "VWAP",
    vHedef: "TARGET (85%)", vVaBirim: "VA/UNIT", vVaTop: "VA TOTAL", vDurum: "STATUS",
    vKarliTag: "Profit", vZararliTag: "Loss", vNötr: "Neutral", vToplamVA: "TOTAL VA",
    vTablo: "VWAP COMPARISON TABLE", vBar: "VA DISTRIBUTION (TOP 10)",
    vPie: "PROFITABILITY DISTRIBUTION", vEmpty: "VWAP data not found. API may not have responded.",
    vAciklama: "VA = (VWAP × 85%) − Unit Cost",
    sSirket: "COMPANY GROWTH CHART",
    cSirketDeger: "COMPANY VALUE", cBasDeger: "STARTING VALUE", cSirketBuyume: "TOTAL GROWTH", cEnYuksek: "PEAK VALUE",
    grSirket: "ASSET STRUCTURE OVER TIME",
    lNakit: "Cash & Receivables", lStok: "Stock", lBina: "Buildings", lPatent: "Patents",
    lPasif: "Liabilities & Debt", lDeger: "Company Value",
    tblSirket: "LAST 10 DAYS SUMMARY",
    btn90: "90 DAYS", btn180: "180 DAYS", btnTum: "ALL TIME",
    sGenel: "GENERAL PERFORMANCE OVERVIEW",
    cToplam: "TOTAL ASSETS", cGuncel: "current", cNakit: "CASH", cStok: "STOCK", cRank: "RANK",
    cBina: "BUILDINGS", cPatent: "PATENTS", cBuyume: "TOTAL GROWTH", cGunde: "days",
    cGunluk: "DAILY NET PROFIT",
    grTrend: "TOTAL ASSETS TREND (LAST 30 DAYS)", grDegisim: "DAILY CHANGE (LAST 30 DAYS)",
    sBilanco: "BALANCE SHEET ANALYSIS",
    grVarlikNakit: "TOTAL ASSETS & CASH TREND", grVarlikDag: "ASSET DISTRIBUTION (CURRENT)",
    grBinaPatent: "BUILDINGS & PATENTS GROWTH",
    tblBilanco: "BALANCE SHEET (LAST 30 DAYS)",
    colTarih: "DATE", colNakit: "CASH", colStok: "STOCK", colBina: "BUILDINGS",
    colPatent: "PATENTS", colToplam: "TOTAL", colRank: "RANK",
    sBuyume: "DAILY ASSET CHANGE",
    cArtis: "TOTAL INCREASE", cArtisAlt: "sum of positive days",
    cDus: "TOTAL DECREASE", cDusAlt: "sum of negative days",
    cOrt: "DAILY AVERAGE", cPozitif: "POSITIVE DAYS", cBasari: "success",
    grDegTrend: "DAILY CHANGE TREND (LAST 30 DAYS)", grKumul: "CUMULATIVE GROWTH",
    tblDeg: "DAILY CHANGE TABLE (LAST 30 DAYS)",
    colDeg: "DAILY CHANGE", colKumul: "CUMULATIVE", colToplamV: "TOTAL ASSETS",
    sNakit: "CASH & LIQUIDITY ANALYSIS",
    sCashflow: "REAL CASHFLOW STATEMENT", cfInflows: "CASH INFLOWS", cfOutflows: "CASH OUTFLOWS", cfNet: "NET CASHFLOW",
    cfRev: "Revenue", cfCogs: "COGS", cfWages: "Wages", cfAdmin: "Administration", cfAcc: "Accounting", cfTrans: "Transport", cfRes: "Research (R&D)", cfBld: "Buildings", cfInt: "Interest", cfBnd: "Bonds", cfFee: "Market Fee", cfTax: "Taxes",
    cfFromRetail: "From Retail", cfCashAllIncome: "Cash All Income", cfCashAllExpenses: "Cash All Expenses", cfToExchange: "To Exchange", cfToSuppliers: "To Suppliers", cfForAccounting: "For Accounting", cfNet2: "Net Cashflow", cfSalary: "Salaries", cfMaintenance: "Maintenance", cfUpgrade: "Upgrades", cfLoan: "Loan Repayment", cfDividend: "Dividend Payment", cfRetail: "Retail Income", cfGovernment: "Government Order", cfMarketSale: "Market Sale", cfMarketBuy: "Market Purchase",
    cGNakit: "CURRENT CASH", cGStok: "CURRENT STOCK", cDonem: "PERIOD START CASH", cNBuyume: "CASH GROWTH",
    grNakitTrend: "CASH TREND (LAST 30 DAYS)", grNakitDeg: "DAILY CASH CHANGE (LAST 30 DAYS)",
    sVarlik: "STOCK & ASSET ANALYSIS",
    cDongusel: "CURRENT ASSETS", cDonguselD: "NON-CURRENT ASSETS",
    grStok: "STOCK TREND (LAST 60 DAYS)", tblVarlik: "ASSET STRUCTURE (LAST 30 DAYS)",
    colDong: "CURRENT ASSETS", colDongD: "NON-CURRENT",
    sUrun: "PRODUCT REVENUE & EXPENSE ANALYSIS",
    cSatis: "TOTAL SALES REVENUE", cGider: "TOTAL EXPENSES", cNetKar: "NET PROFIT", cEnIyi: "BEST PRODUCT",
    grGunlukSatis: "DAILY SALES REVENUE (LAST 30 DAYS)",
    grUrunDag: "PRODUCT REVENUE DISTRIBUTION", grUrunGelir: "REVENUE BY PRODUCT",
    tblUrun: "PRODUCT REVENUE TABLE", tblKat: "CASH MOVEMENT CATEGORIES",
    colUrun: "PRODUCT", colGelir: "TOTAL REVENUE", colIslem: "TRANSACTIONS",
    colAdet: "TOTAL UNITS", colCogs: "AVG. COGS", colPay: "REVENUE %", colKat: "CATEGORY", colKatT: "TOTAL",
    colKarMarji: "MARGIN %",
    noResults: "No results found", emptyGenel: "Could not load data",
    colSatis: "SALES", colCogs: "COGS", colBrutKar: "GROSS PROFIT",
    grGelirDetay: "INCOME ANALYSIS (REAL DATA)",
    cSatis: "SALES REVENUE", cCogs: "COGS", cBrutKar: "GROSS PROFIT", emptyBilanco: "Balance sheet data unavailable",
    emptyGelir: "Revenue data unavailable", emptyNakit: "Cash data unavailable",
    emptyVarlik: "Asset data unavailable", emptyUrun: "Cash ledger data unavailable.",
    katSales: "Sales", katGovDep: "Government Orders Deposit", katGov: "Government Orders",
    katFees: "Fees", katTax: "Taxes", katContract: "Contract", katMarket: "Market Purchases",
    katRetail: "Retail", katTransport: "Transport", katSalary: "Salaries", katDiv: "Dividend",
    katLoan: "Loan", katInt: "Interest", katAcc: "Accounting", katBuild: "Building",
    katRes: "Research", katInv: "Investment",
    tVeri: "DATA",
    tblMaster: "MASTER DATA TABLE",
    vBalance: "Balance Sheet", vChange: "Daily Change", vAssets: "Asset Structure", vFull: "Full View",
    colDegChange: "DAILY CHANGE", colCumul: "CUMULATIVE",
    tHedef: "GOALS",
    sHedef: "GROWTH GOAL TRACKER",
    hedefGir: "Target Value",
    hedefKaydet: "SAVE",
    hedefSil: "DELETE GOAL",
    hedefYok: "No goal set yet. Enter a target below.",
    hedefMevcut: "CURRENT VALUE",
    hedefHdf: "TARGET VALUE",
    hedefKalan: "REMAINING",
    hedefTamamlandi: "GOAL ACHIEVED!",
    hedefIlerleme: "PROGRESS",
    hedefGunKaldi: "days remaining (est.)",
    hedefGunlukOrt: "DAILY AVG. GROWTH",
    hedefTrend: "GROWTH TREND & TARGET",
    hedefEkle: "+ ADD NEW GOAL",
    hedefTuru: "GOAL TYPE",
    hedefAd: "Goal Name (optional)",
    hedefBaslangic: "Starting Value",

  }
};


// TR → EN ürün adı çeviri haritası
const URUN_EN = {
  "Eldiven": "Gloves", "El Çantası": "Handbag", "Topuklu Ayakkabı": "High Heels",
  "Spor Ayakkabı": "Sneakers", "Kemer": "Belt", "Şapka": "Hat", "Ceket": "Jacket",
  "Pantolon": "Pants", "Gömlek": "Shirt", "Elbise": "Dress", "Çanta": "Bag",
  "Saat": "Watch", "Çorap": "Socks", "Bot": "Boots", "Sandalet": "Sandals",
  "Telefon": "Phone", "Bilgisayar": "Computer", "Tablet": "Tablet", "TV": "TV",
  "Kamera": "Camera", "Kulaklık": "Headphones", "Klavye": "Keyboard",
  "Su": "Water", "Enerji": "Energy", "Tahıl": "Grain", "Sebze": "Vegetables",
  "Meyve": "Fruit", "Bal": "Honey", "Çiçek": "Flowers", "Orman Ürünleri": "Forest Products",
  "Kömür": "Coal", "Petrol": "Oil", "Demir Cevheri": "Iron Ore", "Boksit": "Bauxite",
  "Kireçtaşı": "Limestone", "Kum": "Sand", "Mineral": "Minerals",
  "Cam": "Glass", "Demir": "Iron", "Aluminyum": "Aluminum", "Çelik": "Steel",
  "Çimento": "Cement", "Un": "Flour", "Şeker": "Sugar", "Et": "Meat",
  "Süt": "Milk", "Tereyağı": "Butter", "Odun": "Wood", "Kağıt": "Paper",
  "Kumaş": "Fabric", "Deri": "Leather", "Plastik": "Plastic",
  "Elektronik Bileşenler": "Electronic Components", "Motor": "Engine",
  "Lastik": "Tire", "Boya": "Paint", "Kimyasal": "Chemicals", "İlaç": "Medicine",
  "Gübre": "Fertilizer", "Tarım Makinesi": "Agricultural Machine",
  "Gıda": "Food", "İçecek": "Beverage", "Dizel": "Diesel",
  "Plastik Bileşen": "Plastic Component", "Çelik Kiriş": "Steel Beam",
  "Buldozer": "Bulldozer", "Pencere": "Window", "Alet Takımı": "Tool Set",
  "Kil": "Clay", "Kil Blok": "Clay Block", "Odun Blok": "Wood Block",
  "İnşaat Ekipmanı": "Construction Equipment", "Meyve Suyu": "Fruit Juice",
  "Pasta": "Cake", "Bina Malz.": "Building Mat.",
};
const URUN_TR = Object.fromEntries(Object.entries(URUN_EN).map(([k, v]) => [v, k]));

const DYNAMIC_DICT = { EN: {}, TR: {} };

// Function to translate product names
// Priority: static dict → URUN_KIND (game DB, tr + tr2 alias) → auto-translated cache → original
function urunCevir(ad, lang) {
  if (!ad) return ad;
  if (lang === "EN") {
    if (URUN_EN[ad]) return URUN_EN[ad];
    if (DYNAMIC_DICT.EN[ad]) return DYNAMIC_DICT.EN[ad];
    // URUN_KIND: TR ad veya TR alias (tr2) ile ara
    const found = Object.values(URUN_KIND).find(u =>
      u.tr === ad || u.tr?.toLowerCase() === ad.toLowerCase() ||
      u.tr2 === ad || u.tr2?.toLowerCase() === ad.toLowerCase()
    );
    if (found?.name) return found.name;
    return ad;
  }
  if (lang === "TR") {
    if (URUN_TR[ad]) return URUN_TR[ad];
    if (DYNAMIC_DICT.TR[ad]) return DYNAMIC_DICT.TR[ad];
    // URUN_KIND: EN ad ile ara
    const found = Object.values(URUN_KIND).find(u =>
      u.name === ad || u.name?.toLowerCase() === ad.toLowerCase()
    );
    if (found?.tr) return found.tr;
    return ad;
  }
  return ad;
}

// Function to translate category names, with dynamic lookup
function katName(cat, L, lang) {
  if (!cat) return "";
  const lowerCat = cat.toLowerCase();
  const m = {
    "sales": L.katSales, "government orders deposit": L.katGovDep, "government orders": L.katGov,
    "fees": L.katFees, "taxes": L.katTax, "contract": L.katContract, "market": L.katMarket,
    "retail": L.katRetail, "transport": L.katTransport, "salary": L.katSalary, "dividend": L.katDiv,
    "loan": L.katLoan, "interest": L.katInt, "accounting": L.katAcc,
    "building": L.katBuild, "construction": L.katBuild,
    "research": L.katRes, "investment": L.katInv,
    "trading": L.katSales,
    // Turkish CSV category names
    "satışlar": L.katSales, "satislar": L.katSales, "perakende": L.katRetail,
    "pazar": L.katMarket, "kontrat": L.katContract, "ticaret": L.katSales,
    "nakliye": L.katTransport, "maaş": L.katSalary, "maas": L.katSalary,
    "vergi": L.katTax, "vergiler": L.katTax, "faiz": L.katInt,
    "temettü": L.katDiv, "temettu": L.katDiv, "kredi": L.katLoan,
    "muhasebe": L.katAcc, "bina": L.katBuild, "araştırma": L.katRes, "arastirma": L.katRes,
    "yatırım": L.katInv, "yatirim": L.katInv, "ücret": L.katFees, "ucret": L.katFees,
    "devlet siparişleri": L.katGov, "devlet siparisleri": L.katGov,
    "devlet sipariş depozitosu": L.katGovDep, "devlet siparis depozitosu": L.katGovDep
  };
  if (m[lowerCat]) return m[lowerCat];
  if (DYNAMIC_DICT[lang] && DYNAMIC_DICT[lang][cat]) return DYNAMIC_DICT[lang][cat];
  return cat;
}

function numFmt(n, compact = false) {
  if (n == null || isNaN(n)) return "—"; n = +n;
  if (compact && Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (compact && Math.abs(n) >= 1e3) return Math.round(n / 1e3) + "K";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(n);
}
function fmtDate(s) { return s ? (s + "").slice(5, 10).replace("-", "/") : ""; }
function pf(x) { return parseFloat(x) || 0; }

function makeStyles(t) {
  return {
    page: { minHeight: "100vh", background: t.page, fontFamily: "'Roboto Condensed',sans-serif", color: t.text },
    panel: { background: t.panel, border: `1px solid ${t.panelBorder}`, borderRadius: 10, padding: 14, marginBottom: 12 },
    sectionTitle: { fontSize: 9, color: t.textMuted, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" },
    th: { padding: "6px 10px", textAlign: "right", color: t.textMuted, fontSize: 9, letterSpacing: 1, fontWeight: 400, whiteSpace: "nowrap", borderBottom: `1px solid ${t.panelBorder}` },
    empty: { textAlign: "center", padding: "60px 20px", color: t.textFaint },
  };
}
function td(color, t) { return { padding: "7px 10px", color: color || t.text, textAlign: "right", fontSize: 11, borderBottom: `1px solid ${t.panelBorder}` }; }

function StatCard({ label, value, sub, color = "#00d4a8", trend, t }) {
  const isDark = t.page === "#060d14";
  const borderColor = isDark ? `${color}40` : `${color}99`;
  const bgColor = isDark ? t.cardBg : `${color}12`;
  const glowColor = isDark ? `${color}15` : `${color}25`;
  return h("div", { style: { background: bgColor, border: `2px solid ${borderColor}`, borderLeft: `4px solid ${color}`, borderRadius: 10, padding: "11px 13px", position: "relative", overflow: "hidden" } },
    h("div", { style: { position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at 100% 0%,${glowColor},transparent 70%)` } }),
    h("div", { style: { fontSize: 9, color: t.cardLabel, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 } }, label),
    h("div", { style: { fontSize: 17, fontWeight: 700, color, letterSpacing: -0.5 } }, value),
    sub && h("div", { style: { fontSize: 9, color: t.cardSub, marginTop: 3 } }, sub),
    trend != null && h("div", { style: { fontSize: 10, marginTop: 3, color: trend >= 0 ? "#00d4a8" : "#ef4444" } }, (trend >= 0 ? "▲" : "▼") + " %" + Math.abs(trend).toFixed(1))
  );
}

function TT({ active, payload, label, t }) {
  if (!active || !payload?.length) return null;
  return h("div", { style: { background: t.tooltipBg, border: `1px solid ${t.tooltipBorder}`, borderRadius: 8, padding: "8px 12px" } },
    h("div", { style: { color: t.tooltipTitle, fontSize: 10, marginBottom: 4 } }, label),
    ...payload.map((p, i) => h("div", { key: i, style: { color: p.color || "#00d4a8", fontSize: 11 } }, p.name + ": " + numFmt(p.value)))
  );
}

function LoadScreen({ status, onFetch, error, t, styles, L }) {
  const isDark = t.page === "#060d14";

  React.useEffect(() => {
    if (document.getElementById("ls-anim")) return;
    const s = document.createElement("style");
    s.id = "ls-anim";
    s.textContent = [
      "@keyframes ls-ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.6);opacity:0}}",
      "@keyframes ls-ring2{0%{transform:scale(.6);opacity:.5}100%{transform:scale(3.2);opacity:0}}",
      "@keyframes ls-pulse{0%,100%{box-shadow:0 0 16px #00d4a8,0 0 40px #00d4a840}50%{box-shadow:0 0 28px #00d4a8,0 0 60px #00d4a860}}",
      "@keyframes ls-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}",
      "@keyframes ls-spin{to{transform:rotate(360deg)}}",
      "@keyframes ls-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}",
      "@keyframes ls-fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}",
      "@keyframes ls-pill{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}",
    ].join("");
    document.head.appendChild(s);
  }, []);

  // 3D Globe with real world map texture
  const globeRef = useRef(null);
  useEffect(() => {
    const canvas = globeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 280, H = 280;
    canvas.width = W; canvas.height = H;
    const cX = W / 2, cY = H / 2, R = 130;
    const oc = document.createElement("canvas"); oc.width = W; oc.height = H;
    const octx = oc.getContext("2d");
    let rot = 0, animId, texData = null, TW = 0, TH = 0;
    const PI2 = Math.PI * 2;

    // Load real earth texture from CDN
    const earthImg = new Image();
    earthImg.crossOrigin = "anonymous";
    earthImg.onload = function () {
      const tc = document.createElement("canvas");
      TW = earthImg.naturalWidth; TH = earthImg.naturalHeight;
      tc.width = TW; tc.height = TH;
      const tctx = tc.getContext("2d");
      tctx.drawImage(earthImg, 0, 0);
      texData = tctx.getImageData(0, 0, TW, TH).data;
    };
    earthImg.src = "https://cdn.jsdelivr.net/npm/three-globe@2.34.2/example/img/earth-blue-marble.jpg";

    // Fallback polygon texture (used until image loads or if it fails)
    const FW = 360, FH = 180;
    const fc = document.createElement("canvas"); fc.width = FW; fc.height = FH;
    const fctx = fc.getContext("2d");
    fctx.fillStyle = isDark ? "#030a12" : "#b8d8e8";
    fctx.fillRect(0, 0, FW, FH);
    const LAND = [
      [[-130, 52], [-125, 48], [-124, 42], [-118, 34], [-112, 30], [-105, 22], [-98, 18], [-95, 16], [-88, 16], [-84, 10], [-82, 8], [-84, 14], [-88, 18], [-95, 20], [-97, 26], [-95, 30], [-90, 30], [-85, 30], [-82, 25], [-80, 26], [-76, 36], [-74, 40], [-70, 43], [-66, 44], [-64, 47], [-60, 46], [-55, 50], [-60, 55], [-65, 60], [-72, 62], [-80, 64], [-92, 68], [-105, 70], [-120, 72], [-140, 70], [-162, 65], [-168, 60], [-160, 58], [-148, 60], [-138, 58], [-135, 55], [-130, 52]],
      [[-80, 10], [-77, 7], [-72, 10], [-68, 12], [-62, 10], [-55, 5], [-50, 0], [-48, -2], [-36, -8], [-35, -12], [-38, -18], [-42, -23], [-48, -28], [-52, -33], [-58, -40], [-68, -55], [-74, -46], [-72, -38], [-70, -30], [-68, -22], [-75, -10], [-78, -3], [-80, 2], [-80, 10]],
      [[-17, 15], [-12, 5], [5, -2], [10, -5], [12, 0], [25, -3], [33, -10], [38, -22], [35, -28], [30, -34], [25, -30], [18, -26], [12, -6], [30, 0], [42, 5], [50, 12], [44, 12], [43, 25], [35, 32], [32, 37], [10, 37], [0, 35], [-5, 36], [-17, 21], [-17, 15]],
      [[0, 36], [5, 38], [3, 43], [-2, 44], [-10, 42], [-9, 43], [-5, 48], [2, 51], [5, 53], [8, 55], [12, 56], [18, 58], [20, 60], [28, 60], [30, 62], [28, 57], [24, 54], [28, 50], [26, 46], [28, 42], [30, 40], [26, 36], [22, 38], [12, 38], [5, 37], [0, 36]],
      [[30, 40], [35, 38], [40, 38], [50, 30], [55, 27], [60, 25], [70, 20], [75, 14], [78, 8], [80, 12], [85, 22], [92, 20], [100, 5], [104, 1], [108, 16], [115, 22], [120, 30], [124, 35], [128, 38], [130, 43], [132, 36], [140, 36], [141, 42], [144, 46], [142, 50], [135, 52], [120, 55], [110, 52], [100, 52], [85, 50], [72, 55], [60, 58], [48, 55], [42, 48], [40, 42], [32, 40], [30, 40]],
      [[68, 25], [72, 20], [76, 12], [78, 8], [80, 13], [84, 22], [88, 22], [86, 25], [80, 28], [73, 26], [68, 25]],
      [[115, -14], [128, -12], [138, -14], [145, -16], [150, -24], [153, -28], [149, -36], [147, -39], [137, -35], [127, -25], [116, -20], [114, -26], [116, -33], [113, -32], [113, -22], [115, -14]],
      [[-55, 60], [-40, 62], [-18, 72], [-20, 78], [-42, 83], [-56, 78], [-52, 72], [-55, 60]],
      [[-6, 50], [-3, 55], [0, 56], [-2, 58], [-5, 58], [-10, 52], [-6, 50]],
      [[130, 31], [135, 34], [140, 36], [141, 40], [144, 44], [140, 38], [135, 35], [130, 31]],
      [[95, 6], [102, 1], [106, -5], [110, -7], [120, -8], [115, -7], [106, -2], [100, 2], [95, 6]],
      [[5, 58], [10, 60], [14, 68], [20, 70], [28, 66], [30, 62], [28, 60], [25, 58], [15, 56], [10, 58], [5, 58]],
    ];
    fctx.fillStyle = isDark ? "#0a6858" : "#70b870";
    fctx.strokeStyle = isDark ? "rgba(0,212,168,0.5)" : "rgba(0,130,100,0.4)";
    fctx.lineWidth = 1;
    LAND.forEach(p => { fctx.beginPath(); p.forEach(([lo, la], i) => { const x = (lo + 180) / 360 * FW, y = (90 - la) / 180 * FH; i === 0 ? fctx.moveTo(x, y) : fctx.lineTo(x, y); }); fctx.closePath(); fctx.fill(); fctx.stroke(); });
    const fallbackData = fctx.getImageData(0, 0, FW, FH).data;

    // Pre-render star field (once, static - zero perf cost)
    const starCvs = document.createElement("canvas"); starCvs.width = W; starCvs.height = H;
    const sctx = starCvs.getContext("2d");
    const stars = [];
    for (let i = 0; i < 250; i++) {
      const sx = Math.random() * W, sy = Math.random() * H;
      const dx = sx - cX, dy = sy - cY;
      if (dx * dx + dy * dy < (R + 8) * (R + 8)) continue; // skip inside globe
      const size = Math.random() * 1.8 + 0.3;
      const brightness = Math.random() * 0.6 + 0.4;
      const twinkle = Math.random() < 0.15; // some stars twinkle
      stars.push({ x: sx, y: sy, size, brightness, twinkle });
    }
    // Draw static stars
    stars.filter(s => !s.twinkle).forEach(s => {
      sctx.fillStyle = isDark
        ? `rgba(${180 + Math.random() * 75}, ${220 + Math.random() * 35}, ${235 + Math.random() * 20}, ${s.brightness})`
        : `rgba(${100 + Math.random() * 50}, ${140 + Math.random() * 40}, ${180 + Math.random() * 30}, ${s.brightness * 0.5})`;
      sctx.beginPath(); sctx.arc(s.x, s.y, s.size, 0, PI2); sctx.fill();
    });

    function draw() {
      const useTex = texData && TW > 0;
      const tw = useTex ? TW : FW, th = useTex ? TH : FH;
      const td = useTex ? texData : fallbackData;
      const img = octx.createImageData(W, H); const d = img.data;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const dx = x - cX, dy = y - cY, d2 = dx * dx + dy * dy;
        if (d2 >= R * R) continue;
        const z = Math.sqrt(R * R - d2);
        let lon = Math.atan2(dx, z) + rot;
        const lat = Math.asin(-dy / R);
        lon = ((lon % PI2) + PI2) % PI2;
        const tx = Math.floor(lon / PI2 * tw) % tw;
        const ty = Math.max(0, Math.min(th - 1, Math.floor((0.5 - lat / Math.PI) * th)));
        const ti = (ty * tw + tx) * 4;
        const nz = z / R, light = 0.3 + 0.7 * nz;
        const pi = (y * W + x) * 4;
        if (useTex) {
          // Real texture: detect land vs ocean by color
          const r = td[ti], g = td[ti + 1], b = td[ti + 2];
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          // Ocean = blue dominant, Land = green/brown dominant
          const isLand = (r + g) > b * 1.1 && brightness > 0.1;
          if (isLand) {
            const b2 = Math.min(1, brightness * 1.4);
            d[pi] = Math.floor((5 + b2 * 25) * light);
            d[pi + 1] = Math.floor((15 + b2 * 190) * light);
            d[pi + 2] = Math.floor((12 + b2 * 145) * light);
          } else {
            d[pi] = Math.floor(2 * light);
            d[pi + 1] = Math.floor(5 * light);
            d[pi + 2] = Math.floor(10 * light);
          }
        } else {
          d[pi] = Math.floor(td[ti] * light); d[pi + 1] = Math.floor(td[ti + 1] * light); d[pi + 2] = Math.floor(td[ti + 2] * light);
        }
        d[pi + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // Draw stars behind globe
      ctx.drawImage(starCvs, 0, 0);
      // Draw twinkling stars
      const time = Date.now() * 0.003;
      stars.filter(s => s.twinkle).forEach(s => {
        const alpha = s.brightness * (0.4 + 0.6 * Math.abs(Math.sin(time + s.x * 0.1)));
        ctx.fillStyle = isDark ? `rgba(200,240,255,${alpha})` : `rgba(120,160,200,${alpha * 0.5})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, PI2); ctx.fill();
      });
      // Draw globe on top
      ctx.drawImage(oc, 0, 0);
      const atm = ctx.createRadialGradient(cX, cY, R * 0.9, cX, cY, R * 1.15);
      atm.addColorStop(0, isDark ? "rgba(0,212,168,0.15)" : "rgba(0,130,100,0.12)");
      atm.addColorStop(0.5, isDark ? "rgba(0,212,168,0.05)" : "rgba(0,130,100,0.04)");
      atm.addColorStop(1, "transparent");
      ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(cX, cY, R * 1.15, 0, PI2); ctx.fill();
      ctx.strokeStyle = isDark ? "rgba(0,212,168,0.2)" : "rgba(0,130,100,0.25)";
      ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cX, cY, R, 0, PI2); ctx.stroke();
      rot += 0.003; animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [isDark]);

  const bg = isDark
    ? "radial-gradient(ellipse at 50% 10%, #0c2035 0%, #060d14 65%)"
    : "radial-gradient(ellipse at 50% 10%, #d8eeff 0%, #f0f4f8 65%)";

  const dotGrid = `radial-gradient(circle, ${isDark ? "#00d4a80d" : "#0088aa14"} 1px, transparent 1px)`;

  return h("div", {
    style: {
      background: bg, minHeight: 580, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "30px 24px",
      fontFamily: "'Roboto Condensed',sans-serif",
    }
  },

    // Dot-grid overlay
    h("div", {
      style: {
        position: "absolute", inset: 0,
        backgroundImage: dotGrid, backgroundSize: "26px 26px",
        pointerEvents: "none",
      }
    }),

    // Expanding ring 1
    h("div", {
      style: {
        position: "absolute", width: 240, height: 240, borderRadius: "50%",
        border: `1px solid ${isDark ? "#00d4a825" : "#00aacc30"}`,
        animation: "ls-ring 3.2s ease-out infinite",
        pointerEvents: "none",
      }
    }),

    // Expanding ring 2 (delayed)
    h("div", {
      style: {
        position: "absolute", width: 240, height: 240, borderRadius: "50%",
        border: `1px solid ${isDark ? "#00d4a818" : "#00aacc20"}`,
        animation: "ls-ring2 3.2s ease-out 1.4s infinite",
        pointerEvents: "none",
      }
    }),

    // Corner accent top-left
    h("div", {
      style: {
        position: "absolute", top: 20, left: 20, width: 60, height: 60,
        borderTop: `2px solid ${isDark ? "#00d4a830" : "#00aacc40"}`,
        borderLeft: `2px solid ${isDark ? "#00d4a830" : "#00aacc40"}`,
        borderRadius: "4px 0 0 0", pointerEvents: "none",
      }
    }),

    // Corner accent bottom-right
    h("div", {
      style: {
        position: "absolute", bottom: 20, right: 20, width: 60, height: 60,
        borderBottom: `2px solid ${isDark ? "#00d4a830" : "#00aacc40"}`,
        borderRight: `2px solid ${isDark ? "#00d4a830" : "#00aacc40"}`,
        borderRadius: "0 0 4px 0", pointerEvents: "none",
      }
    }),

    // 3D Globe canvas (background)
    h("canvas", {
      ref: globeRef,
      style: {
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 460, height: 460,
        opacity: 0.6, pointerEvents: "none",
      }
    }),

    // ── MAIN CONTENT ──
    h("div", { style: { position: "relative", zIndex: 1, textAlign: "center", animation: "ls-fadein .6s ease both" } },

      // Animated glow dot
      h("div", {
        style: {
          width: 18, height: 18, background: "#00d4a8", borderRadius: "50%",
          margin: "0 auto 22px",
          animation: "ls-pulse 2.2s ease-in-out infinite, ls-float 4s ease-in-out infinite",
        }
      }),

      // Title - shimmer gradient text effect using bg-clip trick via span
      h("div", {
        style: {
          fontSize: 28, fontWeight: 900, letterSpacing: 5, marginBottom: 7,
          background: "linear-gradient(90deg,#00d4a8,#10b981,#38bdf8,#00d4a8)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "ls-shimmer 3.5s linear infinite",
        }
      }, "SIM COMPANIES"),

      // Subtitle
      h("div", {
        style: {
          fontSize: 9, letterSpacing: 3.5, marginBottom: 10,
          color: isDark ? "#2e5a72" : "#6a90a8", textTransform: "uppercase",
        }
      }, L.appSub),

      // Version pill
      h("div", {
        style: {
          display: "inline-block", marginBottom: 32,
          background: isDark ? "#0a1a28" : "#ddeef8",
          border: `1px solid ${isDark ? "#0d2535" : "#a8cce0"}`,
          borderRadius: 20, padding: "3px 12px",
          fontSize: 9, letterSpacing: 2,
          color: isDark ? "#3a6a85" : "#4a7090",
        }
      }, "v 1.2.0"),

      // ── IDLE STATE ──
      status === "idle" && h("div", null,



        // Instructions
        h("div", {
          style: {
            fontSize: 11, color: isDark ? "#3a6080" : "#708090",
            marginBottom: 24, lineHeight: 2, letterSpacing: .3,
          }
        }, L.loadInfo1, h("br"), L.loadInfo2),

        // Load button
        h("button", {
          onClick: onFetch,
          onMouseEnter: e => {
            e.currentTarget.style.boxShadow = "0 0 32px #00d4a840,inset 0 1px 0 #00d4a840";
            e.currentTarget.style.transform = "translateY(-2px)";
          },
          onMouseLeave: e => {
            e.currentTarget.style.boxShadow = "0 0 20px #00d4a820,inset 0 1px 0 #00d4a825";
            e.currentTarget.style.transform = "translateY(0)";
          },
          style: {
            background: isDark
              ? "linear-gradient(135deg,#002a1e,#003d2a,#002a1e)"
              : "linear-gradient(135deg,#e0f8f0,#c0eed8)",
            border: `1px solid ${isDark ? "#00d4a855" : "#00aa8870"}`,
            borderRadius: 12, color: "#00d4a8",
            cursor: "pointer", fontSize: 13, fontWeight: 700,
            padding: "14px 40px", letterSpacing: 2,
            fontFamily: "'Roboto Condensed',sans-serif",
            boxShadow: "0 0 20px #00d4a820,inset 0 1px 0 #00d4a825",
            transition: "all .25s ease",
          }
        }, "▶  " + L.loadTitle + "  →")
      ),

      // ── LOADING STATE ──
      status === "loading" && h("div", { style: { animation: "ls-fadein .4s ease both" } },
        // Spinner ring
        h("div", {
          style: {
            width: 44, height: 44, margin: "0 auto 18px",
            border: `2px solid ${isDark ? "#0d2535" : "#c8e0ee"}`,
            borderTop: "2px solid #00d4a8",
            borderRadius: "50%",
            animation: "ls-spin .85s linear infinite",
          }
        }),
        h("div", { style: { fontSize: 13, color: "#00d4a8", fontWeight: 700, letterSpacing: 1, marginBottom: 8 } }, L.loading),
        h("div", { style: { fontSize: 10, color: isDark ? "#3a6080" : "#6a90a8", letterSpacing: .5 } }, L.loadingSub)
      ),

      // ── ERROR STATE ──
      error && h("div", {
        style: {
          background: isDark ? "#150808" : "#fff0f0",
          border: "1px solid #ef444455",
          borderRadius: 12, padding: "22px 28px",
          maxWidth: 400, textAlign: "center", marginTop: 20,
          animation: "ls-fadein .4s ease both",
        }
      },
        h("div", { style: { fontSize: 24, marginBottom: 10 } }, "⚠"),
        h("div", { style: { color: "#ef4444", fontSize: 12, marginBottom: 10, fontWeight: 700, letterSpacing: 1 } }, L.errTitle),
        h("div", { style: { color: isDark ? "#6a90a8" : "#8aaab8", fontSize: 10, lineHeight: 1.9, marginBottom: 18, whiteSpace: "pre-line" } }, error),
        h("button", {
          onClick: onFetch, style: {
            background: "none", border: "1px solid #ef444455", borderRadius: 8,
            color: "#ef4444", cursor: "pointer", fontSize: 10,
            padding: "9px 22px", fontFamily: "'Roboto Condensed',sans-serif",
            letterSpacing: 1,
          }
        }, "↻  " + L.errRetry)
      )
    )
  );
}


function OzetPage({ bilancoData, gelirData, t, styles, L }) {
  if (!bilancoData.length) return h("div", { style: styles.empty }, L.emptyGenel);
  const son = bilancoData[bilancoData.length - 1], ilk = bilancoData[0];
  const prev = bilancoData.length > 1 ? bilancoData[bilancoData.length - 2] : null;
  const buyume = ilk.total > 0 ? (son.total - ilk.total) / ilk.total * 100 : 0;
  const nakitDeg = prev ? son.nakit - prev.nakit : 0;
  const Tt = (p) => h(TT, { ...p, t });
  const son30 = bilancoData.slice(-30);
  return h("div", null,
    h("div", { style: styles.sectionTitle }, L.sGenel),
    h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } },
      h(StatCard, { label: L.cToplam, value: numFmt(son.total, true), sub: L.cGuncel, color: "#00d4a8", t }),
      h(StatCard, { label: L.cNakit, value: numFmt(son.nakit, true), sub: (nakitDeg >= 0 ? "▲ " : "▼ ") + numFmt(Math.abs(nakitDeg), true), color: "#10b981", t }),
      h(StatCard, { label: L.cStok, value: numFmt(son.stok, true), color: "#f59e0b", t }),
      h(StatCard, { label: L.cRank, value: "#" + numFmt(son.rank), color: "#7c3aed", t }),
      h(StatCard, { label: L.cBina, value: numFmt(son.binalar, true), color: "#3b82f6", t }),
      h(StatCard, { label: L.cPatent, value: numFmt(son.patentler, true), color: "#7c3aed", t }),
      h(StatCard, { label: L.cBuyume, value: "%" + buyume.toFixed(1), sub: bilancoData.length + " " + L.cGunde, color: buyume >= 0 ? "#00d4a8" : "#ef4444", t }),
      gelirData.length > 0 && h(StatCard, { label: L.cGunluk, value: numFmt(gelirData[gelirData.length - 1]?.net, true), color: "#00d4a8", t })
    ),
    h("div", { style: styles.panel },
      h("div", { style: styles.sectionTitle }, L.grTrend),
      h(ResponsiveContainer, { width: "100%", height: 155 },
        h(AreaChart, { data: son30, margin: { top: 5, right: 5, left: 0, bottom: 5 } },
          h("defs", null, h("linearGradient", { id: "ag", x1: "0", y1: "0", x2: "0", y2: "1" }, h("stop", { offset: "5%", stopColor: "#00d4a8", stopOpacity: 0.2 }), h("stop", { offset: "95%", stopColor: "#00d4a8", stopOpacity: 0 }))),
          h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
          h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
          h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
          h(Tooltip, { content: h(Tt) }),
          h(Area, { type: "monotone", dataKey: "total", name: L.cToplam, stroke: "#00d4a8", fill: "url(#ag)", strokeWidth: 2, dot: false })
        )
      )
    ),
    gelirData.length > 0 && h("div", { style: styles.panel },
      h("div", { style: styles.sectionTitle }, L.grDegisim),
      h(ResponsiveContainer, { width: "100%", height: 155 },
        h(BarChart, { data: gelirData.slice(-30), margin: { top: 5, right: 5, left: 0, bottom: 5 } },
          h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
          h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
          h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
          h(Tooltip, { content: h(Tt) }),
          h(Bar, { dataKey: "net", name: L.colDeg, label: false, children: gelirData.slice(-30).map((e, i) => h(Cell, { key: i, fill: e.net >= 0 ? "#00d4a8" : "#ef4444" })) })
        )
      )
    )
  );
}

function MasterDataPage({ bilancoData, gelirData, t, styles, L }) {
  if (!bilancoData.length) return h("div", { style: styles.empty }, L.emptyBilanco);
  const [view, setView] = React.useState("balance");

  const mergedData = React.useMemo(() => {
    const gelirMap = {};
    gelirData.forEach(g => { gelirMap[g.date] = g; });
    return [...bilancoData].reverse().slice(0, 60).map(b => ({
      ...b,
      net: gelirMap[b.date]?.net ?? null,
      kumulatif: gelirMap[b.date]?.kumulatif ?? null,
    }));
  }, [bilancoData, gelirData]);

  const son = bilancoData[bilancoData.length - 1];
  const Tt = (p) => h(TT, { ...p, t });

  const vBtn = (id, label) => h("button", {
    key: id,
    onClick: () => setView(id),
    style: {
      background: view === id ? "#00d4a815" : "none",
      border: `1px solid ${view === id ? "#00d4a8" : t.panelBorder}`,
      borderRadius: 6, cursor: "pointer", padding: "5px 14px",
      fontSize: 9, letterSpacing: 1,
      color: view === id ? "#00d4a8" : t.textMuted,
      fontFamily: "'Roboto Condensed',sans-serif",
      transition: "all .15s",
    }
  }, label);

  const COLS = {
    date: { key: "date", label: L.colTarih, color: "#4a90b0", fmt: v => v },
    nakit: { key: "nakit", label: L.colNakit, color: "#00d4a8", fmt: v => numFmt(v) },
    stok: { key: "stok", label: L.colStok, color: "#f59e0b", fmt: v => numFmt(v) },
    binalar: { key: "binalar", label: L.colBina, color: "#3b82f6", fmt: v => numFmt(v) },
    patent: { key: "patentler", label: L.colPatent, color: "#7c3aed", fmt: v => numFmt(v) },
    total: { key: "total", label: L.colToplam, color: "#00d4a8", fmt: v => numFmt(v), bold: true },
    rank: { key: "rank", label: L.colRank, color: "#94a3b8", fmt: v => "#" + numFmt(v) },
    net: { key: "net", label: L.colDegChange, color: "#10b981", fmt: v => v == null ? "—" : numFmt(v), dynamic: true },
    kumul: { key: "kumulatif", label: L.colCumul, color: "#06b6d4", fmt: v => v == null ? "—" : numFmt(v) },
    curA: { key: "currentAssets", label: L.colDong, color: "#f97316", fmt: v => numFmt(v) },
    nonCurA: { key: "nonCurrentAssets", label: L.colDongD, color: "#ec4899", fmt: v => numFmt(v) },
  };

  const viewCols = {
    balance: ["date", "nakit", "stok", "binalar", "patent", "total", "rank"],
    change: ["date", "net", "kumul", "total"],
    assets: ["date", "nakit", "stok", "curA", "nonCurA", "total"],
    full: ["date", "nakit", "stok", "total", "rank", "net", "kumul"],
  };
  const activeCols = viewCols[view].map(k => COLS[k]);

  const ChartSection = () => {
    if (view === "balance") return h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } },
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.grVarlikNakit),
        h(ResponsiveContainer, { width: "100%", height: 150 },
          h(LineChart, { data: bilancoData.slice(-60), margin: { top: 5, right: 5, left: 0, bottom: 5 } },
            h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
            h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
            h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
            h(Tooltip, { content: h(Tt) }),
            h(Line, { type: "monotone", dataKey: "total", name: L.cToplam, stroke: "#00d4a8", strokeWidth: 2, dot: false }),
            h(Line, { type: "monotone", dataKey: "nakit", name: L.cNakit, stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4", dot: false })
          )
        )
      ),
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.grVarlikDag),
        h(ResponsiveContainer, { width: "100%", height: 130 },
          h(PieChart, { margin: { top: 5, right: 5, left: 5, bottom: 5 } },
            h(Pie, {
              data: [
                { name: L.cNakit, value: son.nakit }, { name: L.cStok, value: son.stok },
                { name: L.cBina, value: son.binalar }, { name: L.cPatent, value: son.patentler }
              ].filter(d => d.value > 0), cx: "50%", cy: "50%", innerRadius: 35, outerRadius: 60, dataKey: "value", nameKey: "name"
            },
              ...([son.nakit, son.stok, son.binalar, son.patentler]).filter(v => v > 0).map((_, i) => h(Cell, { key: i, fill: COLORS[i % COLORS.length] }))
            ),
            h(Tooltip, { content: h(Tt) })
          )
        ),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 4 } },
          ...[L.cNakit, L.cStok, L.cBina, L.cPatent].map((name, i) =>
            h("div", { key: i, style: { display: "flex", alignItems: "center", gap: 3 } },
              h("div", { style: { width: 6, height: 6, borderRadius: 1, background: COLORS[i] } }),
              h("span", { style: { fontSize: 8, color: t.textMuted } }, name)
            )
          )
        )
      )
    );

    if (view === "change") return h("div", { style: styles.panel, marginBottom: 12 },
      h("div", { style: styles.sectionTitle }, L.grDegTrend),
      h(ResponsiveContainer, { width: "100%", height: 150 },
        h(BarChart, { data: gelirData.slice(-30), margin: { top: 5, right: 5, left: 0, bottom: 5 } },
          h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
          h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
          h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
          h(Tooltip, { content: h(Tt) }),
          h(Bar, { dataKey: "net", name: L.colDeg }, ...gelirData.slice(-30).map((e, i) => h(Cell, { key: i, fill: e.net >= 0 ? "#00d4a8" : "#ef4444" })))
        )
      )
    );

    if (view === "assets") return h("div", { style: styles.panel, marginBottom: 12 },
      h("div", { style: styles.sectionTitle }, L.grStok),
      h(ResponsiveContainer, { width: "100%", height: 150 },
        h(AreaChart, { data: bilancoData.slice(-60), margin: { top: 5, right: 5, left: 0, bottom: 5 } },
          h("defs", null,
            h("linearGradient", { id: "ug2", x1: "0", y1: "0", x2: "0", y2: "1" }, h("stop", { offset: "5%", stopColor: "#f59e0b", stopOpacity: 0.2 }), h("stop", { offset: "95%", stopColor: "#f59e0b", stopOpacity: 0 })),
            h("linearGradient", { id: "ug3", x1: "0", y1: "0", x2: "0", y2: "1" }, h("stop", { offset: "5%", stopColor: "#00d4a8", stopOpacity: 0.2 }), h("stop", { offset: "95%", stopColor: "#00d4a8", stopOpacity: 0 }))
          ),
          h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
          h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
          h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
          h(Tooltip, { content: h(Tt) }),
          h(Area, { type: "monotone", dataKey: "stok", name: L.cStok, stroke: "#f59e0b", fill: "url(#ug2)", strokeWidth: 2, dot: false }),
          h(Area, { type: "monotone", dataKey: "nakit", name: L.cNakit, stroke: "#00d4a8", fill: "url(#ug3)", strokeWidth: 1, dot: false })
        )
      )
    );

    if (view === "full") return h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } },
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.grVarlikNakit),
        h(ResponsiveContainer, { width: "100%", height: 130 },
          h(LineChart, { data: bilancoData.slice(-60), margin: { top: 5, right: 5, left: 0, bottom: 5 } },
            h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
            h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
            h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
            h(Tooltip, { content: h(Tt) }),
            h(Line, { type: "monotone", dataKey: "total", name: L.cToplam, stroke: "#00d4a8", strokeWidth: 2, dot: false }),
            h(Line, { type: "monotone", dataKey: "nakit", name: L.cNakit, stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4", dot: false })
          )
        )
      ),
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.grDegTrend),
        h(ResponsiveContainer, { width: "100%", height: 130 },
          h(BarChart, { data: gelirData.slice(-30), margin: { top: 5, right: 5, left: 0, bottom: 5 } },
            h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
            h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
            h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
            h(Tooltip, { content: h(Tt) }),
            h(Bar, { dataKey: "net", name: L.colDeg }, ...gelirData.slice(-30).map((e, i) => h(Cell, { key: i, fill: e.net >= 0 ? "#00d4a8" : "#ef4444" })))
          )
        )
      )
    );

    return null;
  };

  return h("div", null,
    h("div", { style: { display: "flex", gap: 8, marginBottom: 14, alignItems: "center" } },
      h("div", { style: { fontSize: 9, color: t.textMuted, letterSpacing: 1, marginRight: 4 } }, L.tblMaster + " →"),
      vBtn("balance", L.vBalance),
      vBtn("change", L.vChange),
      vBtn("assets", L.vAssets),
      vBtn("full", L.vFull),
    ),
    h(ChartSection),
    h("div", { style: styles.panel },
      h("div", { style: { overflowX: "hidden", maxWidth: "100%", width: "100%" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" } },
          h("thead", null,
            h("tr", { style: { background: t.page === "rgb(6,13,20)" || t.page === "#060d14" ? "#0d1e2e" : "#dce8f0" } },
              ...activeCols.map((col, ci) =>
                h("th", {
                  key: col.key, style: {
                    padding: "8px 8px",
                    textAlign: ci === 0 ? "left" : "right",
                    color: col.color || "#94a3b8",
                    fontSize: 9,
                    letterSpacing: 1,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    borderBottom: `2px solid ${col.color || "#94a3b8"}`,
                    borderTop: `2px solid ${col.color || "#94a3b8"}`,
                    borderLeft: `2px solid ${col.color || "#94a3b8"}50`,
                    background: `${col.color || "#94a3b8"}18`,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }
                }, col.label)
              )
            )
          ),
          h("tbody", null,
            ...mergedData.map((row, i) => {
              const isDark = t.page === "#060d14";
              const rowBg = i % 2 === 0
                ? (isDark ? "transparent" : "#f8fbfd")
                : (isDark ? "#ffffff08" : "#eef5fa");
              return h("tr", {
                key: i,
                style: { background: rowBg, transition: "background .1s" },
              },
                ...activeCols.map((col, ci) => {
                  const val = row[col.key];
                  const color = col.dynamic && col.key === "net"
                    ? (val == null ? t.textMuted : val >= 0 ? "#00d4a8" : "#ef4444")
                    : col.color;
                  const isDate = ci === 0;
                  const isTotal = col.bold;
                  const dynColor = col.dynamic
                    ? (val == null ? "#94a3b8" : val >= 0 ? "#10b981" : "#ef4444")
                    : null;
                  const cellColor = isDate ? "#4a90b0" : (dynColor || color || "#94a3b8");
                  const baseColor = col.color || "#94a3b8";
                  const cellBg = `${baseColor}${isDark ? "12" : "0e"}`;
                  return h("td", {
                    key: col.key,
                    style: {
                      padding: "7px 8px",
                      color: cellColor,
                      textAlign: isDate ? "left" : "right",
                      fontSize: isTotal ? 11 : 10,
                      fontWeight: isTotal ? 700 : (isDate ? 500 : 500),
                      borderBottom: `1px solid ${isDark ? "#0d2030" : "#d8e8f2"}`,
                      borderLeft: `2px solid ${baseColor}50`,
                      background: isDate ? "transparent" : cellBg,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      letterSpacing: isDate ? 0.5 : 0,
                    }
                  }, col.fmt(val));
                })
              );
            })
          )
        )
      )
    )
  );
}

function NakitPage({ data, cashflow, ledger, t, styles, L }) {
  if (!data.length) return h("div", { style: styles.empty }, L.emptyNakit);
  const son = data[data.length - 1], ilk = data[0];

  // Ledger(Makbuz) verisi ile Günlük net değişimi birleştirip Harika bir Stacked Datası oluşturuyoruz
  const chartData = useMemo(() => {
    const s30 = data.slice(-30);
    const map = {};
    s30.forEach(d => {
      map[d.date] = { ...d, income: 0, expense: 0, hasLedger: false };
    });

    if (ledger && ledger.length) {
      ledger.forEach(r => {
        const dStr = (r.Timestamp || "").slice(5, 10).replace("-", "/");
        if (map[dStr]) {
          const m = parseFloat(r.Money) || 0;
          // Stacked Bar için geliri pozitif, gideri negatif olarak ayarlıyoruz
          if (m > 0) map[dStr].income += m;
          else map[dStr].expense += m;
          map[dStr].hasLedger = true;
        }
      });
    }

    // Makbuzun yetişmediği (daha eski) günler için mevcut net değeri yedek (fallback) olarak kullanıyoruz
    return s30.map(d => {
      const c = map[d.date];
      if (!c.hasLedger) {
        if (c.nakitDeg > 0) c.income = c.nakitDeg;
        else if (c.nakitDeg < 0) c.expense = c.nakitDeg;
      }
      return c;
    });
  }, [data, ledger]);

  const formatKey = (k) => {
    const m = {
      revenue: L.cfRev,
      cogs: L.cfCogs,
      wages: L.cfWages,
      salary: L.cfSalary,
      admin: L.cfAdmin,
      administration: L.cfAdmin,
      accounting: L.cfAcc,
      transport: L.cfTrans,
      research: L.cfRes,
      buildings: L.cfBld,
      building: L.cfBld,
      interest: L.cfInt,
      bonds: L.cfBnd,
      marketFee: L.cfFee,
      taxes: L.cfTax,
      tax: L.cfTax,
      maintenance: L.cfMaintenance,
      upgrade: L.cfUpgrade,
      loan: L.cfLoan,
      dividend: L.cfDividend,
      fromRetail: L.cfFromRetail,
      cashAllIncome: L.cfCashAllIncome,
      cashAllExpenses: L.cfCashAllExpenses,
      toExchange: L.cfToExchange,
      toSuppliers: L.cfToSuppliers,
      forAccounting: L.cfForAccounting,
      retail: L.cfRetail,
      government: L.cfGovernment,
      marketSale: L.cfMarketSale,
      marketBuy: L.cfMarketBuy,
    };
    return m[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // "cashAllIncome" ve "cashAllExpenses" zaten diğer kalemlerin toplamı — 
  // bunları detay listesine eklersek çift sayım olur, sadece özet için saklıyoruz
  const SUMMARY_KEYS = new Set(['net', 'cashAllIncome', 'cashAllExpenses']);
  const cfEntries = cashflow && typeof cashflow === 'object'
    ? Object.entries(cashflow).filter(([k, v]) => typeof v === 'number' && !SUMMARY_KEYS.has(k) && v !== 0)
    : [];
  const inflows = cfEntries.filter(e => e[1] > 0).sort((a, b) => b[1] - a[1]);
  const outflows = cfEntries.filter(e => e[1] < 0).sort((a, b) => a[1] - b[1]);
  // Toplam: API'nin özet değerini kullan, yoksa kalemlerden hesapla
  const totalInflow = (cashflow?.cashAllIncome > 0 ? cashflow.cashAllIncome : null)
    ?? inflows.reduce((s, [, v]) => s + v, 0);
  const totalOutflow = (cashflow?.cashAllExpenses < 0 ? cashflow.cashAllExpenses : null)
    ?? outflows.reduce((s, [, v]) => s + v, 0);
  const netCF = totalInflow + totalOutflow;

  const renderRow = (id, displayKey, val, color) => {
    return h("tr", { key: id },
      h("td", { style: { padding: "6px 8px", fontSize: 10, color: t.textMuted, borderBottom: `1px solid ${t.panelBorder}40` } }, displayKey),
      h("td", { style: { padding: "6px 8px", fontSize: 11, textAlign: "right", color: color || t.text, fontWeight: 700, borderBottom: `1px solid ${t.panelBorder}40` } }, numFmt(val))
    );
  };

  // Şelale/Karma Grafik İçin Özel Tooltip (İpucu Kutusu)
  const NakitTT = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const inc = payload.find(p => p.dataKey === 'income');
    const exp = payload.find(p => p.dataKey === 'expense');
    const nkt = payload.find(p => p.dataKey === 'nakit');
    const nD = (inc?.value || 0) + (exp?.value || 0); // expense zaten eksi değerde

    return h("div", { style: { background: t.tooltipBg, border: `1px solid ${t.tooltipBorder}`, borderRadius: 8, padding: "10px 14px", minWidth: 180, fontFamily: "'Roboto Condensed',sans-serif", zIndex: 100 } },
      h("div", { style: { color: t.tooltipTitle, fontSize: 10, marginBottom: 6, borderBottom: `1px solid ${t.panelBorder}`, paddingBottom: 4 } }, label),
      inc && inc.value > 0 && h("div", { style: { color: inc.color, fontSize: 10, display: "flex", justifyContent: "space-between", marginBottom: 2 } },
        h("span", null, L.cfInflows || "Giriş"),
        h("span", { style: { fontWeight: 600 } }, "+" + numFmt(inc.value))
      ),
      exp && exp.value < 0 && h("div", { style: { color: exp.color, fontSize: 10, display: "flex", justifyContent: "space-between", marginBottom: 2 } },
        h("span", null, L.cfOutflows || "Çıkış"),
        h("span", { style: { fontWeight: 600 } }, numFmt(exp.value))
      ),
      h("div", { style: { color: nD >= 0 ? "#10b981" : "#ef4444", fontSize: 10, display: "flex", justifyContent: "space-between", marginBottom: 6, paddingBottom: 4, borderBottom: `1px dotted ${t.panelBorder}` } },
        h("span", null, L.colDegChange || "Net Değişim"),
        h("span", { style: { fontWeight: 700 } }, (nD >= 0 ? "+" : "") + numFmt(nD))
      ),
      nkt && h("div", { style: { color: nkt.color, fontSize: 11, display: "flex", justifyContent: "space-between" } },
        h("span", null, L.cGNakit || "Nakit"),
        h("span", { style: { fontWeight: 700 } }, numFmt(nkt.value))
      )
    );
  };

  // Cashflow tarih aralığını API'den dinamik olarak hesapla
  const fmtCFDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
    } catch { return ""; }
  };
  const cfDateFrom = fmtCFDate(cashflow?.dateFrom);
  const cfDateTo = fmtCFDate(cashflow?.date);
  const cfDateRange = cfDateFrom && cfDateTo ? `${cfDateFrom} → ${cfDateTo}` : "";

  return h("div", null,
    h("div", { style: styles.sectionTitle }, L.sNakit),
    h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } },
      h(StatCard, { label: L.cGNakit, value: numFmt(son.nakit, true), color: "#00d4a8", t }),
      h(StatCard, { label: L.cGStok, value: numFmt(son.stok, true), color: "#f59e0b", t }),
      h(StatCard, { label: L.cDonem, value: numFmt(ilk.nakit, true), sub: ilk.date, color: "#3b82f6", t }),
      h(StatCard, { label: L.cNBuyume, value: numFmt(son.nakit - ilk.nakit, true), color: (son.nakit - ilk.nakit) >= 0 ? "#00d4a8" : "#ef4444", t })
    ),
    h("div", { style: { display: "grid", gridTemplateColumns: cfEntries.length > 0 ? "1fr 1.2fr" : "1fr", gap: 14 } },
      cfEntries.length > 0 && h("div", { style: { ...styles.panel, marginBottom: 0 } },
        h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
          h("div", { style: { ...styles.sectionTitle, marginBottom: 0 } }, L.sCashflow),
          cfDateRange && h("div", { style: { fontSize: 9, color: t.textMuted, background: t.page, border: `1px solid ${t.panelBorder}`, borderRadius: 6, padding: "3px 8px", letterSpacing: 0.5, fontFamily: "'Roboto Condensed',sans-serif" } }, cfDateRange)
        ),
        h("div", { style: { overflowX: "auto" } },
          h("table", { style: { width: "100%", borderCollapse: "collapse" } },
            h("tbody", null,
              inflows.length > 0 && h("tr", null, h("td", { colSpan: 2, style: { padding: "8px 8px 4px", fontSize: 9, fontWeight: 700, color: "#10b981", letterSpacing: 1 } }, L.cfInflows)),
              ...inflows.map(([k, v]) => renderRow(k, formatKey(k), v, "#10b981")),

              outflows.length > 0 && h("tr", null, h("td", { colSpan: 2, style: { padding: "12px 8px 4px", fontSize: 9, fontWeight: 700, color: "#ef4444", letterSpacing: 1 } }, L.cfOutflows)),
              ...outflows.map(([k, v]) => renderRow(k, formatKey(k), v, "#ef4444")),

              h("tr", null,
                h("td", { style: { padding: "10px 8px", fontSize: 11, fontWeight: 700, color: t.text, borderTop: `2px solid ${t.panelBorder}` } }, L.cfNet),
                h("td", { style: { padding: "10px 8px", fontSize: 12, fontWeight: 700, textAlign: "right", color: netCF >= 0 ? "#10b981" : "#ef4444", borderTop: `2px solid ${t.panelBorder}` } }, numFmt(netCF))
              )
            )
          )
        )
      ),
      h("div", { style: { ...styles.panel, height: "100%", marginBottom: 0 } },
        h("div", { style: styles.sectionTitle }, L.grNakitDeg),
        h(ResponsiveContainer, { width: "100%", height: cfEntries.length > 0 ? 250 : 155 },
          h(ComposedChart, { data: chartData, margin: { top: 5, right: 5, left: 0, bottom: 5 }, stackOffset: "sign" },
            h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
            h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
            h(YAxis, { yAxisId: "left", tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
            h(YAxis, { yAxisId: "right", orientation: "right", tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
            h(Tooltip, { content: h(NakitTT) }),
            h(Bar, { yAxisId: "left", dataKey: "income", name: L.cfInflows || "Gelir", fill: "#10b981", stackId: "a", radius: [2, 2, 0, 0] }),
            h(Bar, { yAxisId: "left", dataKey: "expense", name: L.cfOutflows || "Gider", fill: "#ef4444", stackId: "a", radius: [0, 0, 2, 2] }),
            h(Line, { yAxisId: "right", type: "monotone", dataKey: "nakit", name: L.cGNakit || "Nakit", stroke: "#3b82f6", strokeWidth: 2, dot: false })
          )
        ),
        h("div", { style: { display: "flex", gap: 12, justifyContent: "center", marginTop: 12 } },
          h("div", { style: { display: "flex", alignItems: "center", gap: 5 } },
            h("div", { style: { width: 12, height: 12, borderRadius: 2, background: "#10b981" } }),
            h("span", { style: { fontSize: 9, color: t.textMuted } }, L.cfInflows || "Gelir")
          ),
          h("div", { style: { display: "flex", alignItems: "center", gap: 5 } },
            h("div", { style: { width: 12, height: 12, borderRadius: 2, background: "#ef4444" } }),
            h("span", { style: { fontSize: 9, color: t.textMuted } }, L.cfOutflows || "Gider")
          ),
          h("div", { style: { display: "flex", alignItems: "center", gap: 5 } },
            h("div", { style: { width: 22, height: 2.5, background: "#3b82f6", borderRadius: 2 } }),
            h("span", { style: { fontSize: 9, color: t.textMuted } }, L.cGNakit || "Toplam Nakit")
          )
        )
      )
    )
  );
}

function UrunPage({ ledger, t, styles, L, lang }) {
  const [ceviriTetikleyici, setCeviriTetikleyici] = React.useState(0);

  // chrome.storage.local'dan kalıcı çeviri cache'ini yükle
  React.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.get(["dynDictEN", "dynDictTR"], (res) => {
        if (res.dynDictEN) Object.assign(DYNAMIC_DICT.EN, res.dynDictEN);
        if (res.dynDictTR) Object.assign(DYNAMIC_DICT.TR, res.dynDictTR);
        setCeviriTetikleyici(p => p + 1);
      });
    }
  }, []);

  const { urunler, kategoriler, gunluk, bilinmeyenler, unknownCategories } = React.useMemo(() => {
    if (!ledger?.length) return { urunler: [], kategoriler: [], gunluk: [], bilinmeyenler: [], unknownCategories: new Set() };
    const uM = {}, kM = {}, gM = {};
    const bilinmeyenKumesi = new Set();
    const unknownCategoriesSet = new Set();

    ledger.forEach(r => {
      const money = parseFloat(r.Money) || 0, cat = r.Category || "", desc = r.Description || "", tarih = (r.Timestamp || "").slice(0, 10);
      const translatedCatName = katName(cat, L, lang);
      if (translatedCatName === cat) {
        unknownCategoriesSet.add(cat);
      }
      kM[translatedCatName] = (kM[translatedCatName] || 0) + money;

      const catLow = cat.toLowerCase();
      const isSale = (catLow === "sales" || catLow === "market" || catLow === "contract" || catLow === "trading" || catLow === "retail" || catLow === "government orders" || catLow === "government orders deposit" || catLow === "government" || catLow === "satışlar" || catLow === "satislar" || catLow === "perakende" || catLow === "pazar" || catLow === "kontrat" || catLow === "ticaret") && money > 0;
      if (isSale) {
        if (!gM[tarih]) gM[tarih] = 0;
        gM[tarih] += money;
        let uaRaw = desc.replace(/\s+sat[ıi][sş]lar[ıi]?$/i, "").replace(/\s+sales?$/i, "").replace(/\s+sati[sş]i?$/i, "").trim() || desc;

        let descQty = 0;
        const qMatch = desc.match(/([\d,.]+)\s*x\s+/i);
        if (qMatch) {
          descQty = parseFloat(qMatch[1].replace(/,/g, ''));
        }

        uaRaw = uaRaw.replace(/^(Market|Pazar|Contract|Kontrat|Sales|Satışlar|Satislar):\s*/i, "").trim();
        uaRaw = uaRaw.replace(/^[\d,.]+\s*x\s+/i, "").trim();
        // TR: "Ramazan Şekeri kontratı COLDEX tarafından imzalandı" → "Ramazan Şekeri"
        uaRaw = uaRaw.replace(/\s+kontra[tı]+\s+.+$/i, "").trim();
        // EN: "Ramadan Sweets contract signed by COLDEX" → "Ramadan Sweets"
        uaRaw = uaRaw.replace(/\s+contract\s+signed\s+by\s+.+$/i, "").trim();
        // TR: "X satışları" → "X"
        uaRaw = uaRaw.replace(/\s+sat[ıi][sş]lar[ıi]?$/i, "").trim();
        // EN: "X sales" → "X"
        uaRaw = uaRaw.replace(/\s+sales?$/i, "").trim();
        // Any remaining "... tarafından ..." → strip from tarafından onwards
        uaRaw = uaRaw.replace(/\s+taraf[ıi]ndan\s+.+$/i, "").trim();
        // Any remaining "... by ..." → strip from " by " onwards
        uaRaw = uaRaw.replace(/\s+by\s+\S+.*/i, "").trim();

        if (!uM[uaRaw]) uM[uaRaw] = { gelir: 0, islem: 0, cogs: 0, adet: 0 };
        uM[uaRaw].gelir += money; uM[uaRaw].islem += 1;

        // bilmeyenler: URUN_KIND lookup'ı da başarısız olanları ekle
        if (lang === "EN" && urunCevir(uaRaw, "EN") === uaRaw) {
          bilinmeyenKumesi.add(uaRaw);
        } else if (lang === "TR" && urunCevir(uaRaw, "TR") === uaRaw) {
          bilinmeyenKumesi.add(uaRaw);
        }

        try {
          const detailsKey = Object.keys(r).find(k => k.toLowerCase().includes("detail") || k.toLowerCase().includes("detay"));
          const raw = detailsKey ? r[detailsKey] : (r.Details || Object.values(r).find(v => typeof v === 'string' && v.includes('{') && v.includes('}')) || "");

          let cl = raw.trim();
          if (cl.startsWith('"') && cl.endsWith('"')) cl = cl.slice(1, -1);
          cl = cl.replace(/""/g, '"').replace(/\\"/g, '"');

          let d = {};
          try {
            d = JSON.parse(cl) || {};
          } catch (err) { }

          const extractNum = (str, keys) => {
            const rx = new RegExp(`(?:""|"|\\\\")?(?:${keys.join('|')})(?:""|"|\\\\")?\\s*:\\s*([\\d.]+)`, 'i');
            const m = str.match(rx);
            return m ? parseFloat(m[1]) : 0;
          };

          let qty = d.amount || d.quantity || d.units || d.qty || d.count || d.sold || d.miktar || d.adet || extractNum(cl, ['amount', 'quantity', 'units', 'qty', 'count', 'sold', 'miktar', 'adet']);
          if (!qty && descQty) {
            qty = descQty;
          }

          let totalCogs = d.cogs || d.cost || d.maliyet || extractNum(cl, ['cogs', 'cost', 'maliyet']);
          let unitCogs = d.unit_cogs || d.unitCogs || d.birim_maliyet || extractNum(cl, ['unit_cogs', 'unitCogs', 'birim_maliyet']);

          if (!totalCogs && unitCogs && qty) {
            totalCogs = unitCogs * qty;
          }
          if (!qty && totalCogs && unitCogs) {
            qty = totalCogs / unitCogs;
          }

          let price = d.price || d.fiyat || extractNum(cl, ['price', 'fiyat']);
          if (!qty && price && money > 0) {
            qty = money / price;
          }

          if (totalCogs) uM[uaRaw].cogs += parseFloat(totalCogs) || 0;
          if (qty) uM[uaRaw].adet += parseFloat(qty) || 0;
        } catch (e) { }
      }
    });

    const urunler = Object.entries(uM).map(([adTR, d]) => {
      const adet = d.adet || 0;
      const ortCogs = adet > 0 ? d.cogs / adet : (d.islem > 0 ? d.cogs / d.islem : 0);
      const birimSatisFiyati = adet > 0 ? d.gelir / adet : 0;
      const birimKar = birimSatisFiyati - ortCogs;
      const brutKar = adet > 0 ? birimKar * adet : (d.gelir - d.cogs);
      const karMarji = birimSatisFiyati > 0 ? (birimKar / birimSatisFiyati) * 100 : 0;

      return {
        adTR, ad: urunCevir(adTR, lang), gelir: d.gelir, islem: d.islem, adet, ortCogs, brutKar, karMarji
      };
    }).filter(u => u.gelir > 0).sort((a, b) => b.gelir - a.gelir);

    const kategoriler = Object.entries(kM).map(([ad, toplam]) => ({ ad, toplam })).sort((a, b) => b.toplam - a.toplam);
    const gunluk = Object.entries(gM).map(([tarih, toplam]) => ({ date: tarih.slice(5).replace("-", "/"), toplam })).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    return { urunler, kategoriler, gunluk, bilinmeyenler: Array.from(bilinmeyenKumesi), unknownCategories: unknownCategoriesSet };
  }, [ledger, L, lang, ceviriTetikleyici]);

  React.useEffect(() => {
    if (bilinmeyenler.length > 0) {
      let iptal = false;
      const cevir = async () => {
        let guncellendi = false;
        for (const kelime of bilinmeyenler) {
          try {
            const targetLang = lang === "EN" ? "en" : "tr";
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(kelime)}`;
            const res = await fetch(url);
            const data = await res.json();
            DYNAMIC_DICT[lang][kelime] = data[0][0][0];
            guncellendi = true;
          } catch (e) {
            DYNAMIC_DICT[lang][kelime] = kelime;
          }
        }
        if (!iptal && guncellendi) {
          // chrome.storage.local'a kaydet (kalıcı)
          if (typeof chrome !== "undefined" && chrome.storage?.local) {
            chrome.storage.local.set({ dynDictEN: DYNAMIC_DICT.EN, dynDictTR: DYNAMIC_DICT.TR });
          }
          setCeviriTetikleyici(prev => prev + 1);
        }
      };
      cevir();
      return () => { iptal = true; };
    }
  }, [bilinmeyenler, lang]);

  React.useEffect(() => {
    if (unknownCategories.size > 0) {
      let iptal = false;
      const cevirCategories = async () => {
        let guncellendi = false;
        for (const category of unknownCategories) {
          const staticTranslated = katName(category, L, lang);
          if (staticTranslated !== category) {
            continue;
          }
          try {
            const targetLang = lang === "EN" ? "en" : "tr";
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(category)}`;
            const res = await fetch(url);
            const data = await res.json();
            DYNAMIC_DICT[lang][category] = data[0][0][0];
            guncellendi = true;
          } catch (e) { DYNAMIC_DICT[lang][category] = category; }
        }
        if (!iptal && guncellendi) setCeviriTetikleyici(prev => prev + 1);
      };
      cevirCategories();
      return () => { iptal = true; };
    }
  }, [unknownCategories, lang, L]);

  if (!ledger?.length) return h("div", { style: styles.empty }, L.emptyUrun);

  const tS = urunler.reduce((s, u) => s + u.gelir, 0);
  const tSToplam = tS;
  const tG = kategoriler.filter(k => k.toplam < 0).reduce((s, k) => s + Math.abs(k.toplam), 0);
  const nK = tSToplam - tG;
  const best = urunler[0];
  const pasta = urunler.slice(0, 5).map(u => ({ name: u.ad, value: Math.round(u.gelir) }));
  const Tt = (p) => h(TT, { ...p, t });

  return h("div", null,
    h("div", { style: styles.sectionTitle }, L.sUrun),
    h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } },
      h(StatCard, { label: L.cSatis, value: numFmt(tS, true), color: "#00d4a8", t }),
      h(StatCard, { label: L.cGider, value: numFmt(tG, true), color: "#ef4444", t }),
      h(StatCard, { label: L.cNetKar, value: numFmt(nK, true), color: nK >= 0 ? "#10b981" : "#ef4444", t }),
      h(StatCard, { label: L.cEnIyi, value: best?.ad || "—", sub: best ? numFmt(best.gelir, true) : "", color: "#f59e0b", t })
    ),

    h("div", { style: styles.panel },
      h("div", { style: styles.sectionTitle }, L.grGunlukSatis),
      h(ResponsiveContainer, { width: "100%", height: 170 },
        h(BarChart, { data: gunluk, margin: { top: 5, right: 5, left: 0, bottom: 5 } },
          h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
          h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
          h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true) }),
          h(Tooltip, { content: h(Tt) }),
          h(Bar, { dataKey: "toplam", name: L.colGelir, fill: "#00d4a8", radius: [4, 4, 0, 0] })
        )
      )
    ),

    pasta.length > 0 && h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 } },
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.grUrunDag),
        h(ResponsiveContainer, { width: "100%", height: 190 },
          h(PieChart, { margin: { top: 5, right: 5, left: 5, bottom: 5 } },
            h(Pie, { data: pasta, cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 82, dataKey: "value", nameKey: "name" },
              ...pasta.map((_, i) => h(Cell, { key: i, fill: COLORS[i % COLORS.length] }))
            ),
            h(Tooltip, { content: h(Tt) })
          )
        )
      ),
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.grUrunGelir),
        (() => {
          const barH = Math.max(190, pasta.length * 36 + 20);
          const maxNameLen = pasta.length ? Math.max(...pasta.map(p => (p.name || "").length)) : 0;
          const yW = Math.min(130, Math.max(80, maxNameLen * 6.5));
          return h(ResponsiveContainer, { width: "100%", height: barH },
            h(BarChart, { data: pasta, layout: "vertical", margin: { top: 4, right: 20, left: 4, bottom: 4 } },
              h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine, horizontal: false }),
              h(XAxis, { type: "number", tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true), axisLine: false, tickLine: false }),
              h(YAxis, {
                type: "category", dataKey: "name",
                tick: { fill: t.axisColor, fontSize: 9, fontFamily: "'Roboto Condensed',sans-serif" },
                width: yW, tickLine: false, axisLine: false,
                tickFormatter: v => v && v.length > 16 ? v.slice(0, 14) + "…" : v
              }),
              h(Tooltip, { content: h(Tt) }),
              h(Bar, { dataKey: "value", name: L.colGelir, radius: [0, 4, 4, 0], barSize: 18 },
                ...pasta.map((_, i) => h(Cell, { key: i, fill: COLORS[i % COLORS.length] }))
              )
            )
          );
        })()
      )
    ),

    h("div", { style: styles.panel },
      h("div", { style: { marginBottom: 12 } },
        h("div", { style: { fontSize: 9, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase" } }, L.tblUrun)
      ),
      h("div", { style: { overflowX: "auto", maxWidth: "100%" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse" } },
          h("thead", null, h("tr", null, ...[L.colUrun, L.colGelir, L.colAdet, L.colCogs, L.colBrutKar, L.colKarMarji, L.colPay].map(x => h("th", { key: x, style: styles.th }, x)))),
          h("tbody", null, ...urunler.map((u, i) =>
            h("tr", { key: i },
              h("td", { style: { ...td(COLORS[i % COLORS.length], t), textAlign: "left", fontWeight: 700 } }, u.ad),
              h("td", { style: { ...td("#00d4a8", t), fontWeight: 700 } }, numFmt(u.gelir)),
              h("td", { style: td(t.text, t) }, numFmt(u.adet)),
              h("td", { style: td("#f59e0b", t) }, u.ortCogs > 0 ? numFmt(u.ortCogs) : "—"),
              h("td", { style: { ...td(u.brutKar >= 0 ? "#10b981" : "#ef4444", t), fontWeight: 700 } }, (u.brutKar >= 0 ? "+$" : "-$") + numFmt(Math.abs(u.brutKar))),
              h("td", { style: td(u.karMarji >= 0 ? "#10b981" : "#ef4444", t) }, u.karMarji !== 0 ? "%" + u.karMarji.toFixed(1) : "—"),
              h("td", { style: td(t.text, t) }, tSToplam > 0 ? "%" + (u.gelir / tSToplam * 100).toFixed(1) : "—")
            )
          ))
        )
      )
    )
  );
}

function HedefPage({ bilancoData, gelirData, t, styles, L, lang }) {
  const [hedefler, setHedefler] = React.useState([]);
  const [yeniHedef, setYeniHedef] = React.useState("");
  const [yeniAd, setYeniAd] = React.useState("");
  const [yeniTip, setYeniTip] = React.useState("sirketDegeri");
  const [form, setForm] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const HEDEF_TURLERI = {
    sirketDegeri: { key: 'sirketDegeri', label: L.cSirketDeger, dataKey: 'total', format: v => '$' + numFmt(v, true), isCurrency: true, lowerIsBetter: false },
    nakit: { key: 'nakit', label: L.cNakit, dataKey: 'nakit', format: v => '$' + numFmt(v, true), isCurrency: true, lowerIsBetter: false },
    binaDegeri: { key: 'binaDegeri', label: L.cBina, dataKey: 'binalar', format: v => '$' + numFmt(v, true), isCurrency: true, lowerIsBetter: false },
    rank: { key: 'rank', label: L.cRank, dataKey: 'rank', format: v => "#" + numFmt(v), isCurrency: false, lowerIsBetter: true },
    gunlukKar: { key: 'gunlukKar', label: L.cGunluk, dataKey: 'gunlukOrt', format: v => '$' + numFmt(v, true), isCurrency: true, lowerIsBetter: false },
  };

  const parseHedefDeger = (str) => {
    if (!str) return 0;
    const s = String(str).toLowerCase().replace(/,/g, "");
    const num = parseFloat(s);
    if (s.includes('b')) return num * 1e9;
    if (s.includes('m')) return num * 1e6;
    if (s.includes('k')) return num * 1e3;
    return num;
  };

  const son = bilancoData.length ? bilancoData[bilancoData.length - 1] : null;

  const gunlukOrt = React.useMemo(() => {
    if (gelirData.length < 7) return 0;
    const son30 = gelirData.slice(-30);
    const pozitif = son30.filter(d => d.net > 0);
    if (!pozitif.length) return 0;
    return pozitif.reduce((s, d) => s + d.net, 0) / son30.length;
  }, [gelirData]);

  const getMevcutDeger = (type) => {
    const tKey = type || 'sirketDegeri';
    if (!son && tKey !== 'gunlukKar') return 0;
    switch (tKey) {
      case 'sirketDegeri': return son.total;
      case 'nakit': return son.nakit;
      case 'binaDegeri': return son.binalar;
      case 'rank': return son.rank;
      case 'gunlukKar': return gunlukOrt;
      default: return son.total;
    }
  };

  React.useEffect(() => {
    try {
      chrome.storage.local.get(["simHedefler"], res => {
        if (res.simHedefler) setHedefler(res.simHedefler);
        setLoaded(true);
      });
    } catch (e) { setLoaded(true); }
  }, []);

  const kaydet = (liste) => {
    setHedefler(liste);
    try { chrome.storage.local.set({ simHedefler: liste }); } catch (e) { }
  };

  const hedefEkle = () => {
    const tur = HEDEF_TURLERI[yeniTip];
    const mevcutDeger = getMevcutDeger(yeniTip);
    const val = parseHedefDeger(yeniHedef);

    if (!val || (tur.lowerIsBetter ? val >= mevcutDeger : val <= mevcutDeger)) return;

    const yeni = {
      id: Date.now(),
      ad: yeniAd.trim() || tur.label,
      type: yeniTip,
      hedef: val,
      baslangic: mevcutDeger,
      baslangicTarih: son?.date || "—",
      olusturma: new Date().toLocaleDateString("tr-TR"),
    };
    kaydet([...hedefler, yeni]);
    setYeniHedef(""); setYeniAd(""); setYeniTip("sirketDegeri"); setForm(false);
  };

  const hedefSil = (id) => kaydet(hedefler.filter(h => h.id !== id));

  const Tt = (p) => h(TT, { ...p, t });
  const isDark = t.page === "#060d14";

  if (!loaded) return h("div", { style: styles.empty }, "...");
  if (!bilancoData.length) return h("div", { style: styles.empty }, L.emptyGenel);

  return h("div", null,
    h("div", { style: styles.sectionTitle }, L.sHedef),

    hedefler.length === 0
      ? h("div", { style: { ...styles.panel, textAlign: "center", color: t.textFaint, padding: "30px 20px", fontSize: 11 } }, L.hedefYok)
      : h("div", null, ...hedefler.map(hdf => {
        const typeKey = hdf.type || 'sirketDegeri';
        const tur = HEDEF_TURLERI[typeKey] || HEDEF_TURLERI.sirketDegeri;
        const mevcutDeger = getMevcutDeger(typeKey);

        let ilerleme;
        if (tur.lowerIsBetter) {
          ilerleme = (hdf.baslangic - mevcutDeger) / (hdf.baslangic - hdf.hedef) * 100;
        } else {
          ilerleme = (mevcutDeger - hdf.baslangic) / (hdf.hedef - hdf.baslangic) * 100;
        }
        ilerleme = Math.min(100, Math.max(0, ilerleme));

        const kalan = tur.lowerIsBetter ? mevcutDeger - hdf.hedef : hdf.hedef - mevcutDeger;
        const tamamlandi = tur.lowerIsBetter ? mevcutDeger <= hdf.hedef : mevcutDeger >= hdf.hedef;

        const gunlukArtis = hdf.type === 'gunlukKar' ? 0 : gunlukOrt;
        const gunKaldi = !tur.lowerIsBetter && gunlukArtis > 0 ? Math.ceil(kalan / gunlukArtis) : null;

        const barColor = tamamlandi ? "#00d4a8" : ilerleme > 66 ? "#10b981" : ilerleme > 33 ? "#f59e0b" : "#3b82f6";

        const trendData = (hdf.type === 'gunlukKar' ? gelirData.slice(-60) : bilancoData.slice(-60)).map(d => ({
          date: d.date,
          value: hdf.type === 'gunlukKar' ? d.net : d[tur.dataKey],
        }));
        const grafik = trendData.map(d => ({ ...d, hedef: hdf.hedef }));

        return h("div", { key: hdf.id, style: { ...styles.panel, marginBottom: 14 } },
          h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
            h("div", null,
              h("div", { style: { fontSize: 12, fontWeight: 700, color: "#00d4a8", letterSpacing: 1 } }, hdf.ad),
              h("div", { style: { fontSize: 9, color: t.textFaint, marginTop: 2 } },
                h("span", { style: { color: t.textSub, fontWeight: 600 } }, tur.label),
                " · " + hdf.olusturma + " · " + L.hedefBaslangic + ": " + tur.format(hdf.baslangic)
              )
            ),
            tamamlandi
              ? h("div", { style: { fontSize: 10, color: "#00d4a8", fontWeight: 700, padding: "4px 10px", border: "1px solid #00d4a840", borderRadius: 20 } }, "✓ " + L.hedefTamamlandi)
              : h("button", { onClick: () => hedefSil(hdf.id), style: { background: "none", border: `1px solid ${isDark ? "#1a3a50" : "#c0d8e8"}`, borderRadius: 6, cursor: "pointer", padding: "4px 10px", fontSize: 9, color: "#ef4444", fontFamily: "'Roboto Condensed',sans-serif" } }, L.hedefSil)
          ),

          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 } },
            h(StatCard, { label: L.hedefMevcut, value: tur.format(mevcutDeger), color: "#00d4a8", t }),
            h(StatCard, { label: L.hedefHdf, value: tur.format(hdf.hedef), color: "#7c3aed", t }),
            tamamlandi
              ? h(StatCard, { label: L.hedefKalan, value: "✓", color: "#00d4a8", t })
              : h(StatCard, {
                label: L.hedefKalan, value: tur.format(kalan), color: "#f59e0b", t,
                sub: gunKaldi != null ? gunKaldi + " " + L.hedefGunKaldi : null
              })
          ),

          h("div", { style: { marginBottom: 14 } },
            h("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 } },
              h("span", { style: { fontSize: 9, color: t.textMuted, letterSpacing: 1 } }, L.hedefIlerleme),
              h("span", { style: { fontSize: 11, fontWeight: 700, color: barColor } }, "%" + ilerleme.toFixed(1))
            ),
            h("div", { style: { height: 14, background: isDark ? "#0a1520" : "#d8eaf6", borderRadius: 8, overflow: "hidden", position: "relative" } },
              h("div", {
                style: {
                  height: "100%",
                  width: ilerleme + "%",
                  background: tamamlandi
                    ? "linear-gradient(90deg,#00d4a8,#10b981)"
                    : ilerleme > 66
                      ? "linear-gradient(90deg,#10b981,#00d4a8)"
                      : ilerleme > 33
                        ? "linear-gradient(90deg,#3b82f6,#f59e0b)"
                        : "linear-gradient(90deg,#1e40af,#3b82f6)",
                  borderRadius: 8,
                  transition: "width 0.8s ease",
                  boxShadow: `0 0 10px ${barColor}60`,
                }
              }),
              ilerleme > 12 && h("div", {
                style: {
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)"
                }
              }, "%" + ilerleme.toFixed(1))
            ),
            h("div", { style: { position: "relative", height: 16, marginTop: 3 } },
              ...[25, 50, 75, 100].map(m =>
                h("div", {
                  key: m, style: {
                    position: "absolute", left: m + "%", transform: "translateX(-50%)",
                    fontSize: 8, color: ilerleme >= m ? barColor : t.textFaint,
                    fontWeight: ilerleme >= m ? 700 : 400,
                  }
                }, m === 100 ? "🏆" : m + "%")
              )
            )
          ),

          gunlukArtis > 0 && !tamamlandi && !tur.lowerIsBetter && h("div", {
            style: {
              background: isDark ? "#0a1520" : "#eef5fa",
              border: `1px solid ${isDark ? "#0d2030" : "#c8dcea"}`,
              borderRadius: 8, padding: "8px 12px", marginBottom: 14,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }
          },
            h("span", { style: { fontSize: 9, color: t.textMuted, letterSpacing: 1 } }, L.hedefGunlukOrt),
            h("span", { style: { fontSize: 12, fontWeight: 700, color: "#10b981" } }, "+" + numFmt(Math.round(gunlukArtis), true) + "/" + (lang === "TR" ? "gün" : "day"))
          ),

          h("div", { style: { marginTop: 4 } },
            h("div", { style: { fontSize: 9, color: t.textMuted, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" } }, L.hedefTrend),
            h(ResponsiveContainer, { width: "100%", height: 160 },
              h(ComposedChart, { data: grafik, margin: { top: 5, right: 10, left: 0, bottom: 5 } },
                h("defs", null,
                  h("linearGradient", { id: "hg" + hdf.id, x1: "0", y1: "0", x2: "0", y2: "1" },
                    h("stop", { offset: "5%", stopColor: "#00d4a8", stopOpacity: 0.25 }),
                    h("stop", { offset: "95%", stopColor: "#00d4a8", stopOpacity: 0 })
                  )
                ),
                h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
                h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 8 } }),
                h(YAxis, { tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true), domain: ["auto", "auto"] }),
                h(Tooltip, { content: h(Tt) }),
                h(Area, { type: "monotone", dataKey: "value", name: tur.label, stroke: "#00d4a8", fill: `url(#hg${hdf.id})`, strokeWidth: 2, dot: false }),
                h(Line, { type: "monotone", dataKey: "hedef", name: L.hedefHdf, stroke: "#7c3aed", strokeWidth: 2, strokeDasharray: "6 3", dot: false })
              )
            )
          )
        );
      })),

    !form
      ? h("button", {
        onClick: () => setForm(true),
        style: {
          display: "block", width: "100%", padding: "11px",
          background: "none",
          border: `2px dashed ${isDark ? "#1a3a50" : "#b0cce0"}`,
          borderRadius: 10, cursor: "pointer",
          fontSize: 10, color: t.textMuted, letterSpacing: 1,
          fontFamily: "'Roboto Condensed',sans-serif",
          transition: "all .2s",
        }
      }, L.hedefEkle)
      : h("div", { style: { ...styles.panel, border: `1px solid #7c3aed40` } },
        h("div", { style: { fontSize: 9, color: "#7c3aed", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" } }, L.hedefEkle.replace("+ ", "")),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 } },
          h("div", null,
            h("div", { style: { fontSize: 9, color: t.textMuted, marginBottom: 4 } }, L.hedefTuru),
            h("select", {
              value: yeniTip,
              onChange: e => setYeniTip(e.target.value),
              style: {
                background: isDark ? "#060d14" : "#f0f6fc",
                border: `1px solid ${isDark ? "#1a3a50" : "#b0cce0"}`,
                borderRadius: 8, padding: "8px 12px", fontSize: 11,
                color: t.text, fontFamily: "'Roboto Condensed',sans-serif", outline: "none", width: "100%"
              }
            }, ...Object.values(HEDEF_TURLERI).map(tur => h("option", { key: tur.key, value: tur.key }, tur.label)))
          ),
          h("div", null,
            h("div", { style: { fontSize: 9, color: t.textMuted, marginBottom: 4 } }, L.hedefAd),
            h("input", {
              type: "text",
              placeholder: L.hedefAd,
              value: yeniAd,
              onInput: e => setYeniAd(e.target.value),
              style: {
                background: isDark ? "#060d14" : "#f0f6fc",
                border: `1px solid ${isDark ? "#1a3a50" : "#b0cce0"}`,
                borderRadius: 8, padding: "8px 12px", fontSize: 11,
                color: t.text, fontFamily: "'Roboto Condensed',sans-serif", outline: "none", width: "100%"
              }
            })
          ),
          h("div", null,
            h("div", { style: { fontSize: 9, color: t.textMuted, marginBottom: 4 } }, L.hedefGir),
            h("input", {
              type: "text",
              placeholder: L.hedefGir + " (örn: 50M, 1B)",
              value: yeniHedef,
              onInput: e => setYeniHedef(e.target.value),
              style: {
                background: isDark ? "#060d14" : "#f0f6fc",
                border: `1px solid ${(HEDEF_TURLERI[yeniTip].lowerIsBetter ? parseHedefDeger(yeniHedef) > 0 && parseHedefDeger(yeniHedef) < getMevcutDeger(yeniTip) : parseHedefDeger(yeniHedef) > getMevcutDeger(yeniTip)) ? "#7c3aed" : "#1a3a50"}`,
                borderRadius: 8, padding: "8px 12px", fontSize: 11,
                color: t.text, fontFamily: "'Roboto Condensed',sans-serif", outline: "none", width: "100%"
              }
            })
          )
        ),
        h("div", { style: { fontSize: 9, color: t.textFaint, marginBottom: 12 } },
          L.hedefMevcut + ": " + HEDEF_TURLERI[yeniTip].format(getMevcutDeger(yeniTip)) + " · " + L.hedefGir + ": " + (parseHedefDeger(yeniHedef) > 0 ? HEDEF_TURLERI[yeniTip].format(parseHedefDeger(yeniHedef)) : "—")
        ),
        h("div", { style: { display: "flex", gap: 8 } },
          h("button", {
            onClick: hedefEkle,
            style: {
              flex: 1, padding: "9px", background: "linear-gradient(90deg,#4c1d95,#7c3aed)",
              border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 10, color: "#fff", fontWeight: 700, letterSpacing: 1,
              fontFamily: "'Roboto Condensed',sans-serif",
              opacity: (HEDEF_TURLERI[yeniTip].lowerIsBetter ? parseHedefDeger(yeniHedef) < getMevcutDeger(yeniTip) : parseHedefDeger(yeniHedef) > getMevcutDeger(yeniTip)) ? 1 : 0.4,
            }
          }, L.hedefKaydet),
          h("button", {
            onClick: () => { setForm(false); setYeniHedef(""); setYeniAd(""); setYeniTip("sirketDegeri"); },
            style: {
              padding: "9px 16px", background: "none",
              border: `1px solid ${isDark ? "#1a3a50" : "#b0cce0"}`,
              borderRadius: 8, cursor: "pointer", fontSize: 10, color: t.textMuted,
              fontFamily: "'Roboto Condensed',sans-serif",
            }
          }, "✕")
        )
      )
  );
}



function SirketPage({ data, t, styles, L }) {
  if (!data.length) return h("div", { style: styles.empty }, L.emptyGenel);
  const son = data[data.length - 1], ilk = data[0];
  const buyume = ilk.total > 0 ? (son.total - ilk.total) / ilk.total * 100 : 0;
  const maxDeger = Math.max(...data.map(d => d.total));
  const maxTarih = data.find(d => d.total === maxDeger)?.date || "";
  const [aralik, setAralik] = React.useState("tum");
  const gosterilen = aralik === "90" ? data.slice(-90) : aralik === "180" ? data.slice(-180) : data;

  const chartData = gosterilen.map(d => ({
    date: d.date,
    [L.lNakit]: Math.max(0, d.nakit),
    [L.lStok]: Math.max(0, d.stok),
    [L.lBina]: Math.max(0, d.binalar),
    [L.lPatent]: Math.max(0, d.patentler),
    [L.lPasif]: d.total - (d.nakit + d.stok + d.binalar + d.patentler) < 0 ? d.total - (d.nakit + d.stok + d.binalar + d.patentler) : 0,
    [L.lDeger]: d.total,
  }));

  const SirketTT = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const items = payload.filter(p => p.value !== 0 && p.dataKey !== L.lDeger);
    const deger = payload.find(p => p.dataKey === L.lDeger);
    return h("div", { style: { background: t.tooltipBg, border: `1px solid ${t.tooltipBorder}`, borderRadius: 8, padding: "10px 14px", minWidth: 200, fontFamily: "'Roboto Condensed',sans-serif" } },
      h("div", { style: { color: t.tooltipTitle, fontSize: 10, marginBottom: 6, borderBottom: `1px solid ${t.panelBorder}`, paddingBottom: 4 } }, label),
      deger && h("div", { style: { fontSize: 11, display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4, padding: "2px 0" } },
        h("span", { style: { color: t.text } }, L.lDeger + ":"),
        h("span", { style: { fontWeight: 700, color: "#00d4a8" } }, numFmt(deger.value, true))
      ),
      ...items.map((p, i) => p.value !== 0 && h("div", { key: i, style: { color: p.color, fontSize: 10, display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 2 } },
        h("span", null, p.dataKey + ":"),
        h("span", { style: { fontWeight: 600 } }, numFmt(Math.abs(p.value), true))
      ))
    );
  };

  const btnAralik = (id, label) => h("button", {
    onClick: () => setAralik(id),
    style: { background: aralik === id ? "#00d4a815" : "none", border: `1px solid ${aralik === id ? "#00d4a8" : t.panelBorder}`, borderRadius: 6, cursor: "pointer", padding: "4px 12px", fontSize: 9, letterSpacing: 1, color: aralik === id ? "#00d4a8" : t.textMuted, fontFamily: "'Roboto Condensed',sans-serif" }
  }, label);

  return h("div", null,
    h("div", { style: styles.sectionTitle }, L.sSirket),
    h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 } },
      h(StatCard, { label: L.cSirketDeger, value: numFmt(son.total, true), color: "#00d4a8", t }),
      h(StatCard, { label: L.cBasDeger, value: numFmt(ilk.total, true), sub: ilk.date, color: "#3b82f6", t }),
      h(StatCard, { label: L.cSirketBuyume, value: "%" + buyume.toFixed(1), sub: data.length + " " + (L.cGunde || "days"), color: buyume >= 0 ? "#00d4a8" : "#ef4444", t }),
      h(StatCard, { label: L.cEnYuksek, value: numFmt(maxDeger, true), sub: maxTarih, color: "#f59e0b", t })
    ),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 10 } },
      btnAralik("90", L.btn90),
      btnAralik("180", L.btn180),
      btnAralik("tum", L.btnTum)
    ),
    h("div", { style: { ...styles.panel, padding: "16px 8px" } },
      h("div", { style: { ...styles.sectionTitle, paddingLeft: 10 } }, L.grSirket),
      h(ResponsiveContainer, { width: "100%", height: 400 },
        h(AreaChart, { data: chartData, margin: { top: 10, right: 20, left: 10, bottom: 5 }, stackOffset: "sign" },
          h("defs", null,
            h("linearGradient", { id: "gN", x1: "0", y1: "0", x2: "0", y2: "1" },
              h("stop", { offset: "5%", stopColor: "#22c55e", stopOpacity: 0.9 }),
              h("stop", { offset: "95%", stopColor: "#22c55e", stopOpacity: 0.7 })
            ),
            h("linearGradient", { id: "gS", x1: "0", y1: "0", x2: "0", y2: "1" },
              h("stop", { offset: "5%", stopColor: "#86efac", stopOpacity: 0.85 }),
              h("stop", { offset: "95%", stopColor: "#86efac", stopOpacity: 0.65 })
            ),
            h("linearGradient", { id: "gB", x1: "0", y1: "0", x2: "0", y2: "1" },
              h("stop", { offset: "5%", stopColor: "#9ca3af", stopOpacity: 0.85 }),
              h("stop", { offset: "95%", stopColor: "#9ca3af", stopOpacity: 0.65 })
            ),
            h("linearGradient", { id: "gP", x1: "0", y1: "0", x2: "0", y2: "1" },
              h("stop", { offset: "5%", stopColor: "#6b7280", stopOpacity: 0.85 }),
              h("stop", { offset: "95%", stopColor: "#6b7280", stopOpacity: 0.65 })
            ),
            h("linearGradient", { id: "gR", x1: "0", y1: "0", x2: "0", y2: "1" },
              h("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.85 }),
              h("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0.65 })
            )
          ),
          h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine }),
          h(XAxis, { dataKey: "date", tick: { fill: t.axisColor, fontSize: 9, fontFamily: "'Roboto Condensed',sans-serif" }, interval: "preserveStartEnd" }),
          h(YAxis, {
            tick: { fill: t.axisColor, fontSize: 9, fontFamily: "'Roboto Condensed',sans-serif" }, tickFormatter: v => {
              if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + "M";
              if (Math.abs(v) >= 1e3) return Math.round(v / 1e3) + "K";
              return v;
            }
          }),
          h(Tooltip, { content: h(SirketTT) }),
          h(Area, { type: "monotone", dataKey: L.lPasif, stackId: "1", stroke: "#ef4444", fill: "url(#gR)", strokeWidth: 0 }),
          h(Area, { type: "monotone", dataKey: L.lNakit, stackId: "1", stroke: "#22c55e", fill: "url(#gN)", strokeWidth: 0 }),
          h(Area, { type: "monotone", dataKey: L.lStok, stackId: "1", stroke: "#86efac", fill: "url(#gS)", strokeWidth: 0 }),
          h(Area, { type: "monotone", dataKey: L.lBina, stackId: "1", stroke: "#9ca3af", fill: "url(#gB)", strokeWidth: 0 }),
          h(Area, { type: "monotone", dataKey: L.lPatent, stackId: "1", stroke: "#6b7280", fill: "url(#gP)", strokeWidth: 0 }),
          h(Area, { type: "monotone", dataKey: L.lDeger, stroke: "#111827", fill: "none", strokeWidth: 2.5, dot: false })
        )
      ),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 12, paddingLeft: 10 } },
        ...[
          { color: "#111827", label: L.lDeger, line: true },
          { color: "#6b7280", label: L.lPatent },
          { color: "#9ca3af", label: L.lBina },
          { color: "#86efac", label: L.lStok },
          { color: "#22c55e", label: L.lNakit },
          { color: "#ef4444", label: L.lPasif },
        ].map((item, i) => h("div", { key: i, style: { display: "flex", alignItems: "center", gap: 5 } },
          item.line
            ? h("div", { style: { width: 22, height: 2.5, background: item.color, borderRadius: 2 } })
            : h("div", { style: { width: 12, height: 12, borderRadius: 2, background: item.color } }),
          h("span", { style: { fontSize: 9, color: t.textMuted, fontFamily: "'Roboto Condensed',sans-serif" } }, item.label)
        ))
      )
    ),
    h("div", { style: styles.panel },
      h("div", { style: styles.sectionTitle }, L.tblSirket),
      h("div", { style: { overflowX: "auto" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse" } },
          h("thead", null, h("tr", null, ...[L.colTarih, L.lNakit, L.lStok, L.lBina, L.lPatent, L.colToplam, L.colRank].map(hd => h("th", { key: hd, style: styles.th }, hd)))),
          h("tbody", null, ...[...data].reverse().slice(0, 10).map((d, i) => h("tr", { key: i },
            h("td", { style: td("#4a90b0", t) }, d.date),
            h("td", { style: td("#22c55e", t) }, numFmt(d.nakit, true)),
            h("td", { style: td("#86efac", t) }, numFmt(d.stok, true)),
            h("td", { style: td("#9ca3af", t) }, numFmt(d.binalar, true)),
            h("td", { style: td("#6b7280", t) }, numFmt(d.patentler, true)),
            h("td", { style: { ...td("#00d4a8", t), fontWeight: 700 } }, numFmt(d.total, true)),
            h("td", { style: td(t.textMuted, t) }, "#" + numFmt(d.rank))
          )))
        )
      )
    )
  );
}

const URUN_KIND = {
  1: { name: "Power", tr: "Enerji", file: "power" },
  2: { name: "Water", tr: "Su", file: "water" },
  3: { name: "Apples", tr: "Elmalar", file: "apples" },
  4: { name: "Oranges", tr: "Portakallar", file: "oranges" },
  5: { name: "Grapes", tr: "Üzümler", file: "grapes" },
  6: { name: "Grain", tr: "Tahıl", file: "grain" },
  7: { name: "Steak", tr: "Biftek", file: "steak" },
  8: { name: "Sausages", tr: "Sosis", file: "sausages" },
  9: { name: "Eggs", tr: "Yumurtalar", file: "eggs" },
  10: { name: "Crude Oil", tr: "Ham Petrol", file: "crude-oil" },
  11: { name: "Petrol", tr: "Benzin", file: "petrol" },
  12: { name: "Diesel", tr: "Dizel", file: "diesel" },
  13: { name: "Transport", tr: "Nakliye", file: "transport" },
  14: { name: "Minerals", tr: "Mineraller", file: "minerals" },
  15: { name: "Bauxite", tr: "Boksit", file: "bauxite" },
  16: { name: "Silicon", tr: "Silisyum", file: "silicon" },
  17: { name: "Chemicals", tr: "Kimyasallar", file: "chemicals" },
  18: { name: "Aluminium", tr: "Alüminyum", file: "aluminium" },
  19: { name: "Plastic", tr: "Plastik", file: "plastic" },
  20: { name: "Processors", tr: "İşlemciler", file: "processors" },
  21: { name: "Electronic Components", tr: "Elektronik Bileşenler", file: "electronic-components" },
  22: { name: "Batteries", tr: "Piller", file: "batteries" },
  23: { name: "Displays", tr: "Ekranlar", file: "displays" },
  24: { name: "Smart Phones", tr: "Akıllı Telefonlar", file: "smart-phones" },
  25: { name: "Tablets", tr: "Tabletler", file: "tablets" },
  26: { name: "Laptops", tr: "Dizüstü Bilgisayarlar", file: "laptops" },
  27: { name: "Monitors", tr: "Monitörler", file: "monitors" },
  28: { name: "Televisions", tr: "Televizyonlar", file: "televisions" },
  29: { name: "Plant Research", tr: "Bitki Araştırması", file: "plant-research" },
  30: { name: "Energy Research", tr: "Enerji Araştırması", file: "energy-research" },
  31: { name: "Mining Research", tr: "Madencilik Araştırması", file: "mining-research" },
  32: { name: "Electronics Research", tr: "Elektronik Araştırması", file: "electronics-research" },
  33: { name: "Breeding Research", tr: "Yetiştirme Araştırması", file: "breeding-research" },
  34: { name: "Chemistry Research", tr: "Kimya Araştırması", file: "chemistry-research" },
  35: { name: "Software", tr: "Yazılım", file: "software" },
  40: { name: "Cotton", tr: "Pamuk", file: "cotton" },
  41: { name: "Fabric", tr: "Kumaş", file: "fabric" },
  42: { name: "Iron Ore", tr: "Demir Cevheri", file: "iron-ore" },
  43: { name: "Steel", tr: "Çelik", file: "steel" },
  44: { name: "Sand", tr: "Kum", file: "sand" },
  45: { name: "Glass", tr: "Cam", file: "glass" },
  46: { name: "Leather", tr: "Deri", file: "leather" },
  47: { name: "On-board Computer", tr: "Araç Bilgisayarı", file: "on-board-computer" },
  48: { name: "Electric Motor", tr: "Elektrik Motoru", file: "electric-motor" },
  49: { name: "Luxury Car Interior", tr: "Lüks Araç İç Donanımı", file: "luxury-car-interior" },
  50: { name: "Car Interior", tr: "Araç İç Donanımı", file: "car-interior" },
  51: { name: "Car Body", tr: "Araç Kasası", file: "car-body" },
  52: { name: "Combustion Engine", tr: "İçten Yanmalı Motor", file: "combustion-engine" },
  53: { name: "Economy E-Car", tr: "Ekonomik E-Araba", file: "economy-e-car" },
  54: { name: "Luxury E-Car", tr: "Lüks E-Araba", file: "luxury-e-car" },
  55: { name: "Economy Car", tr: "Ekonomik Araba", file: "economy-car" },
  56: { name: "Luxury Car", tr: "Lüks Araba", file: "luxury-car" },
  57: { name: "Truck", tr: "Kamyon", file: "truck" },
  58: { name: "Automotive Research", tr: "Otomotiv Araştırması", file: "automotive-research" },
  59: { name: "Fashion Research", tr: "Moda Araştırması", file: "fashion-research" },
  60: { name: "Underwear", tr: "İç Çamaşırı", file: "underwear" },
  61: { name: "Gloves", tr: "Eldivenler", file: "gloves" },
  62: { name: "Dress", tr: "Elbise", file: "dress" },
  63: { name: "Simmi Shoes", tr: "Simmi Ayakkabılar", file: "simmi-shoes" },
  64: { name: "Handbags", tr: "El Çantaları", file: "handbags" },
  65: { name: "Sneakers", tr: "Spor Ayakkabılar", file: "sneakers" },
  66: { name: "Seeds", tr: "Tohumlar", file: "seeds" },
  67: { name: "Xmas Crackers", tr: "Yılbaşı Çıtlatıcıları", file: "xmas-crackers" },
  68: { name: "Gold Ore", tr: "Altın Cevheri", file: "gold-ore" },
  69: { name: "Golden Bars", tr: "Altın Külçeler", file: "golden-bars" },
  70: { name: "Gold Watch", tr: "Altın Saat", file: "gold-watch" },
  71: { name: "Necklace", tr: "Kolye", file: "necklace" },
  72: { name: "Sugarcane", tr: "Şeker Kamışı", file: "sugarcane" },
  73: { name: "Ethanol", tr: "Etanol", file: "ethanol" },
  74: { name: "Methane", tr: "Metan", file: "methane" },
  75: { name: "Carbon Fiber", tr: "Karbon Fiber", file: "carbon-fiber" },
  76: { name: "Carbon Composite", tr: "Karbon Kompozit", file: "carbon-composite" },
  77: { name: "Fuselage", tr: "Gövde", file: "fuselage" },
  78: { name: "Wing", tr: "Kanat", file: "wing" },
  79: { name: "High-Grade E-Components", tr: "Yüksek Kalite E-Bileşenler", file: "high-grade-e-components" },
  80: { name: "Flight Computer", tr: "Uçuş Bilgisayarı", file: "flight-computer" },
  81: { name: "Cockpit", tr: "Kokpit", file: "cockpit" },
  82: { name: "Attitude Control", tr: "Yön Kontrolü", file: "attitude-control" },
  83: { name: "Rocket Fuel", tr: "Roket Yakıtı", file: "rocket-fuel" },
  84: { name: "Fuel Tank", tr: "Yakıt Deposu", file: "fuel-tank" },
  85: { name: "Solid Rocket", tr: "Katı Roket", file: "solid-rocket" },
  86: { name: "Rocket Engine", tr: "Roket Motoru", file: "rocket-engine" },
  87: { name: "Heat Shield", tr: "Isı Kalkanı", file: "heat-shield" },
  88: { name: "Ion Drive", tr: "İyon İticisi", file: "ion-drive" },
  89: { name: "Jet Engine", tr: "Jet Motoru", file: "jet-engine" },
  98: { name: "Quadcopter", tr: "Dört Pervaneli Drone", file: "quadcopter" },
  100: { name: "Aero Research", tr: "Havacılık Araştırması", file: "aero-research" },
  101: { name: "Reinforced Concrete", tr: "Betonarme", file: "reinforced-concrete" },
  102: { name: "Bricks", tr: "Tuğlalar", file: "bricks" },
  103: { name: "Cement", tr: "Çimento", file: "cement" },
  104: { name: "Clay", tr: "Kil", file: "clay" },
  105: { name: "Limestone", tr: "Kireçtaşı", file: "limestone" },
  106: { name: "Wood", tr: "Odun", file: "wood" },
  107: { name: "Steel Beams", tr: "Çelik Kirişler", file: "steel-beams" },
  108: { name: "Planks", tr: "Tahta Levhalar", file: "planks" },
  109: { name: "Windows", tr: "Pencereler", file: "windows" },
  110: { name: "Tools", tr: "Aletler", file: "tools" },
  111: { name: "Construction Units", tr: "İnşaat Birimleri", file: "construction-units" },
  112: { name: "Bulldozer", tr: "Buldozer", file: "bulldozer" },
  113: { name: "Materials Research", tr: "Malzeme Araştırması", file: "materials-research" },
  114: { name: "Robots", tr: "Robotlar", file: "robots" },
  115: { name: "Cow", tr: "İnek", file: "cow" },
  116: { name: "Pig", tr: "Domuz", file: "pig" },
  117: { name: "Milk", tr: "Süt", file: "milk" },
  118: { name: "Coffee Beans", tr: "Kahve Çekirdekleri", file: "coffee-beans" },
  119: { name: "Coffee Ground", tr: "Öğütülmüş Kahve", file: "coffee-ground" },
  120: { name: "Vegetables", tr: "Sebzeler", file: "vegetables" },
  121: { name: "Bread", tr: "Ekmek", file: "bread" },
  122: { name: "Cheese", tr: "Peynir", file: "cheese" },
  123: { name: "Apple Pie", tr: "Elmalı Turta", file: "apple-pie" },
  124: { name: "Orange Juice", tr: "Portakal Suyu", file: "orange-juice" },
  125: { name: "Apple Cider", tr: "Elma Şarabı", file: "apple-cider" },
  126: { name: "Ginger Beer", tr: "Zencefilli Bira", file: "ginger-beer" },
  127: { name: "Pizza", tr: "Pizza", file: "pizza" },
  128: { name: "Pasta", tr: "Makarna", file: "pasta" },
  129: { name: "Hamburger", tr: "Hamburger", file: "hamburger" },
  130: { name: "Lasagna", tr: "Lazanya", file: "lasagna" },
  131: { name: "Meatballs", tr: "Köfteler", file: "meatballs" },
  132: { name: "Cocktails", tr: "Kokteyller", file: "cocktails" },
  133: { name: "Flour", tr: "Un", file: "flour" },
  134: { name: "Butter", tr: "Tereyağı", file: "butter" },
  135: { name: "Sugar", tr: "Şeker", file: "sugar" },
  136: { name: "Cocoa Beans", tr: "Kakao Çekirdekleri", file: "cocoa-beans" },
  137: { name: "Dough", tr: "Hamur", file: "dough" },
  138: { name: "Gravy Boat", tr: "Sos Teknesi", file: "gravy-boat" },
  139: { name: "Fodder", tr: "Yem", file: "fodder" },
  140: { name: "Chocolate", tr: "Çikolata", file: "chocolate" },
  141: { name: "Vegetable Oil", tr: "Bitkisel Yağ", file: "vegetable-oil" },
  142: { name: "Salad", tr: "Salata", file: "salad" },
  143: { name: "Samosas", tr: "Samosalar", file: "samosas" },
  144: { name: "Xmas Ornament", tr: "Yılbaşı Süsü", file: "xmas-ornament" },
  145: { name: "Recipes", tr: "Tarifler", file: "recipes" },
  146: { name: "Pumpkin", tr: "Balkabağı", file: "pumpkin" },
  147: { name: "Jack-o-Lantern", tr: "Jack-o-Lantern", file: "jack-o-lantern" },
  148: { name: "Witch Costume", tr: "Cadı Kostümü", file: "witch-costume" },
  149: { name: "Pumpkin Soup", tr: "Balkabağı Çorbası", file: "pumpkin-soup" },
  150: { name: "Tree", tr: "Ağaç", file: "tree" },
  151: { name: "Easter Bunny", tr: "Paskalya Tavşanı", file: "easter-bunny" },
  152: { name: "Ramadan Sweets", tr: "Ramazan Tatlıları", tr2: "Ramazan Şekeri", file: "ramadan-sweets" },
  153: { name: "Ice Cream Chocolate", tr: "Çikolatalı Dondurma", file: "icecream-chocolate" },
  154: { name: "Ice Cream Apple", tr: "Elmalı Dondurma", file: "icecream-apple" },
  155: { name: "Cream Egg", tr: "Kremalı Yumurta", file: "cream-egg" },
};

function urunAdi(kind, lang) {
  const u = URUN_KIND[kind];
  if (!u) return "?";
  return (lang === "TR" && u.tr) ? u.tr : u.name;
}

const IMG_BASE = "https://www.simcompanies.com/static/images/resources/";
function UrunImg({ file, size = 24, style = {} }) {
  const [err, setErr] = React.useState(false);
  if (err || !file) return h("div", { style: { width: size, height: size, background: "#1a3a50", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0, ...style } }, "📦");
  return h("img", {
    src: IMG_BASE + file + ".png",
    style: { width: size, height: size, objectFit: "contain", flexShrink: 0, ...style },
    onError: () => setErr(true)
  });
}



function VWAPPage({ warehouseCSV, warehouseTR, warehouseEN, retailInfo, marketTicker, storage, t, styles, L, lang }) {
  const isDark = t.page === "#060d14";
  const Tt = (p) => h(TT, { ...p, t });

  // ── Yardımcı: storage item'ından kindId ve imageFile çıkar ──────────────
  const extractKindInfo = (item) => {
    if (!item) return { kindId: null, imageFile: null, apiName: "" };
    const isObj = typeof item.kind === "object" && item.kind !== null;
    const kindId = isObj
      ? (item.kind.db_letter ?? item.kind.dbLetter ?? item.kind.id ?? null)
      : (item.kind ?? null);
    const rawImg = isObj ? (item.kind.image || "") : "";
    const imageFile = rawImg.replace(/^.*\//, "").replace(/\.png$/, "") || null;
    const apiName = isObj ? (item.kind.name || "") : "";
    return { kindId, imageFile, apiName };
  };

  // ── Market Ticker VWAP haritası: kindId → fiyat ──────────────────────────
  const tickerImageMap = useMemo(() => {
    const map = {};
    if (marketTicker?.length) {
      marketTicker.forEach(item => {
        if (item.kind != null && item.image)
          map[item.kind] = item.image.replace(/^images\/resources\//, "").replace(/\.png$/, "");
      });
    }
    return map;
  }, [marketTicker]);

  // ── VWAP haritası: kindId → fiyat ────────────────────────────────────────
  const vwapMap = useMemo(() => {
    const map = {};
    if (marketTicker?.length) {
      marketTicker.forEach(item => {
        if (item.kind != null && item.price > 0) map[item.kind] = item.price;
      });
    }
    if (!Object.keys(map).length && retailInfo?.length) {
      retailInfo.forEach(item => {
        if (item.dbLetter != null && item.averagePrice > 0)
          map[item.dbLetter] = item.averagePrice;
      });
    }
    return map;
  }, [marketTicker, retailInfo]);
  // -- CSV index: storage[idx] = csvRows[idx] (ayni sira garantisi)
  const csvRows = useMemo(() => {
    const rows = warehouseEN?.length ? warehouseEN
      : warehouseTR?.length ? warehouseTR
        : (warehouseCSV ?? []);
    return rows.map(row => ({
      quality: parseInt(row.Quality) || 0,
      amount: parseFloat(row.Amount) || 0,
      totalCost: (parseFloat(row["Cost labor"]) || 0)
        + (parseFloat(row["Cost management"]) || 0)
        + (parseFloat(row["Cost 3rd party"]) || 0)
        + (parseFloat(row["Cost material 1"]) || 0)
        + (parseFloat(row["Cost material 2"]) || 0)
        + (parseFloat(row["Cost material 3"]) || 0)
        + (parseFloat(row["Cost material 4"]) || 0)
        + (parseFloat(row["Cost material 5"]) || 0),
    }));
  }, [warehouseCSV, warehouseTR, warehouseEN]);

  // -- Isim bazli fallback: csvRows[idx] basarisiz olursa devreye girer.
  const csvCostMap = useMemo(() => {
    const map = {};
    const EXTRA = {
      "İnşaat Gereci": 111, "Construction Units": 111,
      "Kereste": 108, "Planks": 108,
      "Silikon": 16, "Silicon": 16,
      "Taşıma": 13, "Transport": 13,
      "Lüks Saat": 70, "Gold Watch": 70,
      "Ramazan Şekeri": 152, "Ramadan Sweets": 152,
      "Altın Külçe": 69, "Golden Bars": 69,
    };
    const nameToId = (name) => {
      if (!name) return null;
      if (EXTRA[name]) return EXTRA[name];
      const low = name.toLowerCase();
      for (const [id, info] of Object.entries(URUN_KIND)) {
        if (info.name === name || info.tr === name) return parseInt(id);
      }
      for (const [id, info] of Object.entries(URUN_KIND)) {
        if (info.name.toLowerCase() === low || info.tr.toLowerCase() === low) return parseInt(id);
      }
      const norm = s => s.toLowerCase().replace(/lar[\u0131i]?$|ler[\u0131i]?$|s$/g, "").trim();
      const nName = norm(name);
      for (const [id, info] of Object.entries(URUN_KIND)) {
        if (norm(info.name) === nName || norm(info.tr) === nName) return parseInt(id);
      }
      return null;
    };
    const processRows = (rows) => {
      if (!rows?.length) return;
      rows.forEach(row => {
        const resName = (row.Resource || "").trim();
        const quality = parseInt(row.Quality) || 0;
        const amount = parseFloat(row.Amount) || 0;
        if (!resName || amount <= 0) return;
        const kindId = nameToId(resName);
        if (!kindId) return;
        const key = `${kindId}_${quality}`;
        if (map[key]) return;
        const totalCost = (parseFloat(row["Cost labor"]) || 0)
          + (parseFloat(row["Cost management"]) || 0)
          + (parseFloat(row["Cost 3rd party"]) || 0)
          + (parseFloat(row["Cost material 1"]) || 0)
          + (parseFloat(row["Cost material 2"]) || 0)
          + (parseFloat(row["Cost material 3"]) || 0)
          + (parseFloat(row["Cost material 4"]) || 0)
          + (parseFloat(row["Cost material 5"]) || 0);
        map[key] = { totalCost, amount };
      });
    };
    // EN önce, TR sonra, genel CSV en sona (fallback)
    processRows(warehouseEN);
    processRows(warehouseTR);
    processRows(warehouseCSV);
    return map;
  }, [warehouseCSV, warehouseTR, warehouseEN]);

  // ── Ana işlem: Storage API → tüm depo ürünleri ─────────────────────────
  const processed = useMemo(() => {
    if (!storage?.length) return null;

    const seen = new Set();
    const items = storage.map((item, idx) => {
      const amount = parseFloat(item.amount) || 0;
      if (amount <= 0) return null;

      const { kindId, imageFile: storageImg, apiName } = extractKindInfo(item);
      const quality = item.quality ?? 0;
      if (kindId == null) return null;

      // Aynı kindId+quality çiftini bir kez ekle
      const dedupKey = `${kindId}_${quality}`;
      if (seen.has(dedupKey)) return null;
      seen.add(dedupKey);

      const ukind = URUN_KIND[kindId];
      const fileForImage = storageImg || tickerImageMap[kindId] || ukind?.file || null;
      const displayName = lang === "TR"
        ? (ukind?.tr || apiName || ukind?.name || String(kindId))
        : (ukind?.name || apiName || String(kindId));

      // ── Maliyet çözümleme (3 katmanlı)
      // 1) Storage API'nin kendi alanı (unit_cost, uv, cost ...)
      // 2) Index eşleştirmesi: csvRows[idx] — quality doğrulamasıyla
      // 3) İsim bazlı harita (csvCostMap) — son çare
      let totalCost = 0, unitCost = 0;
      const rawUnitCost = item.unit_cost ?? item.unitCost ?? item.uv ?? item.cost ?? item.unit_price ?? null;
      if (rawUnitCost != null && rawUnitCost > 0) {
        unitCost = parseFloat(rawUnitCost);
        totalCost = unitCost * amount;
      } else if (csvRows[idx]?.totalCost > 0 && csvRows[idx].quality === quality) {
        totalCost = csvRows[idx].totalCost;
        unitCost = amount > 0 ? totalCost / amount : 0;
      } else {
        const costEntry = csvCostMap[dedupKey] ?? csvCostMap[`${kindId}_0`];
        totalCost = costEntry?.totalCost ?? 0;
        unitCost = amount > 0 ? totalCost / amount : 0;
      }

      // VWAP ve hesaplamalar
      const vwap = vwapMap[kindId] ?? 0;
      const target85 = vwap * 0.85;
      const vaPerUnit = vwap > 0 ? target85 - unitCost : 0;
      const vaTotal = vaPerUnit * amount;
      const marketValue = vwap * amount;

      return {
        displayName, quality, amount, unitCost, totalCost,
        file: fileForImage, kindId,
        vwap, target85, vaPerUnit, vaTotal, marketValue,
        status: vwap === 0 ? "nodata" : vaPerUnit >= 0 ? "profit" : "loss",
      };
    }).filter(Boolean);

    if (!items.length) return null;

    // Debug
    const noVwap = items.filter(i => i.vwap === 0);
    const noCost = items.filter(i => i.totalCost === 0);
    if (noVwap.length)
      console.log("[VWAP] VWAP bulunamayan kindId'ler:", noVwap.map(i => ({ kindId: i.kindId, name: i.displayName })));
    if (noCost.length)
      console.log("[VWAP] Maliyet=0 urunler:", noCost.map(i => {
        const si = storage.find(s => {
          const isObj = typeof s.kind === "object" && s.kind !== null;
          const kid = isObj ? (s.kind.db_letter ?? s.kind.dbLetter ?? s.kind.id) : s.kind;
          return kid === i.kindId && (s.quality ?? 0) === i.quality;
        });
        return {
          kindId: i.kindId, name: i.displayName, quality: i.quality,
          csvKey: `${i.kindId}_${i.quality}`, csvHit: !!csvCostMap[`${i.kindId}_${i.quality}`],
          csvKeyAlt: `${i.kindId}_0`, csvHitAlt: !!csvCostMap[`${i.kindId}_0`],
          storageFields: si ? Object.keys(si).join(", ") : "bulunamadi",
        };
      }));
    console.log(`[VWAP] Toplam: ${items.length} | VWAP eslesen: ${items.filter(i => i.vwap > 0).length} | Maliyet var: ${items.filter(i => i.totalCost > 0).length}`);

    items.sort((a, b) => {
      if (a.vwap > 0 && b.vwap === 0) return -1;
      if (a.vwap === 0 && b.vwap > 0) return 1;
      return b.vaTotal - a.vaTotal;
    });

    const totalVA = items.reduce((s, i) => s + i.vaTotal, 0);
    const totalCostAll = items.reduce((s, i) => s + i.totalCost, 0);
    const totalMV = items.reduce((s, i) => s + i.marketValue, 0);
    const profitCount = items.filter(i => i.status === "profit").length;
    const lossCount = items.filter(i => i.status === "loss").length;

    const barData = [...items]
      .sort((a, b) => Math.abs(b.vaTotal) - Math.abs(a.vaTotal))
      .slice(0, 10)
      .map(i => ({ name: i.displayName + (i.quality > 0 ? " Q" + i.quality : ""), value: Math.round(i.vaTotal) }));

    const profitTotal = items.filter(i => i.status === "profit").reduce((s, i) => s + i.vaTotal, 0);
    const lossTotal = items.filter(i => i.status === "loss").reduce((s, i) => s + Math.abs(i.vaTotal), 0);
    const pieData = [
      { name: L.vKarliTag, value: Math.round(Math.abs(profitTotal)) },
      { name: L.vZararliTag, value: Math.round(Math.abs(lossTotal)) },
    ].filter(d => d.value > 0);

    return { items, totalVA, totalCostAll, totalMV, profitCount, lossCount, barData, pieData };
  }, [storage, csvRows, csvCostMap, vwapMap, tickerImageMap, lang, L]);

  if (!processed) {
    return h("div", { style: styles.empty },
      h("div", { style: { fontSize: 24, marginBottom: 10 } }, "📊"),
      h("div", { style: { fontSize: 11 } }, L.vEmpty)
    );
  }

  const { items, totalVA, totalCostAll, totalMV, profitCount, lossCount, barData, pieData } = processed;
  const PIE_COLORS = ["#00d4a8", "#ef4444"];

  return h("div", null,
    h("div", { style: styles.sectionTitle }, L.vTitle),

    // Aciklama
    h("div", { style: { ...styles.panel, padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, borderLeft: "3px solid #7c3aed" } },
      h("span", { style: { fontSize: 14 } }, "ℹ️"),
      h("span", { style: { fontSize: 9, color: t.textMuted, letterSpacing: 0.5 } }, L.vAciklama)
    ),

    // Stat Cards
    h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 } },
      h(StatCard, {
        label: L.vTopVA,
        value: (totalVA >= 0 ? "+" : "") + "$" + numFmt(totalVA, true),
        color: totalVA >= 0 ? "#00d4a8" : "#ef4444", t
      }),
      h(StatCard, {
        label: L.vTopMV,
        value: "$" + numFmt(totalMV, true),
        sub: L.cToplamMal + ": $" + numFmt(totalCostAll, true),
        color: "#3b82f6", t
      }),
      h(StatCard, {
        label: L.vKarli,
        value: profitCount,
        sub: items.length + " " + L.wUrunCesidi.toLowerCase(),
        color: "#00d4a8", t
      }),
      h(StatCard, {
        label: L.vZararli,
        value: lossCount,
        color: "#ef4444", t
      })
    ),

    // Grafik satiri
    h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14, marginBottom: 16 } },

      // Pie
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.vPie),
        h(ResponsiveContainer, { width: "100%", height: 200 },
          h(PieChart, { margin: { top: 5, right: 5, left: 5, bottom: 5 } },
            h(Pie, { data: pieData, cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 85, dataKey: "value", nameKey: "name" },
              ...pieData.map((_, i) => h(Cell, { key: i, fill: PIE_COLORS[i % PIE_COLORS.length] }))
            ),
            h(Tooltip, { content: h(Tt) })
          )
        ),
        // Center text
        h("div", { style: { textAlign: "center", marginTop: -95, marginBottom: 55, pointerEvents: "none" } },
          h("div", { style: { fontSize: 12, fontWeight: 700, color: totalVA >= 0 ? "#00d4a8" : "#ef4444" } },
            (totalVA >= 0 ? "+" : "") + "$" + numFmt(Math.abs(totalVA), true)
          ),
          h("div", { style: { fontSize: 8, color: t.textFaint, marginTop: 2 } }, "VA")
        )
      ),

      // Bar
      h("div", { style: styles.panel },
        h("div", { style: styles.sectionTitle }, L.vBar),
        h(ResponsiveContainer, { width: "100%", height: 230 },
          h(BarChart, { data: barData, layout: "vertical", margin: { top: 4, right: 20, left: 4, bottom: 4 } },
            h(CartesianGrid, { strokeDasharray: "3 3", stroke: t.gridLine, horizontal: false }),
            h(XAxis, { type: "number", tick: { fill: t.axisColor, fontSize: 8 }, tickFormatter: v => numFmt(v, true), axisLine: false, tickLine: false }),
            h(YAxis, {
              type: "category", dataKey: "name",
              tick: { fill: t.axisColor, fontSize: 8, fontFamily: "'Roboto Condensed',sans-serif" },
              width: Math.min(120, Math.max(70, barData.length ? Math.max(...barData.map(d => (d.name || "").length)) * 5.5 : 70)),
              tickLine: false, axisLine: false,
              tickFormatter: v => v && v.length > 16 ? v.slice(0, 14) + "…" : v
            }),
            h(Tooltip, { content: h(Tt) }),
            h(Bar, { dataKey: "value", name: "VA", radius: [0, 4, 4, 0], barSize: 16 },
              ...barData.map((d, i) => h(Cell, { key: i, fill: d.value >= 0 ? "#00d4a8" : "#ef4444" }))
            )
          )
        )
      )
    ),

    // Ana Tablo
    h("div", { style: styles.panel },
      h("div", { style: styles.sectionTitle }, L.vTablo),
      h("div", { style: { overflowX: "auto", maxWidth: "100%" } },
        h("table", { style: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" } },
          h("thead", null,
            h("tr", { style: { background: isDark ? "#0d1e2e" : "#dce8f0" } },
              ...[L.wUrun, L.wKalite, L.wAdet, L.vBirimMal, L.vVwap, L.vHedef, L.vVaBirim, L.vVaTop, L.vDurum].map((hd, i) => {
                const cols = ["#00d4a8", "#7c3aed", "#3b82f6", "#f59e0b", "#06b6d4", "#10b981", "#f59e0b", "#00d4a8", "#7c3aed"];
                return h("th", {
                  key: i,
                  style: {
                    padding: "8px 6px", textAlign: i === 0 ? "left" : "right",
                    color: cols[i], fontSize: 9, letterSpacing: 1, fontWeight: 700,
                    whiteSpace: "nowrap",
                    borderBottom: `2px solid ${cols[i]}`,
                    borderTop: `2px solid ${cols[i]}`,
                    background: `${cols[i]}18`,
                  }
                }, hd);
              })
            )
          ),
          h("tbody", null,
            ...items.map((item, ri) => {
              const rowBg = ri % 2 === 0
                ? (isDark ? "transparent" : "#f8fbfd")
                : (isDark ? "#ffffff08" : "#eef5fa");
              const vaColor = item.status === "nodata" ? t.textFaint : (item.vaPerUnit >= 0 ? "#00d4a8" : "#ef4444");

              return h("tr", { key: ri, style: { background: rowBg } },
                // Urun
                h("td", { style: { padding: "7px 6px", borderBottom: `1px solid ${t.panelBorder}`, display: "flex", alignItems: "center", gap: 6 } },
                  h(UrunImg, { file: item.file, size: 20 }),
                  h("span", { style: { fontSize: 10, fontWeight: 600, color: "#00d4a8" } }, item.displayName)
                ),
                // Kalite
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 10, color: "#7c3aed", borderBottom: `1px solid ${t.panelBorder}`, fontWeight: 600 } },
                  item.quality > 0 ? h("span", { style: { background: "#7c3aed20", padding: "2px 6px", borderRadius: 4 } }, "Q" + item.quality) : "—"
                ),
                // Adet
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 10, color: "#3b82f6", borderBottom: `1px solid ${t.panelBorder}`, fontWeight: 600 } }, numFmt(item.amount)),
                // Birim Maliyet
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 10, color: "#f59e0b", borderBottom: `1px solid ${t.panelBorder}` } }, "$" + numFmt(item.unitCost)),
                // VWAP
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 10, color: item.vwap > 0 ? "#06b6d4" : t.textFaint, borderBottom: `1px solid ${t.panelBorder}`, fontWeight: 600 } },
                  item.vwap > 0 ? "$" + numFmt(item.vwap) : "—"
                ),
                // Hedef %85
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 10, color: item.vwap > 0 ? "#10b981" : t.textFaint, borderBottom: `1px solid ${t.panelBorder}` } },
                  item.vwap > 0 ? "$" + numFmt(item.target85) : "—"
                ),
                // VA/Birim
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 10, color: vaColor, borderBottom: `1px solid ${t.panelBorder}`, fontWeight: 600 } },
                  item.vwap > 0 ? ((item.vaPerUnit >= 0 ? "+" : "") + "$" + numFmt(item.vaPerUnit)) : "—"
                ),
                // VA Toplam
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 11, color: vaColor, borderBottom: `1px solid ${t.panelBorder}`, fontWeight: 700 } },
                  item.vwap > 0 ? ((item.vaTotal >= 0 ? "+" : "") + "$" + numFmt(item.vaTotal, true)) : "—"
                ),
                // Durum
                h("td", { style: { padding: "7px 6px", textAlign: "right", fontSize: 9, borderBottom: `1px solid ${t.panelBorder}` } },
                  h("span", {
                    style: {
                      display: "inline-block", padding: "2px 8px", borderRadius: 10,
                      background: item.status === "profit" ? "#00d4a820" : item.status === "loss" ? "#ef444420" : (isDark ? "#ffffff10" : "#00000010"),
                      color: item.status === "profit" ? "#00d4a8" : item.status === "loss" ? "#ef4444" : t.textFaint,
                      fontWeight: 600, fontSize: 8, letterSpacing: 0.5,
                    }
                  }, item.status === "profit" ? ("✓ " + L.vKarliTag) : item.status === "loss" ? ("✗ " + L.vZararliTag) : "— N/A")
                )
              );
            }),
            // Toplam satiri
            h("tr", { style: { background: isDark ? (totalVA >= 0 ? "#00d4a810" : "#ef444410") : (totalVA >= 0 ? "#e0fff8" : "#fff0f0") } },
              h("td", { colSpan: 6, style: { padding: "9px 6px", fontSize: 11, fontWeight: 700, color: totalVA >= 0 ? "#00d4a8" : "#ef4444", borderTop: `2px solid ${totalVA >= 0 ? "#00d4a840" : "#ef444440"}`, letterSpacing: 1 } }, L.vToplamVA),
              h("td", null),
              h("td", { style: { padding: "9px 6px", textAlign: "right", fontSize: 12, fontWeight: 700, color: totalVA >= 0 ? "#00d4a8" : "#ef4444", borderTop: `2px solid ${totalVA >= 0 ? "#00d4a840" : "#ef444440"}` } },
                (totalVA >= 0 ? "+" : "") + "$" + numFmt(totalVA, true)
              ),
              h("td", null)
            )
          )
        )
      )
    )
  );
}

function App() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [activeTab, setActiveTab] = useState("ozet");
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("EN");
  const [company, setCompany] = useState("");
  const t = darkMode ? DARK : LIGHT;
  const styles = makeStyles(t);
  const L = T[lang];
  const fetchData = useCallback(async () => {
    setStatus("loading"); setError(null);
    try {
      const tabs = await chrome.tabs.query({ url: "https://www.simcompanies.com/*" });
      if (!tabs.length) throw new Error(L.errNoTab);
      const result = await chrome.tabs.sendMessage(tabs[0].id, { action: "FETCH_DATA" });
      if (!result?.success) throw new Error(result?.error || L.errNoData);
      setRawData(result); setCompany(result.companyName || ""); setStatus("ready");
    } catch (e) { setError(e.message); setStatus("idle"); }
  }, [L]);
  const bilancoData = useMemo(() => {
    if (!rawData?.bilanco) return [];
    const arr = Array.isArray(rawData.bilanco) ? rawData.bilanco : [rawData.bilanco];
    return arr.map(r => ({ date: fmtDate(r.date), nakit: pf(r.cashAndReceivables), stok: pf(r.inventory), binalar: pf(r.buildings), patentler: pf(r.patents), total: pf(r.total), currentAssets: pf(r.currentAssets), nonCurrentAssets: pf(r.nonCurrentAssets), rank: pf(r.rank) }));
  }, [rawData?.bilanco]);

  const gelirData = useMemo(() => {
    if (bilancoData.length < 2) return [];
    let k = 0; const res = [];
    for (let i = 1; i < bilancoData.length; i++) {
      const net = bilancoData[i].total - bilancoData[i - 1].total;
      k += net;
      res.push({ date: bilancoData[i].date, net, kumulatif: k, total: bilancoData[i].total });
    }
    return res;
  }, [bilancoData]);

  const nakitData = useMemo(() => {
    if (bilancoData.length < 2) return [];
    return bilancoData.map((d, i) => ({
      ...d,
      nakitDeg: i > 0 ? d.nakit - bilancoData[i - 1].nakit : 0,
    }));
  }, [bilancoData]);
  if (status !== "ready") return h(LoadScreen, { status, onFetch: fetchData, error, t, styles, L });
  const TABS = [
    { id: "ozet", label: "◈ " + L.t1 },
    { id: "sirket", label: "📈 " + L.t7 },
    { id: "veri", label: "⬡ " + L.tVeri },
    { id: "nakit", label: "⇄ " + L.t4 },
    { id: "urun", label: "📦 " + L.t6 },

    { id: "hedef", label: "🎯 " + L.tHedef },
    { id: "vwap", label: "📈 " + L.t9 },
  ];
  const props = { t, styles, L, lang, realmId: rawData?.companyRealm ?? 0 };
  function renderContent() {
    switch (activeTab) {
      case "ozet": return h(OzetPage, { bilancoData, gelirData, ...props });
      case "sirket": return h(SirketPage, { data: bilancoData, ...props });
      case "veri": return h(MasterDataPage, { bilancoData, gelirData, ...props });
      case "nakit": return h(NakitPage, { data: nakitData, cashflow: rawData?.cashflow, ledger: rawData?.ledger, ...props });
      case "urun": return h(UrunPage, { ledger: rawData?.ledger, lang, ...props });

      case "hedef": return h(HedefPage, { bilancoData, gelirData, ...props });
      case "vwap": return h(VWAPPage, { warehouseCSV: rawData?.warehouseCSV, warehouseTR: rawData?.warehouseTR, warehouseEN: rawData?.warehouseEN, retailInfo: rawData?.retailInfo, marketTicker: rawData?.marketTicker, storage: rawData?.storage, ...props });
      default: return null;
    }
  }
  const btnS = (extra = {}) => ({ background: darkMode ? "#0a1520" : "#e8f0f8", border: `1px solid ${darkMode ? "#1a3a50" : "#b0cce0"}`, borderRadius: 8, cursor: "pointer", padding: "5px 10px", fontSize: 10, color: darkMode ? "#7ab0c8" : "#2a6080", fontFamily: "'Roboto Condensed',sans-serif", ...extra });
  return h("div", { style: styles.page },
    h("div", { style: { background: darkMode ? "linear-gradient(90deg,#060d14,#0a1a25,#060d14)" : "linear-gradient(90deg,#fff,#f0f6fc,#fff)", borderBottom: `1px solid ${t.headerBorder}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        h("img", {
          src: "icons/icon48.png",
          style: { width: 28, height: 28, borderRadius: 7, boxShadow: "0 0 10px #00d4a840", flexShrink: 0 }
        }),
        h("div", null,
          h("div", { style: { fontSize: 14, fontWeight: 700, color: "#00d4a8", letterSpacing: 2 } }, "SIM COMPANIES")
        )
      ),
      h("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
        h("button", { onClick: fetchData, style: btnS() }, "↻ " + L.refresh),
        h("button", { onClick: () => setDarkMode(d => !d), style: btnS({ borderRadius: 20, padding: "5px 11px" }) }, darkMode ? ("☀ " + L.light) : ("☾ " + L.dark)),
        h("button", { onClick: () => setLang(l => l === "TR" ? "EN" : "TR"), style: btnS({ borderRadius: 8, padding: "5px 13px", fontWeight: 700, fontSize: 12, border: "1px solid #00d4a840", color: "#00d4a8", background: darkMode ? "#001a12" : "#e0fff8" }) }, L.langSwitch)
      )
    ),
    h("div", { style: { display: "flex", borderBottom: `1px solid ${t.tabBorder}`, padding: "0 12px", overflowX: "auto", background: t.tabBar, scrollbarWidth: "none", msOverflowStyle: "none" } },
      ...TABS.map(tab => h("button", { key: tab.id, onClick: () => setActiveTab(tab.id), style: { background: "none", border: "none", cursor: "pointer", padding: "9px 10px", fontSize: 9, letterSpacing: 1, whiteSpace: "nowrap", color: activeTab === tab.id ? "#00d4a8" : t.tabInactive, borderBottom: activeTab === tab.id ? "2px solid #00d4a8" : "2px solid transparent", fontFamily: "'Roboto Condensed',sans-serif", transition: "color .2s", flexShrink: 0 } }, tab.label))
    ),
    h("div", { style: { padding: "14px 16px", overflowX: "hidden" } }, renderContent())
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
