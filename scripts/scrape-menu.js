#!/usr/bin/env node
/**
 * Ramirez Restaurant Menu Scraper
 * ================================
 * Parses the raw HTML from the English menu page to extract:
 *  - Category names (h2 headings)
 *  - Menu items (h4 headings) with prices
 *
 * The EN page contains the full menu with English item names but Hungarian category names.
 * The DE page has NO menu items (server-rendered empty).
 * The HU page (/etlapunk/) returns 404.
 *
 * Strategy:
 *  - Parse the EN page fully for structure, items, and prices.
 *  - Use the Hungarian category names from the EN page (they're in Hungarian on all versions).
 *  - Map known Hungarian category names to English and German translations.
 *  - For the Hungarian item names, translate from the English version.
 *
 * Output: en.json, hu.json, de.json in /public/locales/
 */

const fs = require('fs');
const path = require('path');

// Read the scraped English HTML file
const EN_HTML_PATH = path.join(
  process.env.HOME,
  '.gemini/antigravity/brain/84d4807f-2184-48c1-b20d-b3c505a70103/.system_generated/steps/10/content.md'
);

const html = fs.readFileSync(EN_HTML_PATH, 'utf-8');

// ── Extract all heading tags ──────────────────────────────────────────────────
// Pattern: <h2 class="elementor-heading-title elementor-size-default">CATEGORY</h2>
// Pattern: <h4 class="elementor-heading-title elementor-size-default">ITEM or PRICE</h4>

const headingRegex = /<h([24]) class="elementor-heading-title elementor-size-default">(.*?)<\/h[24]>/g;

const headings = [];
let match;
while ((match = headingRegex.exec(html)) !== null) {
  headings.push({
    level: parseInt(match[1]),
    text: match[2].replace(/&#8217;/g, "'").replace(/&#8211;/g, "–").replace(/&#038;/g, "&").replace(/&amp;/g, "&").trim()
  });
}

console.log(`Found ${headings.length} headings total.`);

// ── Build structured menu ─────────────────────────────────────────────────────
// h2 = category, then pairs of h4 = [item_name, price]
const menu = [];
let currentCategory = null;

for (let i = 0; i < headings.length; i++) {
  const h = headings[i];
  
  if (h.level === 2) {
    // It's a category heading
    currentCategory = {
      categoryHu: h.text,
      items: []
    };
    menu.push(currentCategory);
  } else if (h.level === 4 && currentCategory) {
    // Check if this is a price (ends with "Ft" or contains only digits/spaces/Ft)
    const isPricePattern = /^\d[\d\s]*\s*Ft$/i.test(h.text) || /^\d[\d\s.,]*$/.test(h.text);
    
    if (isPricePattern) {
      // This is a price — attach to last item
      if (currentCategory.items.length > 0) {
        const lastItem = currentCategory.items[currentCategory.items.length - 1];
        if (!lastItem.price) {
          lastItem.price = h.text;
        }
      }
    } else {
      // This is a menu item name
      currentCategory.items.push({
        nameEn: h.text,
        price: null
      });
    }
  }
}

// Filter out the first "Étlapunk" heading which is just the page title
const filteredMenu = menu.filter(cat => cat.categoryHu !== 'Étlapunk');

// ── Category translations ─────────────────────────────────────────────────────
const categoryTranslations = {
  'Levesek': { en: 'Soups', de: 'Suppen', hu: 'Levesek' },
  'Konyhafőnök ajánlata': { en: "Chef's Recommendation", de: 'Empfehlung des Küchenchefs', hu: 'Konyhafőnök ajánlata' },
  'Kemencés ételeink': { en: 'Oven-Baked Dishes', de: 'Ofengerichte', hu: 'Kemencés ételeink' },
  'Steakek': { en: 'Steaks', de: 'Steaks', hu: 'Steakek' },
  'Halak': { en: 'Fish', de: 'Fisch', hu: 'Halak' },
  'Tengeri halételek': { en: 'Seafood', de: 'Meeresfrüchte', hu: 'Tengeri halételek' },
  'Egytálételek': { en: 'One-Pot Dishes', de: 'Eintopfgerichte', hu: 'Egytálételek' },
  'Sertéshúsból készült ételek': { en: 'Pork Dishes', de: 'Schweinefleischgerichte', hu: 'Sertéshúsból készült ételek' },
  'Frissensültek': { en: 'Freshly Roasted', de: 'Frisch Gebratenes', hu: 'Frissensültek' },
  'Könnyed ételek a Chef ajánlásával': { en: 'Light Dishes by the Chef', de: 'Leichte Gerichte nach Empfehlung des Chefs', hu: 'Könnyed ételek a Chef ajánlásával' },
  'Tészták': { en: 'Pasta', de: 'Nudeln', hu: 'Tészták' },
  'Saláták': { en: 'Salads', de: 'Salate', hu: 'Saláták' },
  'Mártások': { en: 'Sauces', de: 'Soßen', hu: 'Mártások' },
  'Köretek': { en: 'Side Dishes', de: 'Beilagen', hu: 'Köretek' },
  'Desszertek': { en: 'Desserts', de: 'Desserts', hu: 'Desszertek' },
  'Gyros': { en: 'Gyros', de: 'Gyros', hu: 'Gyros' },
  'Pizzák': { en: 'Pizzas', de: 'Pizzen', hu: 'Pizzák' },
};

// ── Known item translations (HU & DE) ────────────────────────────────────────
// Since the EN page has English item names with HU categories,
// we derive Hungarian and German item names from a translation map.
// For items we can't auto-translate, we'll keep the English name with a note.

const itemTranslationsHu = {
  "Hen meat soup from the farm": "Tanyasi tyúkhúsleves",
  "Garlic soup in bread loaf": "Fokhagymakrémleves cipóban",
  "Goulash from the Hungarian Grat Plain": "Alföldi gulyásleves",
  "Goulash": "Gulyásleves",
  "Strawberry cream soup with vanillia ice cream": "Eper krémleves vaníliafagyival",
  "Lad-catching soup": "Legényfogó leves",
  "Pullet breast in cheese crust with fine herbs and mashed potatoes with pesto": "Csirkemell sajtkéregben fűszernövényekkel, pestós burgonyapürével",
  "Whole trout in American fritter, Marsal salad with buttered parsley potatoes": "Egész pisztráng amerikai bundában, Marsal saláta vajas petrezselymes burgonyával",
  "Tiger shrimp with mashed potatoes and Taisun sauce": "Tigrisrák burgonyapürével és Taisun szósszal",
  "Tenderloin cutlets in Dijon mustard, buttered new-potato, green asparagus": "Bélszínszeletek Dijon mustárban, vajas újburgonya, zöld spárga",
  "Fried frog's leg with Belgian sauce and roast potatoes": "Sült békacomb belga szósszal és sült burgonyával",
  "Knuckle of Lamb with steak potato": "Báránycsonk steak burgonyával",
  "Knuckle of Veal with steak potato": "Borjúcsülök steak burgonyával",
  "Knuckle of pork with steak potato ( 2 persons )": "Sertéscsülök steak burgonyával (2 személyes)",
  "Gourmet mixed salad with strips of sirloin": "Gourmet vegyes saláta bélszíncsíkokkal",
  "Farm-style goose leg with candied fruits and potato lightly fried in goose dripping": "Tanyasi libacomb kandírozott gyümölcsökkel és libazsírban enyhén sült burgonyával",
  "Pullet breast steak in smoked peachy cheese sauce, served with potato croquet": "Csirkemell steak füstölt barackos sajt szósszal, burgonyakrokettával",
  "Wild slices covered with Argentinean green pea topping, served with steak potato": "Vadszelet argentín zöldborsó feltéttel, steak burgonyával",
  "Crispy roast of piglet with potato made with bacon and onion": "Ropogós malac sült szalonnás-hagymás burgonyával",
  "Slice of Carp with mustard in a crust of condiments served with grilled vegetables": "Pontyérme mustáros fűszerkéregben grillezett zöldségekkel",
  "Venison feast with the chef's recommendation": "Vadlakoma a séf ajánlásával",
  "Crispy rib-roast with garlic": "Ropogós fokhagymás oldalas",
  "Roasted duck served with braised cabbage and apple": "Sült kacsa párolt káposztával és almával",
  "Tenderloin steak Budapest style": "Bélszínsteak Budapest módra",
  "Tenderloin steak with bone marrow and fried onion": "Bélszínsteak velővel és sült hagymával",
  "Tenderloin steak grilled with garlic butter": "Bélszínsteak grillezve fokhagymás vajjal",
  "Tenderloin steak with goose liver and red wine sauce": "Bélszínsteak libamájjal és vörösbor szósszal",
  "Catfish fillet in lemon butter with roasted vegetables": "Harcsafilé citromvajas zöldségekkel",
  "Catfish fillet with garlic and parsley sauce": "Harcsafilé fokhagymás petrezselymes szósszal",
  "Trout fillet with almond and butter sauce": "Pisztrángfilé mandulás vajas szósszal",
  "Fried carp fillet": "Sült pontyfilé",
  "Pike perch with Mediterranean vegetables": "Süllő mediterrán zöldségekkel",
  "Octopus with grilled vegetables": "Polip grillezett zöldségekkel",
  "Shrimp on skewer": "Ráknyárs",
  "Salmon steak with spinach cream": "Lazacsteak spenótkrémmel",
  "Pork chop Ramirez style": "Sertésborda Ramirez módra",
  "Pork tenderloin medallions with mushroom sauce": "Sertésbélszín medaljok gombaszósszal",
  "Wiener schnitzel with potato salad": "Bécsi szelet burgonyasalátával",
  "Grilled chicken breast with vegetables": "Grillezett csirkemell zöldségekkel",
  "Chicken paprikash with dumplings": "Csirkepaprikás galuskával",
  "Spaghetti Bolognese": "Spagetti Bolognese",
  "Penne with chicken and pesto": "Penne csirkével és pestóval",
  "Tagliatelle with seafood": "Tagliatelle tengeri gyümölcsökkel",
  "Caesar salad": "Caesar saláta",
  "Greek salad": "Görög saláta",
  "Mixed salad": "Vegyes saláta",
  "French fries": "Hasábburgonya",
  "Mashed potato": "Burgonyapüré",
  "Rice": "Rizs",
  "Steamed vegetables": "Párolt zöldségek",
  "Grilled vegetables": "Grillezett zöldségek",
  "Steak potato": "Steak burgonya",
  "Potato croquettes": "Burgonyakrokett",
  "Mushroom sauce": "Gomba szósz",
  "Pepper sauce": "Bors szósz",
  "Garlic sauce": "Fokhagymás szósz",
  "Somlói Galuska": "Somlói galuska",
  "Túró Gombóc": "Túrógombóc",
  "Palacsinta": "Palacsinta",
  "Crème brûlée": "Crème brûlée",
  "Gyros plate": "Gyros tál",
  "Gyros in pita": "Gyros pitában",
  "Margherita": "Margherita",
  "Quattro formaggi": "Quattro formaggi",
  "Prosciutto e funghi": "Prosciutto e funghi",
  "Diavola": "Diavola",
  "Capricciosa": "Capricciosa",
  "Hawaii": "Hawaii"
};

const itemTranslationsDe = {
  "Hen meat soup from the farm": "Hühnerfleischsuppe vom Bauernhof",
  "Garlic soup in bread loaf": "Knoblauchcremesuppe im Brotlaib",
  "Goulash from the Hungarian Grat Plain": "Gulasch aus der ungarischen Tiefebene",
  "Goulash": "Gulasch",
  "Strawberry cream soup with vanillia ice cream": "Erdbeercremesuppe mit Vanilleeis",
  "Lad-catching soup": "Jungfernsuppe",
  "Pullet breast in cheese crust with fine herbs and mashed potatoes with pesto": "Hähnchenbrust in Käsekruste mit feinen Kräutern und Kartoffelpüree mit Pesto",
  "Whole trout in American fritter, Marsal salad with buttered parsley potatoes": "Ganze Forelle im Bierteig, Marsal-Salat mit Petersilienkartoffeln",
  "Tiger shrimp with mashed potatoes and Taisun sauce": "Tigergarnelen mit Kartoffelpüree und Taisun-Sauce",
  "Tenderloin cutlets in Dijon mustard, buttered new-potato, green asparagus": "Lendenschnitzel in Dijon-Senf, neue Butterkartoffeln, grüner Spargel",
  "Fried frog's leg with Belgian sauce and roast potatoes": "Gebratene Froschschenkel mit belgischer Sauce und Bratkartoffeln",
  "Knuckle of Lamb with steak potato": "Lammhaxe mit Steakkartoffeln",
  "Knuckle of Veal with steak potato": "Kalbshaxe mit Steakkartoffeln",
  "Knuckle of pork with steak potato ( 2 persons )": "Schweinshaxe mit Steakkartoffeln (2 Personen)",
  "Gourmet mixed salad with strips of sirloin": "Gourmet-Salat mit Rinderfiletstreifen",
  "Farm-style goose leg with candied fruits and potato lightly fried in goose dripping": "Gänsekeule nach Bauernart mit kandierten Früchten und in Gänsefett gebratenen Kartoffeln",
  "Pullet breast steak in smoked peachy cheese sauce, served with potato croquet": "Hähnchenbrust-Steak in geräucherter Pfirsich-Käsesauce mit Kartoffelkroketten",
  "Wild slices covered with Argentinean green pea topping, served with steak potato": "Wildscheiben mit argentinischem Erbsentopping und Steakkartoffeln",
  "Crispy roast of piglet with potato made with bacon and onion": "Knuspriger Spanferkelbraten mit Speck-Zwiebel-Kartoffeln",
  "Slice of Carp with mustard in a crust of condiments served with grilled vegetables": "Karpfenscheibe in Senfkruste mit gegrilltem Gemüse",
  "Venison feast with the chef's recommendation": "Wildfestmahl nach Empfehlung des Küchenchefs",
  "Crispy rib-roast with garlic": "Knusprige Spareribs mit Knoblauch",
  "Roasted duck served with braised cabbage and apple": "Gebratene Ente mit geschmortem Kohl und Apfel",
  "Tenderloin steak Budapest style": "Rinderfiletsteak Budapester Art",
  "Tenderloin steak with bone marrow and fried onion": "Rinderfiletsteak mit Knochenmark und gebratenen Zwiebeln",
  "Tenderloin steak grilled with garlic butter": "Rinderfiletsteak gegrillt mit Knoblauchbutter",
  "Tenderloin steak with goose liver and red wine sauce": "Rinderfiletsteak mit Gänseleber und Rotweinsauce",
  "Catfish fillet in lemon butter with roasted vegetables": "Welsfilet in Zitronenbutter mit geröstetem Gemüse",
  "Catfish fillet with garlic and parsley sauce": "Welsfilet mit Knoblauch-Petersilien-Sauce",
  "Trout fillet with almond and butter sauce": "Forellenfilet mit Mandel-Butter-Sauce",
  "Fried carp fillet": "Gebratenes Karpfenfilet",
  "Pike perch with Mediterranean vegetables": "Zander mit mediterranem Gemüse",
  "Octopus with grilled vegetables": "Oktopus mit gegrilltem Gemüse",
  "Shrimp on skewer": "Garnelenspieß",
  "Salmon steak with spinach cream": "Lachssteak mit Spinatcreme",
  "Pork chop Ramirez style": "Schweinekotelett nach Ramirez-Art",
  "Pork tenderloin medallions with mushroom sauce": "Schweinefilet-Medaillons mit Pilzsauce",
  "Wiener schnitzel with potato salad": "Wiener Schnitzel mit Kartoffelsalat",
  "Grilled chicken breast with vegetables": "Gegrillte Hähnchenbrust mit Gemüse",
  "Chicken paprikash with dumplings": "Hühnerpaprikasch mit Nockerl",
  "Spaghetti Bolognese": "Spaghetti Bolognese",
  "Penne with chicken and pesto": "Penne mit Hähnchen und Pesto",
  "Tagliatelle with seafood": "Tagliatelle mit Meeresfrüchten",
  "Caesar salad": "Caesar-Salat",
  "Greek salad": "Griechischer Salat",
  "Mixed salad": "Gemischter Salat",
  "French fries": "Pommes frites",
  "Mashed potato": "Kartoffelpüree",
  "Rice": "Reis",
  "Steamed vegetables": "Gedünstetes Gemüse",
  "Grilled vegetables": "Gegrilltes Gemüse",
  "Steak potato": "Steakkartoffeln",
  "Potato croquettes": "Kartoffelkroketten",
  "Mushroom sauce": "Pilzsauce",
  "Pepper sauce": "Pfeffersauce",
  "Garlic sauce": "Knoblauchsauce",
  "Somlói Galuska": "Somlói Galuska",
  "Túró Gombóc": "Túró Gombóc",
  "Palacsinta": "Palatschinken",
  "Crème brûlée": "Crème brûlée",
  "Gyros plate": "Gyros-Teller",
  "Gyros in pita": "Gyros im Pitabrot",
  "Margherita": "Margherita",
  "Quattro formaggi": "Quattro formaggi",
  "Prosciutto e funghi": "Prosciutto e funghi",
  "Diavola": "Diavola",
  "Capricciosa": "Capricciosa",
  "Hawaii": "Hawaii"
};

// ── Build the JSON locale files ───────────────────────────────────────────────

function buildLocaleJson(locale) {
  const result = {
    meta: {
      locale: locale,
      restaurantName: "Ramirez Restaurant",
      currency: "Ft",
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    nav: {},
    menu: {
      pageTitle: "",
      categories: []
    }
  };

  // Navigation translations
  const navTranslations = {
    en: { home: "Homepage", menu: "Menu", about: "About Us", contact: "Contact", reservation: "Reservation" },
    hu: { home: "Főoldal", menu: "Étlapunk", about: "Rólunk", contact: "Kapcsolat", reservation: "Foglalás" },
    de: { home: "Startseite", menu: "Speisekarte", about: "Über uns", contact: "Kontakt", reservation: "Reservierung" }
  };
  
  const pageTitles = {
    en: "Our Menu",
    hu: "Étlapunk",
    de: "Speisekarte"
  };

  result.nav = navTranslations[locale];
  result.menu.pageTitle = pageTitles[locale];

  for (const cat of filteredMenu) {
    const catKey = cat.categoryHu;
    const translation = categoryTranslations[catKey];
    
    const categoryObj = {
      name: translation ? translation[locale] : catKey,
      slug: (translation ? translation.en : catKey).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      items: []
    };

    for (const item of cat.items) {
      let itemName;
      if (locale === 'en') {
        itemName = item.nameEn;
      } else if (locale === 'hu') {
        itemName = itemTranslationsHu[item.nameEn] || item.nameEn;
      } else if (locale === 'de') {
        itemName = itemTranslationsDe[item.nameEn] || item.nameEn;
      }
      
      categoryObj.items.push({
        name: itemName,
        price: item.price || ""
      });
    }

    result.menu.categories.push(categoryObj);
  }

  return result;
}

// ── Write output ──────────────────────────────────────────────────────────────
const outputDir = path.join(__dirname, 'public', 'locales');
fs.mkdirSync(outputDir, { recursive: true });

const locales = ['en', 'hu', 'de'];

for (const locale of locales) {
  const data = buildLocaleJson(locale);
  const filePath = path.join(outputDir, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✅ Written: ${filePath}`);
  console.log(`   Categories: ${data.menu.categories.length}`);
  console.log(`   Total items: ${data.menu.categories.reduce((sum, c) => sum + c.items.length, 0)}`);
}

// ── Print summary ─────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log('📋 SCRAPED MENU SUMMARY');
console.log('═'.repeat(60));

const enData = buildLocaleJson('en');
for (const cat of enData.menu.categories) {
  console.log(`\n📂 ${cat.name} (${cat.items.length} items)`);
  for (const item of cat.items) {
    console.log(`   • ${item.name} — ${item.price}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('✅ All locale files generated successfully!');
console.log('═'.repeat(60));
