from pydantic import BaseModel, UUID4
from typing import Optional

class TeamBase(BaseModel):
    name: str
    region: str
    description: Optional[str] = None

class PlayerBase(BaseModel):
    name: str
    team_id: UUID4
    position: str
    age: int
    jersey_number: int
    race: Optional[str] = None

class Team(TeamBase):
    id: UUID4

class Player(PlayerBase):
    id: UUID4