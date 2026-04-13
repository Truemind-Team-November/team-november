import client from "@/lib/client";

/**
 * Enrolls a user in a specific course.
 * This function handles the POST /api/Enrollment/{courseId} request.
 */
export const enrollLearner = async (courseId, userRole) => {
  // Client-side safety check: Don't even hit the API if the user isn't a Learner
  if (userRole !== "Learner") {
    return {
      success: false,
      message: "Enrollment is restricted to Learners only."
    };
  }

  try {
    // Note: Since your client uses config.headers.Authorization, 
    // the Bearer token is automatically attached here.
    const response = await client.post(`/Enrollment/${courseId}`);
    
    // Return the response data as defined in your Swagger (image_bb3868.png)
    return response.data; 

  } catch (error) {
    if (error.response) {
      // Return the specific error from your backend (e.g., 400 Bad Request)
      return {
        success: false,
        message: error.response.data.message || "An error occurred during enrollment.",
        errors: error.response.data.errors
      };
    }
    return {
      success: false,
      message: "Server unreachable. Please check your connection."
    };
  }
};