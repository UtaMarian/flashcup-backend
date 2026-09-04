const cron = require("node-cron");
const prisma = require("../config/db");

const DAY_MS = 24 * 60 * 60 * 1000;

/** Daily cash grant scales with level; the token grant is flat for everyone. */
function dailyCashForLevel(level) {
  return 20 + level * 5;
}

async function grantDailyBonuses() {
  const now = new Date();
  const due = await prisma.user.findMany({
    where: { lastDailyBonusAt: { lte: new Date(now.getTime() - DAY_MS) } },
    select: { id: true, level: true, cash: true, tokens: true },
  });

  for (const u of due) {
    await prisma.user.update({
      where: { id: u.id },
      data: {
        cash: u.cash + dailyCashForLevel(u.level),
        tokens: u.tokens + 1,
        lastDailyBonusAt: now,
      },
    });
  }
}

function startDailyBonusJob() {
  cron.schedule("*/15 * * * *", async () => {
    try {
      await grantDailyBonuses();
    } catch (err) {
      console.error("[daily-bonus] Eroare:", err);
    }
  });

  console.log("[daily-bonus] Pornit — acordă bonusul zilnic (cash + 1 token) la fiecare 24h per jucător.");
}

module.exports = { startDailyBonusJob, dailyCashForLevel };
