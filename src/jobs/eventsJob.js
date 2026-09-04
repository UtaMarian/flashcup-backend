const cron = require("node-cron");
const { syncEventStatuses } = require("../services/eventsService");

/**
 * Runs every minute: advances event lifecycle by wall-clock time —
 * SCHEDULED → ACTIVE once startsAt passes, ACTIVE → ENDED once endsAt does.
 * Read paths also do this lazily; this job keeps the admin list and the
 * player banner honest even when nobody is hitting those endpoints.
 */
function startEventsJob() {
  cron.schedule("* * * * *", async () => {
    try {
      await syncEventStatuses();
    } catch (err) {
      console.error("[events] Eroare:", err);
    }
  });

  console.log("[events] Pornit — sincronizează stările evenimentelor în fiecare minut.");
}

module.exports = { startEventsJob };
