import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import parse from "html-react-parser";
import Loader from "../../components/Loader/Loader";

// Add utility functions at the top
const formatSelectionProcess = (process) => {
  if (!process) return "Not specified";
  const steps = [];

  if (process.onlineAssessment) {
    const assessments = Object.entries(process.onlineAssessment)
      .filter(([_, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase());
    if (assessments.length) steps.push(...assessments);
  }

  if (process.groupDiscussion) steps.push("group discussion");
  if (process.onlineInterview) steps.push("online interview");
  if (process.offlineInterview) steps.push("offline interview");
  if (process.others?.length) steps.push(...process.others);

  return steps.length ? steps.join(", ") : "Not specified";
};

const formatCompensation = (compensation) => {
  if (!compensation) return "Not disclosed";
  const parts = [];
  if (compensation.stipend) parts.push(`Stipend: ₹${compensation.stipend}/month`);
  if (compensation.ctc) parts.push(`CTC: ₹${compensation.ctc} LPA`);
  if (compensation.baseSalary) parts.push(`Base: ₹${compensation.baseSalary} LPA`);
  return parts.length ? parts.join(" | ") : "Not disclosed";
};

const formatCGPA = (cgpa) => {
  if (!cgpa) return "Not specified";
  return `Boys: ${cgpa.boys || "N/A"} | Girls: ${cgpa.girls || "N/A"}`;
};

const formatCount = (count) => {
  if (!count) return "Not specified";
  return `Boys: ${count.boys || 0} | Girls: ${count.girls || 0}`;
};

const AdminPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const coreToken = localStorage.getItem('core-token');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts/${id}`,
          {
            headers: { 'Authorization': `Bearer ${coreToken}` }
          }
        );
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching post details');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, coreToken]);

  const handleVerify = async () => {
    try {
      const loadingToast = toast.loading('Verifying post...');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/posts/${id}/verify`,
        {},
        {
          headers: { 'Authorization': `Bearer ${coreToken}` }
        }
      );
      toast.dismiss(loadingToast);
      toast.success('Post verified successfully');
      navigate('/core/admin/verify-posts');
    } catch (error) {
      toast.error('Error verifying post');
    }
  };

  if (loading) return <Loader />;
  if (!post) return <div className="text-white">Post not found</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Verification Controls */}
      <div className={`mb-6 p-4 rounded-lg ${post.isVerified ? 'bg-green-900' : 'bg-yellow-900'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Verification Status: {post.isVerified ? 'Verified' : 'Pending Verification'}
            </h3>
            {post.verifiedBy && (
              <p className="text-sm text-gray-300">
                Verified by {post.verifiedBy} on {new Date(post.verifiedAt).toLocaleString()}
              </p>
            )}
          </div>
          {!post.isVerified && (
            <button
              onClick={handleVerify}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Verify Post
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Post Header */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-2">Author Information</h3>
              <p className="text-gray-300">Name: {post.author.fullName}</p>
              <p className="text-gray-300">Admission Number: {post.author.admissionNumber}</p>
              <a 
                href={post.author.linkedInProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                LinkedIn Profile
              </a>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Post Information</h3>
              <p className="text-gray-300">Created: {new Date(post.createdAt).toLocaleString()}</p>
              <p className="text-gray-300">Last Updated: {new Date(post.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Post Content</h3>
          <div className="prose prose-invert max-w-none">
            {parse(post.content)}
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Job Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow label="Company" value={post.company} />
            <DetailRow label="Campus Type" value={post.campusType} />
            <DetailRow label="Job Type" value={post.jobType} />
            <DetailRow label="Work Mode" value={post.workMode} />
            <DetailRow label="Location(s)" value={post.location?.join(", ")} />
            <DetailRow label="Difficulty Level" value={`${post.difficultyLevel}/10`} />
            <DetailRow label="Hiring Period" value={`${new Date(0, post.hiringPeriod?.month - 1).toLocaleString('default', { month: 'long' })} ${post.hiringPeriod?.year}`} />
            <DetailRow label="Selection Process" value={formatSelectionProcess(post.selectionProcess)} />
            <DetailRow label="Compensation" value={formatCompensation(post.compensation)} />
            <DetailRow label="Role" value={post.role} />
            <DetailRow 
              label="Offer Status" 
              value={post.offerDetails.receivedOffer ? 
                `Received${post.offerDetails.acceptedOffer ? ' - Accepted' : ' - Not accepted'}` : 
                'No offer received'} 
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Placement Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow 
              label="CGPA Criteria" 
              value={`Boys: ${post.cgpaCriteria?.boys || 'N/A'} | Girls: ${post.cgpaCriteria?.girls || 'N/A'}`} 
            />
            <DetailRow 
              label="Shortlisted Count" 
              value={`Boys: ${post.shortlistedCount?.boys || '0'} | Girls: ${post.shortlistedCount?.girls || '0'}`} 
            />
            <DetailRow 
              label="Selected Count" 
              value={`Boys: ${post.selectedCount?.boys || '0'} | Girls: ${post.selectedCount?.girls || '0'}`} 
            />
          </div>
        </div>

        {/* Activity */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Post Activity</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow label="Comments" value={`${post.comments?.length || 0} comments`} />
            <DetailRow label="Questions" value={`${post.questions?.length || 0} questions`} />
            <DetailRow label="Tags" value={post.tags?.join(", ") || "No tags"} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent detail rows
const DetailRow = ({ label, value }) => (
  <div className="col-span-1">
    <p className="text-blue-400">{label}:</p>
    <p className="text-gray-300">{value || "Not specified"}</p>
  </div>
);

export default AdminPostDetail;
