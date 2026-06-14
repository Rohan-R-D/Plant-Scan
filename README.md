# Plant Analysis Tool

A lightweight Express.js application that uses the Google Gemini 2.5 Flash model to analyze uploaded plant images for species identification, health assessment, and care recommendations, generating a downloadable PDF report.

---

## 🛠️ Prerequisites

- **Node.js** (v18 or higher recommended)
- A **Google AI Studio API Key** (Pre-fixed with `AQ.`)

---

## 🔑 Authentication & API Key Setup

Google AI Studio utilizes secure **Authorization Keys** prefixed with `AQ.`. Because these keys are bound to a managed service backend, standard SDK libraries can sometimes trigger authentication conflicts (such as `ACCESS_TOKEN_TYPE_UNSUPPORTED`) on local Windows development environments. 

To bypass these library routing bugs completely, this project intentionally avoids heavy SDK packages and uses a direct, clean **HTTPS REST API** fetch configuration targeting Google's official developer-tier endpoints.

### How to Get Your API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click on the **Get API key** button in the top-left sidebar.
3. Click **Create API key**.
4. Select **Create API key in a new project** (This isolates your development quota and ensures you stay on the free tier without needing a credit card or a Google Cloud billing account).
5. Copy the generated key string, which starts with `AQ.`.

---

## ⚙️ Environment Configuration

1. In the root directory of your project, create a file named `.env`.
2. Open the file and add your configuration details exactly as shown below:

```env
GEMINI_API_KEY="PASTE_YOUR_AQ_KEY_HERE"
PORT=5000