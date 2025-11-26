export default async function planTrip(req, res) {
  try {
    const { city, days, budget, style } = req.body;

    if (!city || !days || !budget) {
      return res.status(400).json({ ok: false, error: "Trūksta duomenų" });
    }

    const cityKey = String(city).toLowerCase();

    const cityProfiles = {
      "vilnius":   { level: "pigesnis miestas", baseDay: 60 },
      "kaunas":    { level: "pigesnis miestas", baseDay: 55 },
      "riga":      { level: "pigesnis miestas", baseDay: 60 },
      "ryga":      { level: "pigesnis miestas", baseDay: 60 },
      "barcelona": { level: "vidutinio brangumo miestas", baseDay: 85 },
      "barceloną": { level: "vidutinio brangumo miestas", baseDay: 85 },
      "london":    { level: "brangus miestas", baseDay: 110 },
      "londonas":  { level: "brangus miestas", baseDay: 110 },
      "paris":     { level: "brangus miestas", baseDay: 105 },
      "paryžius":  { level: "brangus miestas", baseDay: 105 },
      "paryzius":  { level: "brangus miestas", baseDay: 105 }
    };

    const defaultProfile = { level: "vidutinio brangumo miestas", baseDay: 80 };
    const profile = cityProfiles[cityKey] || defaultProfile;

    // stiliaus įtaka
    let factor = 1;
    let styleText;
    if (style === "budget") {
      factor = 0.9;
      styleText = "taupus (pigiai)";
    } else if (style === "comfort") {
      factor = 1.15;
      styleText = "komfortiškas";
    } else {
      styleText = "balansuotas";
    }

    const recommendedDayBudget = Math.round(profile.baseDay * factor);
    const realDayBudget = budget / days;

    // biudžeto įvertinimas
    const ratio = realDayBudget / recommendedDayBudget;
    let budgetAnalysis;
    let budgetTier; // pigus / subalansuotas / komfortiškas

    if (ratio < 0.8) {
      budgetAnalysis = "Tavo biudžetas šiam miestui yra gana taupus – reikės daugiau planuoti maistą ir veiklas.";
      budgetTier = "low";
    } else if (ratio <= 1.2) {
      budgetAnalysis = "Tavo biudžetas šiam miestui atrodo subalansuotas – galėsi keliauti gana patogiai.";
      budgetTier = "medium";
    } else {
      budgetAnalysis = "Tavo biudžetas šiam miestui gana komfortiškas – galėsi sau leisti daugiau veiklų ir geresnį maistą.";
      budgetTier = "high";
    }

    // procentai
    const pct = { food: 0.45, transport: 0.15, fun: 0.4 };

    // rekomendacijų šablonai pagal biudžeto lygį
    const recsByTier = {
      low: {
        food: [
          "Rinkis vietines užeigas su dienos pietų pasiūlymais.",
          "Pirk užkandžius maisto prekių parduotuvėse, o ne turistiniuose baruose.",
          "Venk restoranų pagrindinėse turistinėse gatvėse – eik 2–3 kvartalus toliau."
        ],
        hotels: [
          "Ieškok hostelio arba paprasto svečių namo šiekliau nuo centro.",
          "Rinkis kambario dalinimąsi su kitais (shared room), jei tau tinka.",
          "Tikrink pasiūlymus su įskaičiuotais pusryčiais – taip sutaupysi maistui."
        ],
        transport: [
          "Pirk viešojo transporto dienos ar kelių dienų bilietus.",
          "Vaikščiok pėsčiomis, ypač centre – čia daug ką pasieksi be transporto.",
          "Venk taksi – jei reikia, naudok viešąjį transportą ar dalijimosi paslaugas."
        ],
        fun: [
          "Rinkis nemokamus muziejus, parkus, paplūdimius ar apžvalgos taškus.",
          "Patikrink, ar yra „nemokamos ekskursijos už arbatpinigius“ (free walking tours).",
          "Vakarais tiesiog pasivaikščiok per centrą ir apylinkes – tai nieko nekainuoja."
        ]
      },
      medium: {
        food: [
          "Derink vietines kavinukes su 1–2 geresniais restoranų apsilankymais.",
          "Rinkis dienos pietus ir vakarienei – šiek tiek aukštesnio lygio vietą.",
          "Išbandyk bent vieną vietą, kuri garsėja vietine virtuve ar vaizdu."
        ],
        hotels: [
          "Rinkis 2–3 žvaigždučių viešbutį ar apartamentus netoli centro.",
          "Stebėk pasiūlymus, kuriuose įskaičiuoti pusryčiai.",
          "Jei keliauji su draugu, pasidalinkite dvivietį kambarį – taip gausis pigiau vienam."
        ],
        transport: [
          "Derink viešąjį transportą su retkarčiais naudojamomis ride-share paslaugomis.",
          "Jei miestas kompaktiškas – vaikščiok pėsčiomis, bet turėk bilietą ilgesniems atstumams.",
          "Pasitikrink, ar nėra turistinės kortelės, kurioje įskaičiuotas transportas + lankytinos vietos."
        ],
        fun: [
          "Planuok 1–2 didesnes mokamas veiklas (pvz., muziejus, atrakcionai, ekskursija).",
          "Skirk laiko ir nemokamiems objektams – parkai, senamiestis, apžvalgos taškai.",
          "Vakare nueik į vietinį barą ar terasą su vaizdu į miestą."
        ]
      },
      high: {
        food: [
          "Išbandyk kelis rekomenduojamus restoranus su degustaciniu meniu.",
          "Leisk sau pavakarieniauti vietose su gražiu vaizdu (stogas, pakrantė).",
          "Skirk didesnę biudžeto dalį vietinei virtuvei ir specialiems patyrimų restoranams."
        ],
        hotels: [
          "Rinkis 4* ar boutique viešbučius patogioje ir saugioje lokacijoje.",
          "Pagalvok apie viešbutį su spa, baseinu ar vaizdu į miestą.",
          "Jei kelionė trumpa, geriau rinktis patogesnę vietą arčiau centro."
        ],
        transport: [
          "Jei reikia – naudok taksi arba ride-share, kad sutaupytum laiko.",
          "Svarbesniems objektams galima rinktis organizuotas ekskursijas su transportu.",
          "Viešąjį transportą naudok, kai patogu, bet nereikia griežtai taupyti."
        ],
        fun: [
          "Planuok mokamas ekskursijas, temines keliones ar pramogas (pvz., pasiplaukiojimą, šou).",
          "Skirk dalį biudžeto spontaniškoms veikloms, kurias atrasite vietoje.",
          "Apsilankyk geresniuose baruose ar renginiuose, kurie domina būtent tave."
        ]
      }
    };

    const tierRecs = recsByTier[budgetTier] || recsByTier.medium;

    const suggestedActivities = [
      ...tierRecs.fun.slice(0, 2),
      ...tierRecs.food.slice(0, 1)
    ];

    const daysPlan = [
      {
        day: 1,
        plan: "Pirmą dieną skirk senamiesčiui ir pagrindinėms miesto vietoms pėsčiomis. Valgyk vietinėse kavinėse, vakare susirask apžvalgos tašką su vaizdu."
      },
      {
        day: 2,
        plan: "Antrą dieną išbandyk vieną mokamą veiklą (muziejus, atrakcionas ar ekskursija) ir skirk laiko pasivaikščiojimams palei parkus, upę ar pakrantę."
      }
    ];

    const aiData = {
      cityLevel: profile.level,
      recommendedDayBudget,
      pct,
      budgetAnalysis,
      suggestedActivities,
      daysPlan,
      suggestions: {
        food: tierRecs.food,
        hotels: tierRecs.hotels,
        transport: tierRecs.transport,
        fun: tierRecs.fun
      }
    };

    return res.json({
      ok: true,
      input: { city, days, budget, style, styleText },
      ai: aiData
    });
  } catch (err) {
    console.error("Pseudo-AI klaida:", err);
    return res.status(500).json({ ok: false, error: "Serverio klaida" });
  }
}
