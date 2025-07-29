import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { candidateService } from "@/services/api/candidateService";
import ApperIcon from "@/components/ApperIcon";
import CandidateCard from "@/components/molecules/CandidateCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import CandidateProfileModal from "@/components/organisms/CandidateProfileModal";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await candidateService.getAll();
      setCandidates(data);
    } catch (err) {
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (candidate) => {
    toast.info(`Viewing profile for ${candidate.name}`);
  };

const handleContactCandidate = (candidate) => {
toast.info(`Contacting ${candidate.name} at ${candidate.email}`);
};

const [isAddModalOpen, setIsAddModalOpen] = useState(false);

const handleAddCandidate = async (candidateData) => {
try {
await candidateService.create(candidateData);
await loadCandidates(); // Refresh the list
} catch (error) {
throw new Error(error.message || "Failed to add candidate");
}
};

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "interviewed", label: "Interviewed" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" }
  ];

  const getStatusCounts = () => {
    const counts = {};
    statusOptions.slice(1).forEach(option => {
      counts[option.value] = candidates.filter(c => c.status === option.value).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCandidates} />;
  }

  return (
<div className="space-y-6">
{/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
<div>
<h1 className="text-2xl font-bold font-display text-gray-900">
Candidate Pool
</h1>
<p className="text-gray-600">
Review and manage job applicants
</p>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
{/* Add Candidate Button */}
<Button
onClick={() => setIsAddModalOpen(true)}
className="flex items-center gap-2"
>
<ApperIcon name="Plus" size={16} />
Add Candidate
</Button>

{/* Status Overview */}
<div className="flex items-center space-x-2">
<Badge variant="primary">
{statusCounts.new} New
</Badge>
<Badge variant="secondary">
{statusCounts.interviewed} Interviewed
</Badge>
<Badge variant="active">
{statusCounts.hired} Hired
</Badge>
</div>
</div>
</div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <Empty
          title="No candidates found"
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your search terms or filters." 
            : "No candidates have applied yet."
          }
          icon="Users"
        />
      ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
<CandidateCard
              key={candidate.Id}
              candidate={candidate}
              onView={handleViewCandidate}
              onContact={handleContactCandidate}
            />
          ))}
        </div>
      )}

      {/* Add Candidate Modal */}
      <CandidateProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCandidate}
        mode="add"
      />
    </div>
  );
};

export default Candidates;