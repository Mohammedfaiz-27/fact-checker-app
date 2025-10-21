import uuid

class ClaimRepository:
    def __init__(self):
        # In-memory storage for development (no MongoDB required)
        self.claims = {}

    def save(self, claim: dict):
        claim_id = str(uuid.uuid4())
        claim['id'] = claim_id
        self.claims[claim_id] = claim
        return claim_id

    def get_by_id(self, claim_id: str):
        return self.claims.get(claim_id)

    def get_all(self):
        return list(self.claims.values())
