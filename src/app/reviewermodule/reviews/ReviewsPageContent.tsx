'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReviewerAssignments } from '@/app/actions/reviewer/getReviewerAssignments';

// Feature Components
import ReviewsHeader from '@/components/reviewer/reviews/ReviewsHeader';
import ReviewsStats from '@/components/reviewer/reviews/ReviewsStats';
import FilterBar from '@/components/reviewer/reviews/FilterBar';
import ReviewsList from '@/components/reviewer/reviews/ReviewsList';
import ReviewsLoading from '@/components/reviewer/reviews/ReviewsLoading';

// Types
export interface Review {
  id: string;
  title: string;
  category: string;
  assignedDate: string;
  dueDate: string;
  status: 'Completed' | 'Overdue' | 'Pending';
}

export default function ReviewsPageContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Submissions');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const result = await getReviewerAssignments();
      if (result.success) {
        setReviews(result.assignments || []);
      } else {
        console.error('Failed to load assignments:', result.error);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = (id: string) => {
    router.push(`/reviewermodule/reviews/details?id=${id}`);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All Submissions' || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    completed: reviews.filter(r => r.status === 'Completed').length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    overdue: reviews.filter(r => r.status === 'Overdue').length,
  };

  if (loading) return <ReviewsLoading />;

  return (
    <>
      <ReviewsHeader />
      
      <ReviewsStats stats={stats} />

      <FilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        filterStatus={filterStatus} 
        setFilterStatus={setFilterStatus} 
      />

      <ReviewsList 
        reviews={filteredReviews} 
        totalReviews={reviews.length} 
        onAction={handleReviewAction}
        searchActive={!!searchQuery || filterStatus !== 'All Submissions'}
      />
    </>
  );
}
