import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const JobModal = ({ isOpen, onClose, onSave, job = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    status: "active"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        description: job.description || "",
        status: job.status || "active"
      });
    } else {
      setFormData({
        title: "",
        company: "",
        description: "",
        status: "active"
      });
    }
    setErrors({});
  }, [job, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(job ? "Job updated successfully!" : "Job created successfully!");
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold font-display text-gray-900">
                  {job ? "Edit Job" : "Create New Job"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <FormField
                  label="Job Title"
                  required
                  error={errors.title}
                >
                  <Input
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    error={errors.title}
                  />
                </FormField>

                <FormField
                  label="Company"
                  required
                  error={errors.company}
                >
                  <Input
                    placeholder="e.g. Tech Corp Inc."
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    error={errors.company}
                  />
                </FormField>

                <FormField
                  label="Status"
                >
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </FormField>

                <FormField
                  label="Job Description"
                  required
                  error={errors.description}
                >
                  <Textarea
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    error={errors.description}
                    rows={4}
                  />
                </FormField>

                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        {job ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <ApperIcon name={job ? "Save" : "Plus"} size={16} className="mr-2" />
                        {job ? "Update Job" : "Create Job"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JobModal;