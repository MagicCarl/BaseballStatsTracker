-- Runs that crossed the plate on each play, separate from RBI.
ALTER TABLE "at_bats" ADD COLUMN "runs_scored" INTEGER NOT NULL DEFAULT 0;

-- Where each runner ended up on the play, and the batting-order spot.
ALTER TABLE "at_bats" ADD COLUMN "runner_moves" JSONB;
ALTER TABLE "at_bats" ADD COLUMN "lineup_spot" INTEGER;

-- Plays that move runners without finishing an at-bat.
CREATE TABLE "base_plays" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "inning" INTEGER NOT NULL,
    "is_top" BOOLEAN NOT NULL,
    "is_our_team" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "runner_moves" JSONB NOT NULL,
    "extra_outs" INTEGER NOT NULL DEFAULT 0,
    "extra_runs" INTEGER NOT NULL DEFAULT 0,
    "runs_scored" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "base_plays_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "base_plays_game_id_idx" ON "base_plays"("game_id");
ALTER TABLE "base_plays" ADD CONSTRAINT "base_plays_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Home runs were saved with 0 RBI and often without "scored", so they never counted.
UPDATE "at_bats" SET "rbi" = GREATEST("rbi", 1), "runner_scored" = true WHERE "result" = 'home_run';

-- Before this column, a run was only recorded as RBI or the batter's "scored" flag.
UPDATE "at_bats" SET "runs_scored" = GREATEST("rbi", CASE WHEN "runner_scored" THEN 1 ELSE 0 END);

-- Bring each game's score in line with its at-bats.
UPDATE "games" g SET
  "our_score" = COALESCE((SELECT SUM(a."runs_scored") FROM "at_bats" a WHERE a."game_id" = g."id" AND a."player_id" IS NOT NULL), 0),
  "opponent_score" = COALESCE((SELECT SUM(a."runs_scored") FROM "at_bats" a WHERE a."game_id" = g."id" AND a."player_id" IS NULL), 0);
