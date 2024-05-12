const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

app.use(express.json())

const dbPath = path.join(__dirname, 'cricketMatchDetails.db')

db = null

const initilizeDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })
  app.listen(3000, () => {
    console.log('Server Running at http://localhost:3000/')
  })
}

initilizeDbAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT * 
  FROM player_details
  ORDER BY player_id`
  const playerArray = await db.all(getPlayersQuery)
  response.send(playerArray)
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT * 
  FROM player_details
  WHERE player_id = ${playerId}`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerName} = request.body
  const {playerId} = request.params
  const updatePlayerQuery = `
  UPDATE player_details
  SET player_name = '${playerName}'
  WHERE player_id = ${playerId}`
  const dbResponse = await db.run(updatePlayerQuery)
  response.send('Movie Successfully Added')
})

app.get('/matches/:matchId/', async (request, response) => {
  const {matchId} = request.params
  const getMatchQuery = `SELECT * 
  FROM match_details
  WHERE match_id = ${matchId}`
  const matchDetail = await db.get(getMatchQuery)
  response.send(matchDetail)
})

app.get('/players/:playerId/matches', async (request, response) => {
  const {playerId} = request.params
  const getPlayerMatchQuery = `
  SELECT match_details.match_id ,match_details.match,match_details.year
  FROM match_details INNER JOIN player_match_score 
  WHERE player_id = ${playerId}`
  const playerMatchDetail = await db.all(getPlayerMatchQuery)
  response.send(playerMatchDetail)
})

app.get('/matches/:matchId/players', async (request, response) => {
  const {matchId} = request.params
  const getPlayerMatcPlayerhQuery = `
  SELECT player_match_score.match_id, player_match_score.match, player_details.year
  FROM match_details INNER JOIN player_match_score 
  WHERE player_match_score.match_id = ${matchId}`
  const matchPlayerDetail = await db.all(getPlayerMatcPlayerhQuery)
  response.send(matchPlayerDetail)
})
