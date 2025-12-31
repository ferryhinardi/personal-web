// GitHub API endpoint to update a file
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'ferryhinardi';
const REPO_NAME = 'personal-web';
const FILE_PATH = 'public/resumeData.json';
const BRANCH = 'master';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const { password, data } = req.body;
  
  if (password !== 'ferry2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!githubToken) {
    return res.status(500).json({ 
      error: 'GitHub token not configured. Please add GITHUB_TOKEN to Vercel environment variables.' 
    });
  }

  try {
    // Step 1: Get current file to obtain its SHA
    const fileUrl = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    const getCurrentFile = await fetch(fileUrl, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!getCurrentFile.ok) {
      throw new Error(`Failed to get current file: ${getCurrentFile.statusText}`);
    }

    const currentFile = await getCurrentFile.json();
    const currentSha = currentFile.sha;

    // Step 2: Update the file
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const timestamp = new Date().toISOString();
    
    const updateResponse = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `chore: update resumeData.json via admin dashboard\n\nUpdated at: ${timestamp}`,
        content,
        sha: currentSha,
        branch: BRANCH,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update file: ${errorData.message}`);
    }

    const result = await updateResponse.json();

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Resume data successfully saved to GitHub!',
      commit: {
        sha: result.commit.sha,
        url: result.commit.html_url,
      },
    });

  } catch (error) {
    console.error('Error updating GitHub file:', error);
    return res.status(500).json({ 
      error: 'Failed to save to GitHub', 
      details: error.message 
    });
  }
}
