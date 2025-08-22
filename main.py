from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, status
from typing import List
from database import supabase
from models import Team, TeamBase, Player, PlayerBase, UUID4

app = FastAPI()

origins = ["http://127.0.0.1:5173","http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Teams Endpoints ---

@app.post("/teams", response_model=Team, status_code=status.HTTP_201_CREATED)
def create_team(team: TeamBase):
    """
    Create a new team.
    """
    try:
        data, _ = supabase.from_("teams").insert(team.dict()).execute()
        return data[1][0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/teams", response_model=List[Team])
def get_all_teams():
    """
    Retrieve all teams.
    """
    try:
        data, _ = supabase.from_("teams").select("*").execute()
        return data[1]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/teams/{team_id}", response_model=Team)
def get_team(team_id: UUID4):
    """
    Retrieve a single team by its ID.
    """
    try:
        data, _ = supabase.from_("teams").select("*").eq("id", str(team_id)).single().execute()
        return data[1]
    except Exception as e:
        raise HTTPException(status_code=404, detail="Team not found.")

@app.put("/teams/{team_id}", response_model=Team)
def update_team(team_id: UUID4, team: TeamBase):
    """
    Update an existing team.
    """
    try:
        data, _ = supabase.from_("teams").update(team.dict()).eq("id", str(team_id)).execute()
        if not data[1]:
            raise HTTPException(status_code=404, detail="Team not found.")
        return data[1][0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: UUID4):
    """
    Delete a team by its ID.
    """
    try:
        data, _ = supabase.from_("teams").delete().eq("id", str(team_id)).execute()
        if not data[1]:
            raise HTTPException(status_code=404, detail="Team not found.")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Players Endpoints ---

@app.post("/players", response_model=Player, status_code=status.HTTP_201_CREATED)
def create_player(player: PlayerBase):
    """
    Create a new player.
    """
    try:
        data, _ = supabase.from_("players").insert(player.dict()).execute()
        return data[1][0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/players", response_model=List[Player])
def get_all_players():
    """
    Retrieve all players.
    """
    try:
        data, _ = supabase.from_("players").select("*").execute()
        return data[1]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/players/{player_id}", response_model=Player)
def get_player(player_id: UUID4):
    """
    Retrieve a single player by their ID.
    """
    try:
        data, _ = supabase.from_("players").select("*").eq("id", str(player_id)).single().execute()
        return data[1]
    except Exception as e:
        raise HTTPException(status_code=404, detail="Player not found.")

@app.put("/players/{player_id}", response_model=Player)
def update_player(player_id: UUID4, player: PlayerBase):
    """
    Update an existing player.
    """
    try:
        data, _ = supabase.from_("players").update(player.dict()).eq("id", str(player_id)).execute()
        if not data[1]:
            raise HTTPException(status_code=404, detail="Player not found.")
        return data[1][0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(player_id: UUID4):
    """
    Delete a player by their ID.
    """
    try:
        data, _ = supabase.from_("players").delete().eq("id", str(player_id)).execute()
        if not data[1]:
            raise HTTPException(status_code=404, detail="Player not found.")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))