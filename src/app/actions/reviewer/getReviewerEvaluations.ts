'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewerEvaluations(submissionId: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    console.log('🔍 Fetching evaluations for submission:', submissionId);
    console.log('👤 Current user:', user.id);

    // Get submission details directly
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) {
      console.error('❌ Error fetching submission:', submissionError);
      return { success: false, error: 'Submission not found' };
    }

    console.log('✅ Submission found:', submission.title);
    const { data: allDocsWithIds } = await supabase
      .from('uploaded_documents')
      .select('submission_id, document_type, file_name')
      .order('uploaded_at', { ascending: false });

    console.log('🔍 ALL documents in table:');
    allDocsWithIds?.forEach(doc => {
      console.log(`   ${doc.submission_id} → ${doc.document_type}: ${doc.file_name}`);
    });
    // Check if consolidated_review exists at all
    const consolidatedReviewDocs = allDocsWithIds?.filter(d => d.document_type === 'consolidated_review');
    console.log(`📄 Total consolidated_review documents: ${consolidatedReviewDocs?.length}`);
    consolidatedReviewDocs?.forEach(doc => {
      console.log(`   - submission: ${doc.submission_id}`);
    });
    // ✅ Get consolidated document FOR REVIEWER (anonymous version) - WITH DEBUG
    console.log('🔍 Searching for consolidated_review');
    console.log('   submission_id:', submissionId);
    console.log('   document_type: consolidated_review');

    const { data: consolidatedDoc, error: docError } = await supabase
      .from('uploaded_documents')
      .select('id, submission_id, document_type, file_name, file_url, uploaded_at, revision_count')  // ✅ ADD THIS
      .eq('submission_id', submissionId)
      .eq('document_type', 'consolidated_review')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('📄 Result:', {
      found: !!consolidatedDoc,
      doc: consolidatedDoc,
      error: docError?.message,
      errorCode: docError?.code
    });

    // ✅ If still not found, try fetching ALL documents for this submission
    if (!consolidatedDoc) {
      console.log('⚠️ Not found, fetching ALL documents for this submission...');
      const { data: allDocs } = await supabase
        .from('uploaded_documents')
        .select('*')
        .eq('submission_id', submissionId)
        .order('uploaded_at', { ascending: false });

      console.log('📚 All documents found:', allDocs?.length || 0);
      allDocs?.forEach(doc => {
        console.log(`   - ${doc.document_type}: ${doc.file_name}`);
      });
    }




    // ✅ Generate signed URL (SAME AS getSubmissionForReview)
    let signedUrl = null;
    if (consolidatedDoc && !docError) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600); // 1 hour expiry

      signedUrl = urlData?.signedUrl;
      console.log('🔗 Signed URL generated:', signedUrl ? 'Yes' : 'No');
    }

    // ✅ Get ALL submitted reviews for this submission
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false });

    if (reviewsError) {
      console.error('❌ Error fetching reviews:', reviewsError);
      return { success: false, error: reviewsError.message };
    }

    console.log('📊 Reviews found:', reviews?.length || 0);

    // Get reviewer profiles for all reviews
    const reviewerIds = reviews?.map(r => r.reviewer_id) || [];
    const { data: reviewers } = await supabase
      .from('profiles')
      .select('id, full_name, reviewer_code')
      .in('id', reviewerIds);

    console.log('👥 Reviewers found:', reviewers?.length || 0);

    // Create a map of reviewer info
    const reviewerMap = new Map(reviewers?.map(r => [r.id, r]) || []);

    // Get all review IDs to fetch replies
    const reviewIds = reviews?.map(r => r.id) || [];

    // Fetch all replies for these reviews
    const { data: allReplies } = await supabase
      .from('review_replies')
      .select('*')
      .in('review_id', reviewIds)
      .order('created_at', { ascending: true });

    console.log('💬 Replies found:', allReplies?.length || 0);

    // Get reviewer profiles for reply authors
    const replyReviewerIds = allReplies?.map(r => r.reviewer_id) || [];
    const { data: replyReviewers } = await supabase
      .from('profiles')
      .select('id, full_name, reviewer_code')
      .in('id', replyReviewerIds);

    // Create a map for reply reviewers
    const replyReviewerMap = new Map(replyReviewers?.map(r => [r.id, r]) || []);

    // Group replies by review_id
    const repliesByReview: { [key: string]: any[] } = {};
    allReplies?.forEach(reply => {
      if (!repliesByReview[reply.review_id]) {
        repliesByReview[reply.review_id] = [];
      }
      const replyReviewer = replyReviewerMap.get(reply.reviewer_id);
      repliesByReview[reply.review_id].push({
        id: reply.id,
        reviewerId: reply.reviewer_id,
        name: replyReviewer?.full_name || 'Reviewer',
        code: replyReviewer?.reviewer_code || 'N/A',
        date: new Date(reply.created_at).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        }),
        text: reply.reply_text,
      });
    });

    // Format the evaluations with CORRECT field names
    const evaluations = reviews?.map(review => {
      const reviewer = reviewerMap.get(review.reviewer_id);

      // Combine Protocol and ICF recommendations
      const protocolRec = review.protocol_recommendation || '';
      const icfRec = review.icf_recommendation || '';
      const decision = protocolRec || icfRec || 'Pending';

      const protocolEthics = review.protocol_ethics_recommendation || '';
      const icfEthics = review.icf_ethics_recommendation || '';
      const ethicsRecommendation = [protocolEthics, icfEthics].filter(Boolean).join(' | ') || 'No recommendation provided';

      const protocolTech = review.protocol_technical_suggestions || '';
      const icfTech = review.icf_technical_suggestions || '';
      const technicalSuggestions = [protocolTech, icfTech].filter(Boolean).join(' | ') || 'No suggestions provided';

      return {
        id: review.id,
        reviewerId: review.reviewer_id,
        name: reviewer?.full_name || 'Reviewer',
        code: reviewer?.reviewer_code || 'N/A',
        date: review.submitted_at ? new Date(review.submitted_at).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        }) : 'N/A',
        decision,
        ethicsRecommendation,
        technicalSuggestions,
        status: review.status || 'draft',
        replies: repliesByReview[review.id] || []
      };
    }) || [];

    console.log('✅ Formatted evaluations:', evaluations.length);

    // Get assignment info for due date
    const { data: assignment } = await supabase
      .from('reviewer_assignments')
      .select('assigned_at, status')  // ✅ Add status here
      .eq('submission_id', submissionId)
      .eq('reviewer_id', user.id)
      .maybeSingle();

    console.log('📋 Assignment:', assignment?.status);  // ✅ Debug log

    // Calculate due date
    const assignedDate = assignment?.assigned_at
      ? new Date(assignment.assigned_at)
      : new Date(submission.submitted_at);
    const dueDate = new Date(assignedDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const getOrdinalSuffix = (num: number) => {
      const j = num % 10;
      const k = num % 100;

      if (j === 1 && k !== 11) return 'st';
      if (j === 2 && k !== 12) return 'nd';
      if (j === 3 && k !== 13) return 'rd';
      return 'th';
    };

    return {
      success: true,
      evaluations,
      currentReviewerId: user.id,
      assignmentStatus: assignment?.status || 'pending',  // ✅ NEW LINE
      submission: {
        id: submission.id,
        title: submission.title,
        description: submission.description || 'No description provided',
        category: submission.classification_type || 'Full Review',
        assignedDate: assignedDate.toLocaleDateString('en-US'),
        submittedDate: new Date(submission.submitted_at).toLocaleDateString('en-US'),
        dueDate: dueDate.toLocaleDateString('en-US'),
        status: submission.status,
      },
      consolidatedDocument: consolidatedDoc ? {
        name: consolidatedDoc.file_name,
        displayTitle: consolidatedDoc.revision_count > 0
          ? `Consolidated Application (${consolidatedDoc.revision_count + 1}${getOrdinalSuffix(consolidatedDoc.revision_count + 1)} Revision) - ${submission.title}`
          : `Consolidated Application - ${submission.title}`,
        url: signedUrl,
        uploadedAt: consolidatedDoc.uploaded_at,
        revisionCount: consolidatedDoc.revision_count || 0
      } : null

    };

  } catch (error) {
    console.error('❌ Error in getReviewerEvaluations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load evaluations',
    };
  }
}
