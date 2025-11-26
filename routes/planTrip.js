export default async function planTrip(req, res) {
  try {
    const { city, days, budget, style } = req.body;

    res.json({
      ok: true,
      message: "Backend veikia! AI dar neprijungtas.",
      input: { city, days, budget, style }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverio klaida" });
  }
}
