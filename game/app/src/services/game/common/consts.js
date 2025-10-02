// ! Mdb
export const RoomConnectionTimeout = Number(process.env.ROOMCONNECTIONTIMEOUT) ? Number(process.env.ROOMCONNECTIONTIMEOUT) : 60000;
export const TournamentTimeout = Number(process.env.TOURNAMENTTIMEOUT) ? Number(process.env.TOURNAMENTTIMEOUT) : 900000;
export const InvitationTimeout = Number(process.env.INVITATIONTIMEOUT) ? Number(process.env.INVITATIONTIMEOUT) : 60000;
// ! Pong
export const Friction = Number(process.env.FRICTION) ? Number(process.env.FRICTION) : 0.05;
export const FinalScore = Number(process.env.FINALSCORE) ? Number(process.env.FINALSCORE) : 7;
export const PongWidth = Number(process.env.PONGWIDTH) ? Number(process.env.PONGWIDTH) : 800;
export const PongHeight = Number(process.env.PONGHEIGHT) ? Number(process.env.PONGHEIGHT) : 600;
export const BallRadius = Number(process.env.BALLRADIUS) ? Number(process.env.BALLRADIUS) : 10;
export const BallVelocity = Number(process.env.BALLVELOCITY) ? Number(process.env.BALLVELOCITY) : 8;
export const PaddleRadius = Number(process.env.PADDLERADIUS) ? Number(process.env.PADDLERADIUS) : 10;
export const PaddleHeight = Number(process.env.PADDLEHEIGHT) ? Number(process.env.PADDLEHEIGHT) : 60;
export const PaddleDistance = Number(process.env.PADDLEDISTANCE) ? Number(process.env.PADDLEDISTANCE) : 10;
// ! Doom
export const CardsNum = Number(process.env.CARDSNUM) ? Number(process.env.CARDSNUM) : 25;
export const DoomTimeLimite = Number(process.env.DOOMTIMELIMITE) ? Number(process.env.DOOMTIMELIMITE) : 10000;
