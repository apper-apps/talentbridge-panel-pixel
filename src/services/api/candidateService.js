import candidatesData from "@/services/mockData/candidates.json";

let candidates = [...candidatesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const candidateService = {
  async getAll() {
    await delay(300);
    return [...candidates];
  },

  async getById(id) {
    await delay(200);
    const candidate = candidates.find(candidate => candidate.Id === parseInt(id));
    if (!candidate) {
      throw new Error("Candidate not found");
    }
    return { ...candidate };
  },

  async create(candidateData) {
    await delay(400);
    const newCandidate = {
      Id: Math.max(...candidates.map(c => c.Id), 0) + 1,
      ...candidateData,
      appliedAt: new Date().toISOString()
    };
    candidates.push(newCandidate);
    return { ...newCandidate };
  },

  async update(id, updateData) {
    await delay(350);
    const index = candidates.findIndex(candidate => candidate.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Candidate not found");
    }
    candidates[index] = { ...candidates[index], ...updateData };
    return { ...candidates[index] };
  },

  async delete(id) {
    await delay(250);
    const index = candidates.findIndex(candidate => candidate.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Candidate not found");
    }
    const deletedCandidate = candidates.splice(index, 1)[0];
    return { ...deletedCandidate };
  }
};