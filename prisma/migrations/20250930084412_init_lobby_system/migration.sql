-- CreateEnum
CREATE TYPE "public"."LobbyStatus" AS ENUM ('waiting', 'ready');

-- CreateEnum
CREATE TYPE "public"."PlayerRole" AS ENUM ('player', 'spectator');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- CreateTable
CREATE TABLE "public"."lobbies" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "hostAddress" VARCHAR(255) NOT NULL,
    "status" "public"."LobbyStatus" NOT NULL DEFAULT 'waiting',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivity" TIMESTAMP(3) NOT NULL,
    "currentMatch" VARCHAR(255),

    CONSTRAINT "lobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lobby_players" (
    "id" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,
    "playerAddress" VARCHAR(255) NOT NULL,
    "role" "public"."PlayerRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lobby_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_messages" (
    "id" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,
    "playerAddress" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invitations" (
    "id" TEXT NOT NULL,
    "fromPlayerAddress" VARCHAR(255) NOT NULL,
    "toPlayerAddress" VARCHAR(255) NOT NULL,
    "lobbyCode" VARCHAR(6) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lobbies_code_key" ON "public"."lobbies"("code");

-- CreateIndex
CREATE INDEX "lobbies_code_idx" ON "public"."lobbies"("code");

-- CreateIndex
CREATE INDEX "lobbies_hostAddress_idx" ON "public"."lobbies"("hostAddress");

-- CreateIndex
CREATE INDEX "lobbies_lastActivity_idx" ON "public"."lobbies"("lastActivity");

-- CreateIndex
CREATE INDEX "lobby_players_lobbyId_idx" ON "public"."lobby_players"("lobbyId");

-- CreateIndex
CREATE INDEX "lobby_players_playerAddress_idx" ON "public"."lobby_players"("playerAddress");

-- CreateIndex
CREATE INDEX "chat_messages_lobbyId_idx" ON "public"."chat_messages"("lobbyId");

-- CreateIndex
CREATE INDEX "chat_messages_timestamp_idx" ON "public"."chat_messages"("timestamp");

-- CreateIndex
CREATE INDEX "invitations_toPlayerAddress_status_idx" ON "public"."invitations"("toPlayerAddress", "status");

-- CreateIndex
CREATE INDEX "invitations_lobbyCode_idx" ON "public"."invitations"("lobbyCode");

-- CreateIndex
CREATE INDEX "invitations_timestamp_idx" ON "public"."invitations"("timestamp");

-- AddForeignKey
ALTER TABLE "public"."lobby_players" ADD CONSTRAINT "lobby_players_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "public"."lobbies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_messages" ADD CONSTRAINT "chat_messages_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "public"."lobbies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
