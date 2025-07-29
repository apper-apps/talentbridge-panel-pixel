import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const JobCard = ({ job, className, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "active";
      case "closed":
        return "inactive";
      case "draft":
        return "pending";
      default:
        return "default";
    }
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold font-display text-gray-900 mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{job.company}</p>
            <Badge variant={getStatusVariant(job.status)}>
              {job.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit?.(job)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
            <button
              onClick={() => onDelete?.(job)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <ApperIcon name="Calendar" size={14} className="mr-1" />
            Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center">
            <ApperIcon name="Users" size={14} className="mr-1" />
            {job.applicants || 0} applicants
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;