require("dotenv").config();

const app = require("./app");
const { startMatchScheduler } = require("./jobs/matchScheduler");
const { startEnergyRegenJob } = require("./jobs/energyJob");
const { startManagerPollJob } = require("./jobs/managerPollJob");
const { startEventsJob } = require("./jobs/eventsJob");

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Flash Cup API rulează pe http://localhost:${PORT}`);
  startMatchScheduler();
  startEnergyRegenJob();
  // Daily gift is now a manual claim from the Shop (players.controller claimDailyGift) —
  // the old auto-grant job (jobs/dailyBonusJob.js) is no longer scheduled.
  startManagerPollJob();
  startEventsJob();
});
