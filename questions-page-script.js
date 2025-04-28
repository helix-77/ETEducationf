import { supabase } from "./supabase.js";
import { checkAuthStatus } from "./navigation.js";

// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", async function () {
  const session = await checkAuthStatus();
  await setupQuestionForm(session);
  await loadQuestions();
});

async function setupQuestionForm(session) {
  const askButton = document.getElementById("submit-question");
  const questionInput = document.getElementById("question-input");
  const loginPrompt = document.getElementById("login-prompt");
  const questionForm = document.getElementById("question-form");

  if (!session) {
    // User not logged in
    askButton.style.display = "none";
    questionInput.disabled = true;
    questionInput.placeholder = "Please login to ask a question";
    loginPrompt.style.display = "block";
    questionForm.classList.add("opacity-50");
  } else {
    // User is logged in
    askButton.style.display = "block";
    questionInput.disabled = false;
    loginPrompt.style.display = "none";
    questionForm.classList.remove("opacity-50");
  }
}

async function submitQuestion() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) {
    window.location.href = "login.html";
    return;
  }

  const questionText = document.getElementById("question-input").value;
  if (!questionText.trim()) {
    alert("Please enter a question");
    return;
  }

  try {
    const { data, error } = await supabase.from("questions").insert([
      {
        content: questionText,
        user_id: session.session.user.id,
        user_email: session.session.user.email,
      },
    ]);

    if (error) throw error;

    alert("Question submitted successfully!");
    document.getElementById("question-input").value = "";
    await loadQuestions();
  } catch (error) {
    alert("Error submitting question: " + error.message);
    console.error(error);
  }
}

async function loadQuestions() {
  try {
    const { data: session } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from("questions")
      .select("*, replies(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const questionsContainer = document.getElementById("recent-questions");
    if (data.length === 0) {
      questionsContainer.innerHTML =
        '<p class="text-gray-600">No questions have been asked yet.</p>';
      return;
    }

    let questionHTML = "";
    data.forEach((question) => {
      const replies = question.replies || [];
      let repliesHTML = replies
        .map(
          (reply) => `
            <div class="bg-gray-50 p-3 rounded mb-2">
              <p>${reply.content}</p>
              <p class="text-xs text-gray-500 mt-1">Replied by: ${
                reply.user_email
              } - ${new Date(reply.created_at).toLocaleDateString()}</p>
            </div>
          `
        )
        .join("");

      // Reply section with conditional visibility based on login status
      const replySection = session?.session
        ? `
        <div class="mt-4">
          <button
            onclick="window.toggleReplyForm('${question.id}')"
            class="text-sm text-violet-600 hover:text-violet-800"
          >
            Reply to this question
          </button>
          <div id="reply-form-${question.id}" class="hidden mt-2">
            <textarea
              id="reply-input-${question.id}"
              placeholder="Type your reply..."
              class="w-full p-2 border rounded mb-2"
              rows="3"
            ></textarea>
            <button
              onclick="window.submitReply('${question.id}')"
              class="bg-violet-700 text-white px-4 py-2 rounded text-sm"
            >
              Submit Reply
            </button>
          </div>
        </div>
      `
        : "";

      questionHTML += `
        <div class="bg-white p-4 rounded shadow-md mb-4">
          <p class="font-medium">${question.content}</p>
          <p class="text-sm text-gray-500 mt-2">Asked by: ${
            question.user_email
          } - ${new Date(question.created_at).toLocaleDateString()}</p>

          ${
            repliesHTML
              ? `
            <div class="mt-4">
              <h4 class="text-sm font-semibold mb-2">Replies:</h4>
              ${repliesHTML}
            </div>
          `
              : ""
          }

          ${replySection}
        </div>
      `;
    });

    questionsContainer.innerHTML = questionHTML;
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

function toggleReplyForm(questionId) {
  const replyForm = document.getElementById(`reply-form-${questionId}`);
  replyForm.classList.toggle("hidden");
}

async function submitReply(questionId) {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) {
    alert("Please log in to submit a reply");
    return;
  }

  const replyInput = document.getElementById(`reply-input-${questionId}`);
  const replyText = replyInput.value.trim();

  if (!replyText) {
    alert("Please enter a reply");
    return;
  }

  try {
    const { error } = await supabase.from("replies").insert({
      question_id: questionId,
      content: replyText,
      user_id: session.session.user.id,
      user_email: session.session.user.email,
    });

    if (error) throw error;

    // Clear and hide reply form
    replyInput.value = "";
    document.getElementById(`reply-form-${questionId}`).classList.add("hidden");

    // Reload questions to show the new reply
    await loadQuestions();

    alert("Reply submitted successfully!");
  } catch (error) {
    console.error("Error submitting reply:", error);
    alert("Failed to submit reply. Please try again.");
  }
}

// Expose functions to global scope for inline event handlers
window.submitQuestion = submitQuestion;
window.toggleReplyForm = toggleReplyForm;
window.submitReply = submitReply;
