

export const fetchContributors = async (GITHUB_TOKEN, OWNER = 'Nexus-SVNIT', REPO = 'Nexus') => {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN.trim() !== '') {
      headers.Authorization = GITHUB_TOKEN.startsWith('token ') || GITHUB_TOKEN.startsWith('Bearer ')
        ? GITHUB_TOKEN
        : `token ${GITHUB_TOKEN}`;
    }

    let response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/stats/contributors`,
      { headers }
    );

    // If unauthorized (e.g. revoked token), retry without authorization header for public repo
    if (response.status === 401 && headers.Authorization) {
      response = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/stats/contributors`
      );
    }

    if (!response.ok) {
      console.warn(`GitHub contributors API returned status ${response.status}`);
      return {};
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      return {};
    }
    
    // Process and structure the data
    const contributorsByYear = data.reduce((acc, contributor) => {
      if (!contributor || !contributor.author) return acc;

      const details = {
        name: contributor.author.login,
        github: contributor.author.login,
        commits: contributor.total,
        avatar: contributor.author.avatar_url,
      };

      // Get the latest contribution year
      const weeks = contributor.weeks || [];
      const latestWeek = weeks.filter(week => week.c > 0).pop();
      if (latestWeek) {
        const year = new Date(latestWeek.w * 1000).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(details);
      }

      return acc;
    }, {});

    // Sort contributors by commit count within each year
    Object.keys(contributorsByYear).forEach(year => {
      contributorsByYear[year].sort((a, b) => b.commits - a.commits);
    });

    return contributorsByYear;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return {};
  }
};
