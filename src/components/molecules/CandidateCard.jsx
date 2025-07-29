import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const CandidateCard = ({ candidate, className, onView, onContact }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "primary";
      case "interviewed":
        return "secondary";
      case "hired":
        return "active";
      case "rejected":
        return "inactive";
      default:
        return "default";
    }
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-lg">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-display text-gray-900">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-600">{candidate.position}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(candidate.status)}>
            {candidate.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
            {candidate.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} className="mr-2 text-gray-400" />
            Applied {format(new Date(candidate.appliedAt), "MMM d, yyyy")}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView?.(candidate)}
            className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          >
            View Profile
          </button>
          <button
            onClick={() => onContact?.(candidate)}
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ApperIcon name="MessageSquare" size={16} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;