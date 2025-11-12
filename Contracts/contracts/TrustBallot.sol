// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustBallot {
    // ---------- Owner (Admin) ----------
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ---------- Election State ----------
    enum ElectionState { CREATED, ONGOING, ENDED }
    ElectionState public state = ElectionState.CREATED;

    // ---------- Candidate ----------
    struct Candidate {
        uint256 id;
        string name;
        string meta; // optional (party info or IPFS)
        uint256 voteCount;
        bool exists;
    }

    mapping(uint256 => Candidate) private candidates;
    uint256[] private candidateIds;
    uint256 private nextCandidateId = 1;
    

    // ---------- Voter ----------
    struct Voter {
        string name;
        string image; // IPFS image URL
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId; // 0 if not voted
    }

    mapping(address => Voter) public voters;
    address[] private voterAddresses;

    // ---------- Events ----------
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoterRegistered(address indexed voter, string name, string image);
    event ElectionStarted();
    event ElectionEnded();
    event Voted(address indexed voter, uint256 indexed candidateId);

    // ---------- Admin Functions ----------
    function addCandidate(string calldata _name, string calldata _meta) external onlyOwner {
        uint256 id = nextCandidateId++;
        candidates[id] = Candidate({
            id: id,
            name: _name,
            meta: _meta,
            voteCount: 0,
            exists: true
        });
        candidateIds.push(id);
        emit CandidateAdded(id, _name);
    }

// Also update registerVoter (admin registration)
function registerVoter(address _voter, string calldata _name, string calldata _image) external onlyOwner {
    require(_voter != address(0), "Invalid address");
    require(!voters[_voter].isRegistered, "Already registered");
    voters[_voter] = Voter(_name, _image, true, false, 0);
    voterAddresses.push(_voter); // ✅ track admin-registered voters
    emit VoterRegistered(_voter, _name, _image);
}

// Update selfRegister to push the address
function selfRegister(string calldata _name, string calldata _image) external {
    require(!voters[msg.sender].isRegistered, "Already registered");
    voters[msg.sender] = Voter(_name, _image, true, false, 0);
    voterAddresses.push(msg.sender); //  track the voter address
    emit VoterRegistered(msg.sender, _name, _image);
}

// ---------- New function ----------
function getAllVoters() public view returns (Voter[] memory, address[] memory) {
    Voter[] memory list = new Voter[](voterAddresses.length);
    for (uint256 i = 0; i < voterAddresses.length; i++) {
        list[i] = voters[voterAddresses[i]];
    }
    return (list, voterAddresses);
}

    // ---------- Election Controls ----------
  function startElection() external onlyOwner {
    require(state == ElectionState.CREATED || state == ElectionState.ENDED, "Election is ongoing");

    // 🧹 Reset all candidates and voters for new election
    for (uint256 i = 0; i < candidateIds.length; i++) {
        delete candidates[candidateIds[i]];
    }
    delete candidateIds;
    nextCandidateId = 1;

    for (uint256 i = 0; i < voterAddresses.length; i++) {
        delete voters[voterAddresses[i]];
    }
    delete voterAddresses;

    state = ElectionState.ONGOING;
    emit ElectionStarted();
}


    function endElection() external onlyOwner {
        require(state == ElectionState.ONGOING, "Election not ongoing");
        state = ElectionState.ENDED;
        emit ElectionEnded();
    }

    // ---------- Voting ----------
    function vote(uint256 _candidateId) external {
        require(state == ElectionState.ONGOING, "Voting not allowed");
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "Not a registered voter");
        require(!sender.hasVoted, "Already voted");

        Candidate storage cand = candidates[_candidateId];
        require(cand.exists, "Candidate not exists");

        cand.voteCount += 1;
        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;

        emit Voted(msg.sender, _candidateId);
    }

    // ---------- View Functions ----------
    function getCandidate(uint256 _id)
        public
        view
        returns (uint256 id, string memory name, string memory meta, uint256 voteCount)
    {
        Candidate storage c = candidates[_id];
        require(c.exists, "Candidate not exists");
        return (c.id, c.name, c.meta, c.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory list = new Candidate[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            list[i] = candidates[candidateIds[i]];
        }
        return list;
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidateIds.length;
    }

   function getWinner()
    public
    view
    returns (uint256 winnerId, string memory winnerName, uint256 winnerVotes, string memory status)
{
    require(state == ElectionState.ENDED, "Election not ended");

    uint256 topId = 0;
    uint256 topVotes = 0;
    uint256 tieCount = 0;

    for (uint256 i = 0; i < candidateIds.length; i++) {
        Candidate storage c = candidates[candidateIds[i]];
        if (c.voteCount > topVotes) {
            topVotes = c.voteCount;
            topId = c.id;
            tieCount = 1; // reset tie count
        } else if (c.voteCount == topVotes) {
            tieCount++;
        }
    }

    if (topVotes == 0) {
        return (0, "", 0, "No winner");
    }

    if (tieCount > 1) {
        return (0, "", topVotes, "Election tied");
    }

    return (topId, candidates[topId].name, topVotes, "Winner declared");
}

    function isVoterRegistered(address _addr) public view returns (bool) {
        return voters[_addr].isRegistered;
    }

    function hasVoted(address _addr) public view returns (bool) {
        return voters[_addr].hasVoted;
    }

    function getVoter(address _addr)
        public
        view
        returns (string memory name, string memory image, bool isRegistered, bool hasVoted, uint256 votedId)
    {
        Voter memory v = voters[_addr];
        return (v.name, v.image, v.isRegistered, v.hasVoted, v.votedCandidateId);
    }

    // ---------- Utility ----------
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "zero address");
        owner = _newOwner;
    }
}
