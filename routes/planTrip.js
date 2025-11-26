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

    if (ratio < 0.8) {
      budgetAnalysis = "Tavo biudžetas šiam miestui yra gana taupus – reikės daugiau planuoti maistą ir veiklas.";
    } else if (ratio <= 1.2) {
      budgetAnalysis = "Tavo biudžetas šiam miestui atrodo subalansuotas – galėsi keliauti gana patogiai.";
    } else {
      budgetAnalysis = "Tavo biudžetas šiam miestui gana komfortiškas – galėsi sau leisti daugiau veiklų ir geresnį maistą.";
    }

    // procentai
    const pct = { food: 0.45, transport: 0.15, fun: 0.4 };

    // veiklos pagal stilių
    let suggestedActivities;
    if (style === "budget") {
      suggestedActivities = [
        "Nemokami miesto pasivaikščiojimo maršrutai (old town, parkai, pakrantės)",
        "Vietinės kavinės su dienos pietų pasiūlymais",
        "Nemokami muziejų ar apžvalgos taškų laikai (jei yra mieste)"
      ];
    } else if (style === "comfort") {
      suggestedActivities = [
        "Restoranai su gražiu vaizdu ir vietine virtuve",
        "Patogesnis viešasis transportas arba miesto kortelė",
        "Vakariniai pasivaikščiojimai ir barai su kokteiliais"
      ];
    } else {
      suggestedActivities = [
        "Miesto centrinės vietos ir nemokami objektai",
        "1–2 mokami muziejai ar atrakcionai",
        "Ramesnės vietinės kavinės ir vakarinė panorama"
      ];
    }

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
      daysPlan
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
