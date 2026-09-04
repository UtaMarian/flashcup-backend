const cron = require("node-cron");
const { simulateDueMatches } = require("../services/matchService");

/**
 * Runs every minute: finds every SCHEDULED match whose scheduledAt is in
 * the past and simulates it. This is what turns the fixture list generated
 * by POST /api/leagues/:id/start into actual results automatically, without
 * any manual admin action.
 */
function startMatchScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const played = await simulateDueMatches();
      if (played.length) {
        console.log(`[match-scheduler] Simulate ${played.length} meci(uri) ajuns(e) la ora de start.`);
      }
    } catch (err) {
      console.error("[match-scheduler] Eroare:", err);
    }
  });

  console.log("[match-scheduler] Pornit — verifică meciurile programate în fiecare minut.");
}

module.exports = { startMatchScheduler };
