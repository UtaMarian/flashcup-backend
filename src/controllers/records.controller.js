const prisma = require("../config/db");
const seasonService = require("../services/seasonService");

const TAKE = 10;
const PLAYER_SELECT = {
  id: true, firstName: true, lastName: true, teamId: true, level: true,
  totalGoals: true, totalAssists: true, totalMatches: true,
};

// GET /api/records — all-time leaderboards, real players only (isBot excluded).
async function getRecords(req, res, next) {
  try {
    const [topScorers, topAssists, topMatches] = await Promise.all([
      prisma.user.findMany({ where: { isBot: false, totalGoals: { gt: 0 } }, orderBy: { totalGoals: "desc" }, take: TAKE, select: PLAYER_SELECT }),
      prisma.user.findMany({ where: { isBot: false, totalAssists: { gt: 0 } }, orderBy: { totalAssists: "desc" }, take: TAKE, select: PLAYER_SELECT }),
      prisma.user.findMany({ where: { isBot: false, totalMatches: { gt: 0 } }, orderBy: { totalMatches: "desc" }, take: TAKE, select: PLAYER_SELECT }),
    ]);
    res.json({ topScorers, topAssists, topMatches });
  } catch (err) {
    next(err);
  }
}

// GET /api/records/team-influence — global stats-only leaderboard: the top
// 20 teams by total crowd influence contributed this season, plus the
// season-close prize tiers.
async function getTeamInfluenceBoard(req, res, next) {
  try {
    const season = await prisma.season.findFirst({ where: { status: "ACTIVE" }, orderBy: { number: "desc" } });
    if (!season) return res.json({ season: null, teams: [], prizes: seasonService.TEAM_INFLUENCE_PRIZES });

    const teams = await seasonService.seasonTeamInfluenceBoard(season.id, 20);
    res.json({ season: { number: season.number }, teams, prizes: seasonService.TEAM_INFLUENCE_PRIZES });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecords, getTeamInfluenceBoard };
