const cron = require("node-cron");
const { resolveDuePolls } = require("../services/managerPollService");

/**
 * Runs every minute: closes any manager-election poll whose 24h window has
 * elapsed and applies its result (see managerPollService.resolvePoll).
 */
function startManagerPollJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const n = await resolveDuePolls();
      if (n) console.log(`[manager-poll] ${n} sondaj(e) încheiat(e).`);
    } catch (err) {
      console.error("[manager-poll] Eroare:", err);
    }
  });
  console.log("[manager-poll] Pornit — verifică sondajele de manager în fiecare minut.");
}

module.exports = { startManagerPollJob };
