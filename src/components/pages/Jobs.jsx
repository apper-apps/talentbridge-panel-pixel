import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import JobCard from "@/components/molecules/JobCard";
import JobModal from "@/components/organisms/JobModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { jobService } from "@/services/api/jobService";
import { toast } from "react-toastify";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await jobService.getAll();
      setJobs(data);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.requiredSkills && job.requiredSkills.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.jobType && job.jobType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateJob = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        const updatedJob = await jobService.update(editingJob.Id, jobData);
        setJobs(prev => prev.map(job => 
          job.Id === editingJob.Id ? updatedJob : job
        ));
      } else {
        const newJob = await jobService.create(jobData);
        setJobs(prev => [newJob, ...prev]);
      }
    } catch (err) {
      throw new Error(err.message || "Failed to save job");
    }
  };

  const handleDeleteJob = async (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      try {
        await jobService.delete(job.Id);
        setJobs(prev => prev.filter(j => j.Id !== job.Id));
        toast.success("Job deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete job");
      }
    }
  };

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadJobs} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Job Openings
          </h1>
          <p className="text-gray-600">
            Manage your job postings and track applications
          </p>
        </div>
        <Button onClick={handleCreateJob} className="shrink-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Job
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search jobs..."
        />
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Empty
          title="No jobs found"
          description={searchTerm ? "Try adjusting your search terms." : "Create your first job posting to get started."}
          icon="Briefcase"
          actionLabel={!searchTerm ? "Add Job" : undefined}
          onAction={!searchTerm ? handleCreateJob : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.Id}
              job={job}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      )}

      {/* Job Modal */}
      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveJob}
        job={editingJob}
      />
    </div>
  );
};

export default Jobs;