import jobsData from "@/services/mockData/jobs.json";

let jobs = [...jobsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const jobService = {
  async getAll() {
    await delay(300);
    return [...jobs];
  },

  async getById(id) {
    await delay(200);
    const job = jobs.find(job => job.Id === parseInt(id));
    if (!job) {
      throw new Error("Job not found");
    }
    return { ...job };
  },

  async create(jobData) {
    await delay(400);
    const newJob = {
      Id: Math.max(...jobs.map(j => j.Id), 0) + 1,
      ...jobData,
      createdAt: new Date().toISOString(),
      applicants: 0
    };
    jobs.push(newJob);
    return { ...newJob };
  },

  async update(id, updateData) {
    await delay(350);
    const index = jobs.findIndex(job => job.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    jobs[index] = { ...jobs[index], ...updateData };
    return { ...jobs[index] };
  },

  async delete(id) {
    await delay(250);
    const index = jobs.findIndex(job => job.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    const deletedJob = jobs.splice(index, 1)[0];
    return { ...deletedJob };
  }
};