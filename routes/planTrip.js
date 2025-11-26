import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function planTrip(req, res) {
  try {
    const { city, days, budget, style } = req.body;

    if (!city || !days || !budget) {
      return res.status(400).json({ error: "Trūksta duomenų" });
    }

    const prompt = `
      Tu esi kelionių biudžeto ir planavimo AI asistentas.

      Miestas: ${city}
      Dienų skaičius: ${days}
      Biudžetas: ${budget} €
      Kelionės stilius: ${style}

      1) Įvertink miesto kainų lygį (pigus / vidutinis / brangus).
      2) Pasiūlyk rekomenduojamą dienos biudžetą šiam miestui.
      3) Pateik maisto, transporto ir veiklų procentinį paskirstymą.
      4) Įvertink, ar keliautojo biudžetas yra taupus / subalansuotas / komfortiškas.
      5) Pasiūlyk 3 paprastas veiklas tame mieste pagal pasirinktą stilių.
      6) Sugeneruok 2 dienų planą su kasdienėmis, realistiškomis veiklomis.

      Atsakyk TIK JSON formatu:
      {
        "cityLevel": "",
        "recommendedDayBudget": 0,
        "pct": { "food": 0, "transport": 0, "fun": 0 },
        "budgetAnalysis": "",
        "suggestedActivities": [ "...", "...", "..." ],
        "daysPlan": [
          { "day": 1, "plan": "..." },
          { "day": 2, "plan": "..." }
        ]
      }
    `;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      response_format: { type: "json_object" },
    });

    const text = response.output[0].content[0].text;
    const aiData = JSON.parse(text);

    return res.json({
      ok: true,
      input: { city, days, budget, style },
      ai: aiData,
    });
  } catch (err) {
    console.error("AI klaida:", err);
    return res.status(500).json({
      error: "AI serverio klaida",
    });
  }
}
